#Requires -Version 5.1
<#
.SYNOPSIS
  Apply an enrichment patch to a single entry in src\PALSearch.jsx.

.DESCRIPTION
  Locates the entry block beginning with `{ id: <EntryId>` (or `{ id: <EntryId>,`)
  using a brace-counting parser, then within that span:

    - Adds a `tabs:` field if Patch.tabs is set and the entry doesn't already
      have one.
    - For each chapter in Patch.chapters, replaces the existing chapter title
      string with `title — kw1, kw2, kw3` (em-dash join). If the entry has no
      chapters block and Patch.chapters has entries, inserts a new
      `chapters: [...]` field.
    - Adds a `resources:` field if Patch.resources is set and the entry doesn't
      already have one.

  Verifies the file integrity by counting `id: <EntryId>` occurrences before and
  after — if the count changes (entry duplicated or merged) the change is
  rolled back.

.PARAMETER EntryId
  Numeric id (may be a fractional decimal like 3.5) of the entry to patch.

.PARAMETER Patch
  PSCustomObject with optional .tabs, .chapters, .resources (output of
  Fetch-Policy.ps1).

.PARAMETER JsxFile
  Absolute path to src\PALSearch.jsx.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [double] $EntryId,
    [Parameter(Mandatory = $true)] [object] $Patch,
    [Parameter(Mandatory = $true)] [string] $JsxFile
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $JsxFile)) {
    throw "JSX file not found: $JsxFile"
}

# Format id for regex: 3 -> "3", 3.5 -> "3\.5"
function Format-IdPattern([double]$id) {
    if ($id -eq [math]::Floor($id)) {
        return ([int]$id).ToString()
    }
    return ([string]$id).Replace('.', '\.')
}

# JS-string escape for embedded titles/labels.
function Js-Escape([string]$s) {
    if ($null -eq $s) { return '' }
    $t = $s -replace '\\', '\\'
    $t = $t -replace "'", "\'"
    return $t
}

$idPattern = Format-IdPattern $EntryId
$content = Get-Content -Path $JsxFile -Raw -Encoding UTF8

# Count id: <EntryId> occurrences before mutation (used to verify integrity).
$idRegex = "\bid:\s*$idPattern\b"
$beforeCount = ([regex]::Matches($content, $idRegex)).Count
if ($beforeCount -eq 0) {
    throw "entry not found: id=$EntryId"
}

# --- Locate entry span via brace counting -----------------------------------
$startMatch = [regex]::Match($content, "\{\s*id:\s*$idPattern\b")
if (-not $startMatch.Success) {
    throw "entry start not found: id=$EntryId"
}
$entryStart = $startMatch.Index   # position of opening '{'
# Walk forward to find matching closing '}'. Naive brace counter — JSX entries
# are JS object literals so braces inside strings/regex would break this. PAL
# entries don't contain bare '{' inside string literals so it's safe enough,
# but we still skip braces inside ' ... ' or " ... " or ` ... ` strings.
$depth = 0
$i = $entryStart
$inStr = $false
$strCh = $null
while ($i -lt $content.Length) {
    $ch = $content[$i]
    if ($inStr) {
        if ($ch -eq '\') { $i += 2; continue }
        if ($ch -eq $strCh) { $inStr = $false }
        $i++
        continue
    }
    if ($ch -eq "'" -or $ch -eq '"' -or $ch -eq '`') {
        $inStr = $true
        $strCh = $ch
        $i++
        continue
    }
    if ($ch -eq '{') { $depth++ }
    elseif ($ch -eq '}') {
        $depth--
        if ($depth -eq 0) { break }
    }
    $i++
}
if ($depth -ne 0) {
    throw "could not locate end of entry id=$EntryId (unbalanced braces)"
}
$entryEnd = $i  # position of matching '}'
$entryLen = $entryEnd - $entryStart + 1
$entryText = $content.Substring($entryStart, $entryLen)

# --- Apply mutations ---------------------------------------------------------
$newEntry = $entryText
$mutated = $false

# 1. tabs
if ($null -ne $Patch -and $null -ne $Patch.tabs -and $Patch.tabs.Count -gt 0) {
    if ($newEntry -notmatch '(?ms)\btabs\s*:') {
        $tabItems = ($Patch.tabs | ForEach-Object { "'" + (Js-Escape $_) + "'" }) -join ', '
        $insertion = "  tabs: [ $tabItems ],`n"
        # Insert after the `id:` line (before subsequent fields).
        $newEntry = [regex]::Replace($newEntry,
            "(\bid:\s*$idPattern\s*,\s*\r?\n)",
            "`$1$insertion", 1)
        $mutated = $true
    }
}

# 2. chapters — replace titles in-place with em-dash + tail.
if ($null -ne $Patch -and $null -ne $Patch.chapters -and $Patch.chapters.Count -gt 0) {
    foreach ($chap in $Patch.chapters) {
        if ([string]::IsNullOrWhiteSpace($chap.title)) { continue }
        if ([string]::IsNullOrWhiteSpace($chap.tail)) { continue }
        # Skip if title already has an em-dash tail.
        $titleEsc = [regex]::Escape($chap.title)
        $alreadyHasTail = $newEntry -match "title:\s*['""`]$titleEsc\s+—"
        if ($alreadyHasTail) { continue }
        $replacement = "title: '" + (Js-Escape $chap.full) + "'"
        $pattern = "title:\s*['""`]$titleEsc['""`]"
        if ($newEntry -match $pattern) {
            $newEntry = [regex]::Replace($newEntry, $pattern, $replacement, 1)
            $mutated = $true
        }
    }

    # If entry has no chapters block at all and patch supplied chapters,
    # insert a fresh chapters: array.
    if ($newEntry -notmatch '(?ms)\bchapters\s*:') {
        $chapItems = New-Object System.Collections.Generic.List[string]
        foreach ($chap in $Patch.chapters) {
            if ([string]::IsNullOrWhiteSpace($chap.full)) { continue }
            $titleStr = "'" + (Js-Escape $chap.full) + "'"
            $hrefStr = if ($chap.href) { "'" + (Js-Escape $chap.href) + "'" } else { "''" }
            [void]$chapItems.Add("    { title: $titleStr, href: $hrefStr }")
        }
        if ($chapItems.Count -gt 0) {
            $block = "  chapters: [`n" + ($chapItems -join ",`n") + "`n  ],`n"
            $newEntry = [regex]::Replace($newEntry,
                '(\}\s*)$', "$block`$1", 1)
            $mutated = $true
        }
    }
}

# 3. resources
if ($null -ne $Patch -and $null -ne $Patch.resources -and $Patch.resources.Count -gt 0) {
    if ($newEntry -notmatch '(?ms)\bresources\s*:') {
        $resItems = New-Object System.Collections.Generic.List[string]
        foreach ($r in $Patch.resources) {
            if ([string]::IsNullOrWhiteSpace($r.label)) { continue }
            $labelStr = "'" + (Js-Escape $r.label) + "'"
            $hrefStr = if ($r.href) { "'" + (Js-Escape $r.href) + "'" } else { "''" }
            [void]$resItems.Add("    { label: $labelStr, href: $hrefStr }")
        }
        if ($resItems.Count -gt 0) {
            $block = "  resources: [`n" + ($resItems -join ",`n") + "`n  ],`n"
            $newEntry = [regex]::Replace($newEntry,
                '(\}\s*)$', "$block`$1", 1)
            $mutated = $true
        }
    }
}

if (-not $mutated) {
    Write-Host "Patch-Jsx: no-op for id=$EntryId (nothing to add or change)."
    return
}

# --- Splice mutated entry back into the file -------------------------------
$newContent = $content.Substring(0, $entryStart) + $newEntry + $content.Substring($entryEnd + 1)

# --- Integrity check --------------------------------------------------------
$afterCount = ([regex]::Matches($newContent, $idRegex)).Count
if ($afterCount -ne $beforeCount) {
    throw "integrity check failed for id=$EntryId — id count changed $beforeCount -> $afterCount; refusing to write."
}

Set-Content -Path $JsxFile -Value $newContent -Encoding UTF8 -NoNewline
Write-Host "Patch-Jsx: wrote enrichment for id=$EntryId."

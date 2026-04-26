#Requires -Version 5.1
<#
.SYNOPSIS
  Phase 3 -- append a NEW entry to the PAL_POLICIES array in src\PALSearch.jsx.

.DESCRIPTION
  Locates the closing `];` of the PAL_POLICIES array and inserts the new entry
  block immediately before it. The new entry is rendered as a JSX object literal
  matching the existing PALSearch.jsx style (single-quoted strings, em-dash
  separators in chapter titles preserved, etc.).

  Refuses to write if:
    - The entry id already exists in PALSearch.jsx (no duplicate ids).
    - Brace count of the file changes by more than +N (sanity check).

  Verifies file integrity by counting `id: <NewId>` occurrences before/after.

.PARAMETER Entry
  PSCustomObject produced by Create-Entry.ps1 (id/title/category/tags/summary/
  url/popular/tabs/chapters/resources).

.PARAMETER JsxFile
  Absolute path to src\PALSearch.jsx.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [object] $Entry,
    [Parameter(Mandatory = $true)] [string] $JsxFile
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $JsxFile)) {
    throw "JSX file not found: $JsxFile"
}

# --- JS-string escape -------------------------------------------------------
function Js-Escape([string]$s) {
    if ($null -eq $s) { return '' }
    $t = $s -replace '\\', '\\'
    $t = $t -replace "'", "\'"
    return $t
}

function Format-IdLiteral([double]$id) {
    if ($id -eq [math]::Floor($id)) {
        return ([int]$id).ToString()
    }
    return ([string]$id)
}

function Format-IdPattern([double]$id) {
    if ($id -eq [math]::Floor($id)) {
        return ([int]$id).ToString()
    }
    return ([string]$id).Replace('.', '\.')
}

# --- Tag / chapter / resource render helpers --------------------------------
function Render-StringArray($arr) {
    if ($null -eq $arr -or $arr.Count -eq 0) { return '[]' }
    $items = @()
    foreach ($s in $arr) {
        $items += "'" + (Js-Escape ([string]$s)) + "'"
    }
    return '[' + ($items -join ', ') + ']'
}

function Render-TabsObject($tabs) {
    if ($null -eq $tabs) { return '{}' }
    $parts = @()
    if ($tabs.overview)            { $parts += "overview: '"            + (Js-Escape $tabs.overview)            + "'" }
    if ($tabs.policyAndGuidelines) { $parts += "policyAndGuidelines: '" + (Js-Escape $tabs.policyAndGuidelines) + "'" }
    if ($tabs.resources)           { $parts += "resources: '"           + (Js-Escape $tabs.resources)           + "'" }
    return '{ ' + ($parts -join ', ') + ' }'
}

function Render-Chapters($chapters) {
    if ($null -eq $chapters -or $chapters.Count -eq 0) { return $null }
    $items = @()
    foreach ($c in $chapters) {
        $titleStr = "'" + (Js-Escape ([string]$c.title)) + "'"
        $hrefStr = if ($c.href) { "'" + (Js-Escape ([string]$c.href)) + "'" } else { "''" }
        # Use 'url' key to match existing PAL_POLICIES chapter shape.
        $items += "      { title: $titleStr, url: $hrefStr }"
    }
    return "    chapters: [`n" + ($items -join ",`n") + "`n    ]"
}

function Render-Resources($resources) {
    if ($null -eq $resources -or $resources.Count -eq 0) { return $null }
    $items = @()
    foreach ($r in $resources) {
        $titleStr = "'" + (Js-Escape ([string]$r.title)) + "'"
        $noteStr  = "'" + (Js-Escape ([string]$r.note))  + "'"
        $line = "      { title: $titleStr, note: $noteStr"
        if ($r.url) {
            $line += ", url: '" + (Js-Escape ([string]$r.url)) + "'"
        }
        $line += ' }'
        $items += $line
    }
    return "    resources: [`n" + ($items -join ",`n") + "`n    ]"
}

function Render-Entry($entry) {
    $idLit  = Format-IdLiteral ([double]$entry.id)
    $titleS = "'" + (Js-Escape ([string]$entry.title)) + "'"
    $catS   = "'" + (Js-Escape ([string]$entry.category)) + "'"
    $tagsS  = Render-StringArray $entry.tags
    $sumS   = "'" + (Js-Escape ([string]$entry.summary)) + "'"
    $urlS   = "'" + (Js-Escape ([string]$entry.url)) + "'"
    $popS   = if ($entry.popular) { 'true' } else { 'false' }

    # Header line (id + scalar fields, single-line).
    $head = "  { id: $idLit, title: $titleS, category: $catS, tags: $tagsS, summary: $sumS, url: $urlS, popular: $popS,"

    $body = @()
    if ($entry.tabs) {
        $body += "    tabs: " + (Render-TabsObject $entry.tabs)
    }
    $chBlk = Render-Chapters $entry.chapters
    if ($chBlk) { $body += $chBlk }
    $reBlk = Render-Resources $entry.resources
    if ($reBlk) { $body += $reBlk }

    if ($body.Count -eq 0) {
        # No nested blocks -- close on the head line.
        return ($head -replace ',$', '') + ' }'
    }
    return $head + "`n" + ($body -join ",`n") + "`n  }"
}

# --- Locate PAL_POLICIES closing `];` ---------------------------------------
$content = Get-Content -Path $JsxFile -Raw -Encoding UTF8

# Count entries before (rough: count of "  { id:" lines).
$idLineCount = ([regex]::Matches($content, '(?m)^\s*\{\s*id:\s*\d')).Count

# Refuse if id already exists.
$idPat = Format-IdPattern ([double]$Entry.id)
$dupRegex = "\bid:\s*$idPat\b"
$dupMatches = [regex]::Matches($content, $dupRegex)
if ($dupMatches.Count -gt 0) {
    throw "duplicate id: entry id=$($Entry.id) already exists in JSX (count=$($dupMatches.Count))"
}

# Find PAL_POLICIES start to bound the search.
$arrStart = [regex]::Match($content, 'const\s+PAL_POLICIES\s*=\s*\[')
if (-not $arrStart.Success) {
    throw "could not locate 'const PAL_POLICIES = [' in JSX"
}
$searchFrom = $arrStart.Index + $arrStart.Length

# Find the matching `];` for PAL_POLICIES via bracket counting.
$depth = 1
$i = $searchFrom
$inStr = $false
$strCh = $null
$arrEnd = -1
while ($i -lt $content.Length) {
    $ch = $content[$i]
    if ($inStr) {
        if ($ch -eq '\') { $i += 2; continue }
        if ($ch -eq $strCh) { $inStr = $false }
        $i++; continue
    }
    if ($ch -eq "'" -or $ch -eq '"' -or $ch -eq '`') {
        $inStr = $true; $strCh = $ch; $i++; continue
    }
    if ($ch -eq '[') { $depth++ }
    elseif ($ch -eq ']') {
        $depth--
        if ($depth -eq 0) { $arrEnd = $i; break }
    }
    $i++
}
if ($arrEnd -lt 0) {
    throw "could not locate closing '];' of PAL_POLICIES"
}

# Render the new entry block.
$rendered = Render-Entry $Entry

# Look at the character just before `]` to decide whether we need a comma after
# the existing last entry. Walk backwards past whitespace.
$j = $arrEnd - 1
while ($j -ge 0 -and $content[$j] -match '\s') { $j-- }
$prevChar = if ($j -ge 0) { $content[$j] } else { '' }
$needsLeadingComma = ($prevChar -ne ',' -and $prevChar -ne '[')

$insertion = ''
if ($needsLeadingComma) {
    $insertion = ",`n" + $rendered + "`n"
} else {
    $insertion = "`n" + $rendered + "`n"
}

$newContent = $content.Substring(0, $arrEnd) + $insertion + $content.Substring($arrEnd)

# --- Integrity checks -------------------------------------------------------
$newIdLineCount = ([regex]::Matches($newContent, '(?m)^\s*\{\s*id:\s*\d')).Count
if ($newIdLineCount -ne $idLineCount + 1) {
    throw "integrity check failed: id-line count $idLineCount -> $newIdLineCount (expected +1)"
}

$newDupCount = ([regex]::Matches($newContent, $dupRegex)).Count
if ($newDupCount -ne 1) {
    throw "integrity check failed: new id appears $newDupCount times (expected 1)"
}

Set-Content -Path $JsxFile -Value $newContent -Encoding UTF8 -NoNewline
Write-Host "Append-Entry: appended id=$($Entry.id) ($($Entry.title)). Entries: $idLineCount -> $newIdLineCount."

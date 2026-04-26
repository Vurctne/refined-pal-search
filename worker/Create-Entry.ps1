#Requires -Version 5.1
<#
.SYNOPSIS
  Phase 3 -- build a NEW PAL_POLICIES entry from a PAL page URL.

.DESCRIPTION
  Mirrors Fetch-Policy.ps1 (Phase 2) but instead of patching an existing entry,
  produces a complete entry object suitable for APPENDING to PAL_POLICIES.

  Returned shape:
    {
      id        : <NewId>
      title     : 'Page <h1>'
      category  : '<DbCategory>'             (passed in from queue)
      tags      : @('keyword1', 'keyword2', ...) 5-12 lower-case tokens
      summary   : '1-2 sentences from intro paragraph'
      url       : '<canonical content URL>'
      popular   : $false
      tabs      : @{ overview = '...'; policyAndGuidelines = '...'; resources = '...' }
      chapters  : @( @{ title = 'Bare title'; href = 'url' }, ... )    (no tails -- Phase 3.B fills them)
      resources : @( @{ title = '...'; note = ''; url = '...' }, ... )
    }

  Snippet save still happens for chapters (Phase 3.B reads them to synthesise tails).

.PARAMETER PalUrl
  The bare PAL slug URL (e.g. https://www2.education.vic.gov.au/pal/digital-learning).

.PARAMETER NewId
  Numeric id for the new entry (e.g. 102.1).

.PARAMETER DbCategory
  One of the 14 valid PAL_POLICIES categories (e.g. 'HR - Pay', 'Curriculum').

.PARAMETER PalTitle
  Optional pre-known title from the diff (used as fallback if <h1> parse fails).
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [string] $PalUrl,
    [Parameter(Mandatory = $true)] [double] $NewId,
    [Parameter(Mandatory = $true)] [string] $DbCategory,
    [Parameter(Mandatory = $false)] [string] $PalTitle = ''
)

$ErrorActionPreference = 'Stop'

$UserAgent = 'Mozilla/5.0 (PAL Quick Search worker)'
$MaxFetches = 25
$BetweenFetchesMs = 250
$RateLimitBackoffSec  = @(30, 90, 180)
$ServerErrorBackoffSec = @(5, 15)
$NetworkBackoffSec     = @(5, 15)

$script:fetchCount = 0
$script:scriptStartTime = Get-Date
$TotalTimeoutSec = 150

# ----- Fetch helpers --------------------------------------------------------
function Test-TotalTimeout {
    if (((Get-Date) - $script:scriptStartTime).TotalSeconds -gt $TotalTimeoutSec) {
        throw "fetch_failed total_timeout (>${TotalTimeoutSec}s)"
    }
}

function Invoke-Fetch([string]$u, [bool]$AllowFail = $false) {
    if ($script:fetchCount -ge $MaxFetches) {
        throw "fetch_cap_exceeded ($script:fetchCount)"
    }
    $script:fetchCount++

    $attempt = 0
    while ($true) {
        Test-TotalTimeout
        try {
            $resp = Invoke-WebRequest -Uri $u -UserAgent $UserAgent -UseBasicParsing -TimeoutSec 30
            return $resp
        } catch {
            $code = $null
            if ($_.Exception.Response) {
                try { $code = [int]$_.Exception.Response.StatusCode } catch {}
            }
            if ($AllowFail -and $null -ne $code -and $code -ge 400 -and $code -lt 500) {
                throw "fetch_failed url=$u code=$code"
            }
            if ($null -ne $code -and $code -ge 400 -and $code -lt 500 -and $code -ne 429) {
                throw "fetch_failed url=$u code=$code msg=$($_.Exception.Message)"
            }
            if ($code -eq 429) {
                if ($attempt -ge $RateLimitBackoffSec.Count) { throw "fetch_failed url=$u code=429 retries exhausted" }
                Start-Sleep -Seconds $RateLimitBackoffSec[$attempt]; $attempt++; continue
            }
            if ($null -ne $code -and $code -ge 500) {
                if ($attempt -ge $ServerErrorBackoffSec.Count) { throw "fetch_failed url=$u code=$code 5xx persistent" }
                Start-Sleep -Seconds $ServerErrorBackoffSec[$attempt]; $attempt++; continue
            }
            if ($null -eq $code) {
                if ($attempt -ge $NetworkBackoffSec.Count) { throw "fetch_failed url=$u network_error" }
                Start-Sleep -Seconds $NetworkBackoffSec[$attempt]; $attempt++; continue
            }
            throw "fetch_failed url=$u code=$code"
        }
    }
}

try { Add-Type -AssemblyName System.Web -ErrorAction SilentlyContinue } catch {}

function Strip-Html([string]$s) {
    if ($null -eq $s) { return '' }
    $t = [regex]::Replace($s, '<[^>]+>', ' ')
    $t = [System.Web.HttpUtility]::HtmlDecode($t)
    $t = [regex]::Replace($t, '\s+', ' ')
    return $t.Trim()
}

function Make-Absolute([string]$href, [string]$base) {
    if ([string]::IsNullOrWhiteSpace($href)) { return $null }
    if ($href -match '^https?://') { return $href }
    try { return ([Uri]::new([Uri]$base, $href)).AbsoluteUri } catch { return $href }
}

function Get-PolicyBaseUrl([string]$u) {
    if ($u -match '^(https?://[^/]+/pal/[^/]+)') { return $Matches[1] }
    return ($u -replace '/[^/]+$', '')
}

# ----- Snippet directory ----------------------------------------------------
$script:SnippetDir = $null
try {
    $projRoot = Split-Path -Parent $PSScriptRoot
    if ($projRoot) {
        $script:SnippetDir = Join-Path $projRoot '.work-queue\chapter-snippets'
        if (-not (Test-Path $script:SnippetDir)) {
            New-Item -ItemType Directory -Path $script:SnippetDir -Force | Out-Null
        }
    }
} catch { $script:SnippetDir = $null }

function Save-ChapterSnippet {
    param(
        [Nullable[double]]$entryId,
        [int]$chapterIdx,
        [string]$chapterTitle,
        [string]$chapterUrl,
        [string]$snippetText
    )
    if ($null -eq $entryId) { return }
    if ([string]::IsNullOrWhiteSpace($script:SnippetDir)) { return }
    if ([string]::IsNullOrWhiteSpace($snippetText)) { return }

    $idForName = if ($entryId -eq [math]::Floor([double]$entryId)) {
        ([int][double]$entryId).ToString()
    } else {
        ([string][double]$entryId)
    }
    $fileName = "$idForName-$chapterIdx.json"
    $filePath = Join-Path $script:SnippetDir $fileName
    if (Test-Path $filePath) { return }

    $obj = [pscustomobject]@{
        entry_id      = [double]$entryId
        chapter_idx   = $chapterIdx
        chapter_title = $chapterTitle
        chapter_url   = $chapterUrl
        snippet       = $snippetText
        fetched_at    = (Get-Date).ToString('o')
    }
    try {
        $json = $obj | ConvertTo-Json -Depth 4
        Set-Content -Path $filePath -Value $json -Encoding UTF8
    } catch {}
}

# ----- Garbage filters -------------------------------------------------------
$script:GarbageLabelPatterns = @(
    'skip to', 'main content', 'menu', 'navigation', 'navigate',
    'search', 'footer', 'header', 'breadcrumb', 'return to top',
    'previous chapter', 'next chapter', 'jump to', 'in this section',
    'related content', 'related policies', 'on this page'
)

function Test-GarbageLabel([string]$label) {
    if ([string]::IsNullOrWhiteSpace($label)) { return $true }
    if ($label.Trim().Length -lt 4) { return $true }
    $lower = $label.ToLower()
    foreach ($p in $script:GarbageLabelPatterns) { if ($lower.Contains($p)) { return $true } }
    return $false
}

function Test-GarbageHref([string]$href, [string]$base) {
    if ([string]::IsNullOrWhiteSpace($href)) { return $true }
    if ($href -match '#') { return $true }
    if ($href -notmatch [regex]::Escape("$base/")) { return $true }
    if ($href -match "$([regex]::Escape($base))/(policy|guidance|resources|overview|policy-and-guidelines|templates)/?$") { return $true }
    return $false
}

# ----- Chapter parsing (mirrors Fetch-Policy) -------------------------------
function Parse-ChaptersFromMenu([string]$html, [string]$pageUrl, [string]$base) {
    $chapters = New-Object System.Collections.Generic.List[object]
    $seenHrefs = @{}
    $ulPattern = '(?is)<ul\b[^>]*\bdata-depth="1"[^>]*\bclass="[^"]*det-publication-menu__child[^"]*"[^>]*>(.*?)</ul>'
    $ulMatches = [regex]::Matches($html, $ulPattern)
    if ($ulMatches.Count -eq 0) {
        $ulPattern2 = '(?is)<ul\b[^>]*\bclass="[^"]*det-publication-menu__child[^"]*"[^>]*\bdata-depth="1"[^>]*>(.*?)</ul>'
        $ulMatches = [regex]::Matches($html, $ulPattern2)
    }
    foreach ($ul in $ulMatches) {
        $block = $ul.Groups[1].Value
        $linkPattern = '(?is)<a\b[^>]*\bhref="([^"]+)"[^>]*\bclass="[^"]*det-publication-menu__item-link[^"]*"[^>]*>(.*?)</a>'
        $linkMatches = [regex]::Matches($block, $linkPattern)
        if ($linkMatches.Count -eq 0) {
            $linkPattern2 = '(?is)<a\b[^>]*\bclass="[^"]*det-publication-menu__item-link[^"]*"[^>]*\bhref="([^"]+)"[^>]*>(.*?)</a>'
            $linkMatches = [regex]::Matches($block, $linkPattern2)
        }
        foreach ($m in $linkMatches) {
            $href = $m.Groups[1].Value
            $label = (Strip-Html $m.Groups[2].Value)
            if (Test-GarbageLabel $label) { continue }
            $abs = Make-Absolute $href $pageUrl
            if (-not $abs) { continue }
            if (Test-GarbageHref $abs $base) { continue }
            if ($seenHrefs.ContainsKey($abs)) { continue }
            $seenHrefs[$abs] = $true
            [void]$chapters.Add([pscustomobject]@{ title = $label; href = $abs })
        }
    }
    if ($chapters.Count -eq 0) { return $null }
    return ,$chapters.ToArray()
}

function Parse-ChaptersFromHeadings([string]$html, [string]$pageUrl) {
    $chapters = New-Object System.Collections.Generic.List[object]
    $innerMatch = [regex]::Match($html, '(?is)<div\b[^>]*\bclass="[^"]*rpl-markup__inner[^"]*"[^>]*>(.*)$')
    if (-not $innerMatch.Success) { return $null }
    $section = $innerMatch.Groups[1].Value
    $endIdx = $section.IndexOf('</div></div>')
    if ($endIdx -gt 0) { $section = $section.Substring(0, $endIdx) }
    $headingPattern = '(?is)<h([23])\b[^>]*\bid="([^"]+)"[^>]*>(.*?)</h\1>'
    $hMatches = [regex]::Matches($section, $headingPattern)
    $skipFirstH2 = $true
    foreach ($m in $hMatches) {
        $level = $m.Groups[1].Value
        $label = (Strip-Html $m.Groups[3].Value)
        if ($level -eq '2' -and $skipFirstH2) { $skipFirstH2 = $false; continue }
        if (Test-GarbageLabel $label) { continue }
        [void]$chapters.Add([pscustomobject]@{ title = $label; href = $pageUrl })
    }
    if ($chapters.Count -eq 0) { return $null }
    return ,$chapters.ToArray()
}

function Parse-Chapters([string]$html, [string]$pageUrl) {
    $base = Get-PolicyBaseUrl $pageUrl
    $a = Parse-ChaptersFromMenu $html $pageUrl $base
    if ($null -ne $a -and $a.Count -gt 0) { return ,$a }
    $b = Parse-ChaptersFromHeadings $html $pageUrl
    if ($null -ne $b -and $b.Count -gt 0) { return ,$b }
    return ,@()
}

# ----- Snippet helpers ------------------------------------------------------
function Get-FirstParagraphsSnippet([string]$html, [int]$maxParas = 5) {
    $innerM = [regex]::Match($html, '(?is)<div\b[^>]*\bclass="[^"]*rpl-markup__inner[^"]*"[^>]*>(.*?)$')
    $section = if ($innerM.Success) { $innerM.Groups[1].Value } else { $html }
    $pPat = [regex]'(?is)<p[^>]*>(.*?)</p>'
    $texts = New-Object System.Collections.Generic.List[string]
    foreach ($pm in $pPat.Matches($section)) {
        $t = Strip-Html $pm.Groups[1].Value
        if ($t.Length -gt 20) {
            [void]$texts.Add($t)
            if ($texts.Count -ge $maxParas) { break }
        }
    }
    return ($texts -join ' ')
}

function Get-HeadingSectionHtml([string]$html, [string]$headingTitle) {
    $innerM = [regex]::Match($html, '(?is)<div\b[^>]*\bclass="[^"]*rpl-markup__inner[^"]*"[^>]*>(.*?)$')
    $section = if ($innerM.Success) { $innerM.Groups[1].Value } else { $html }
    $hPat = [regex]'(?is)<h([23])\b[^>]*\bid="([^"]+)"[^>]*>(.*?)</h\1>'
    $targetEnd = -1
    foreach ($hm in $hPat.Matches($section)) {
        $label = Strip-Html $hm.Groups[3].Value
        if ($label.Trim() -eq $headingTitle.Trim()) {
            $targetEnd = $hm.Index + $hm.Length; break
        }
    }
    if ($targetEnd -lt 0) { return '' }
    $remainder = $section.Substring($targetEnd)
    $nextHx = [regex]::Match($remainder, '(?is)<h[23]\b')
    $segment = if ($nextHx.Success) { $remainder.Substring(0, $nextHx.Index) } else { $remainder.Substring(0, [Math]::Min($remainder.Length, 6000)) }
    return $segment
}

$script:FetchCache = @{}
function Get-ChapterSnippetFromUrl([string]$chapterUrl) {
    try {
        if (-not $script:FetchCache.ContainsKey($chapterUrl)) {
            $resp = Invoke-Fetch $chapterUrl
            Start-Sleep -Milliseconds $BetweenFetchesMs
            $script:FetchCache[$chapterUrl] = $resp.Content
        }
        return (Get-FirstParagraphsSnippet $script:FetchCache[$chapterUrl] 5)
    } catch { return '' }
}

function Get-ChapterSnippetFromHtml([string]$html, [string]$headingTitle) {
    $segment = Get-HeadingSectionHtml $html $headingTitle
    if ([string]::IsNullOrWhiteSpace($segment)) { return '' }
    $shell = '<div class="rpl-markup__inner">' + $segment + '</div>'
    return (Get-FirstParagraphsSnippet $shell 5)
}

# ----- Resources parsing ----------------------------------------------------
function Parse-Resources([string]$pageUrl) {
    $base = Get-PolicyBaseUrl $pageUrl
    $resourcesUrl = "$base/resources"
    try {
        $resp = Invoke-Fetch $resourcesUrl
        Start-Sleep -Milliseconds $BetweenFetchesMs
    } catch { return $null }
    $html = $resp.Content
    $resources = New-Object System.Collections.Generic.List[object]
    $seen = @{}
    $linkPattern = '<a[^>]+href="([^"]+)"[^>]*>\s*([^<]{3,200})\s*</a>'
    foreach ($m in [regex]::Matches($html, $linkPattern)) {
        $href = $m.Groups[1].Value
        $label = (Strip-Html $m.Groups[2].Value)
        if ([string]::IsNullOrWhiteSpace($label)) { continue }
        if (Test-GarbageLabel $label) { continue }
        $abs = Make-Absolute $href $pageUrl
        if (-not $abs) { continue }
        $isDoc = $abs -match '\.(pdf|docx?|xlsx?|pptx?)(\?.*)?$'
        $isExternal = ($abs -notmatch [regex]::Escape('education.vic.gov.au'))
        $isPalSibling = $abs -match [regex]::Escape("$base/")
        if (-not ($isDoc -or $isExternal -or $isPalSibling)) { continue }
        if ($seen.ContainsKey($abs)) { continue }
        $seen[$abs] = $true
        # Try to split title vs note: "Foo (Word)" vs "Foo (Word) -- last updated 1 Jan 2024"
        $title = $label
        $note = ''
        $emDash = [char]0x2014
        if ($label -match "^(.+?)\s*[$emDash\-]+\s*(.+)$") {
            $title = $Matches[1].Trim()
            $note = $Matches[2].Trim()
        }
        [void]$resources.Add([pscustomobject]@{ title = $title; note = $note; url = $abs })
    }
    if ($resources.Count -eq 0) { return $null }
    return ,$resources.ToArray()
}

# ----- Title / summary / tags extraction ------------------------------------
function Get-PageTitle([string]$html, [string]$fallback) {
    # Prefer <h1> inside main content; fall back to <title>.
    $h1 = [regex]::Match($html, '(?is)<h1\b[^>]*>(.*?)</h1>')
    if ($h1.Success) {
        $t = Strip-Html $h1.Groups[1].Value
        if ($t.Length -gt 2 -and $t.Length -lt 200) { return $t }
    }
    $titleMatch = [regex]::Match($html, '(?is)<title>(.*?)</title>')
    if ($titleMatch.Success) {
        $t = Strip-Html $titleMatch.Groups[1].Value
        # Strip site suffix like " | PAL" or " - Department of ..."
        $t = $t -replace '\s*\|.*$', ''
        $t = $t -replace '\s*-\s*Department.*$', ''
        if ($t.Length -gt 2) { return $t.Trim() }
    }
    return $fallback
}

function Get-PageSummary([string]$html) {
    $snippet = Get-FirstParagraphsSnippet $html 2
    if ([string]::IsNullOrWhiteSpace($snippet)) { return '' }
    # Truncate to ~2 sentences (split on '. ').
    $parts = $snippet -split '(?<=[.!?])\s+'
    if ($parts.Count -ge 2) {
        return ($parts[0..1] -join ' ').Trim()
    }
    $s = $snippet
    if ($s.Length -gt 240) { $s = $s.Substring(0, 240) + '...' }
    return $s
}

$script:StopWords = @{
    'the'=1;'a'=1;'an'=1;'of'=1;'in'=1;'for'=1;'and'=1;'or'=1;'to'=1;'is'=1;
    'are'=1;'with'=1;'on'=1;'at'=1;'by'=1;'from'=1;'that'=1;'this'=1;'these'=1;
    'those'=1;'be'=1;'been'=1;'being'=1;'has'=1;'have'=1;'had'=1;'will'=1;
    'would'=1;'may'=1;'can'=1;'does'=1;'do'=1;'not'=1;'but'=1;'as'=1;'it'=1;
    'its'=1;'they'=1;'their'=1;'you'=1;'your'=1;'we'=1;'our'=1;'i'=1;'all'=1;
    'any'=1;'some'=1;'each'=1;'who'=1;'which'=1;'what'=1;'when'=1;'where'=1;
    'why'=1;'how'=1;'than'=1;'then'=1;'so'=1;'such'=1;'also'=1;'more'=1;
    'most'=1;'other'=1;'into'=1;'about'=1;'over'=1;'under'=1;'between'=1;
    'must'=1;'should'=1;'shall'=1;'use'=1;'used'=1;'using'=1;'including'=1;
    'page'=1;'pal'=1;'department'=1;'education'=1;'training'=1
}

function Get-PageTags([string]$title, [string]$summary) {
    $combined = ($title + ' ' + $summary).ToLower()
    # Tokenise on non-letter chars (keep hyphens within words).
    $tokens = [regex]::Split($combined, '[^a-z0-9\-]+') | Where-Object { $_ -and $_.Length -ge 4 -and -not $script:StopWords.ContainsKey($_) }
    $freq = @{}
    foreach ($t in $tokens) { $freq[$t] = ($freq[$t] + 1) }
    # Title words always included (higher weight).
    $titleTokens = [regex]::Split($title.ToLower(), '[^a-z0-9\-]+') | Where-Object { $_ -and $_.Length -ge 4 -and -not $script:StopWords.ContainsKey($_) }
    $tags = New-Object System.Collections.Generic.List[string]
    $seen = @{}
    foreach ($t in $titleTokens) {
        if (-not $seen.ContainsKey($t)) { [void]$tags.Add($t); $seen[$t] = 1 }
    }
    # Add summary tokens by frequency until we have ~10.
    $sortedFreq = $freq.GetEnumerator() | Sort-Object -Property Value -Descending
    foreach ($e in $sortedFreq) {
        if ($tags.Count -ge 10) { break }
        if (-not $seen.ContainsKey($e.Key)) { [void]$tags.Add($e.Key); $seen[$e.Key] = 1 }
    }
    if ($tags.Count -gt 12) { $tags = $tags.GetRange(0, 12) }
    if ($tags.Count -lt 3) {
        # Always have at least a couple of tokens even on a thin page.
        if ($tags.Count -eq 0) { [void]$tags.Add('policy') }
    }
    return ,$tags.ToArray()
}

# ----- Canonical URL probe --------------------------------------------------
function Resolve-CanonicalUrl([string]$bareUrl) {
    # PAL pages live at one of: /policy-and-guidelines, /policy, /guidance, or
    # the bare slug (which usually shows /overview). Probe in priority order.
    $base = Get-PolicyBaseUrl $bareUrl
    $candidates = @(
        "$base/policy-and-guidelines",
        "$base/policy",
        "$base/guidance"
    )
    foreach ($c in $candidates) {
        try {
            $resp = Invoke-WebRequest -Uri $c -UserAgent $UserAgent -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
            $script:fetchCount++
            Start-Sleep -Milliseconds $BetweenFetchesMs
            if ($resp.StatusCode -eq 200) { return $c }
        } catch {
            # 404 is expected for missing tabs; just try the next one.
        }
    }
    return $bareUrl
}

# ----- Main -----------------------------------------------------------------
$base = Get-PolicyBaseUrl $PalUrl
$canonicalUrl = Resolve-CanonicalUrl $PalUrl

$resp = Invoke-Fetch $canonicalUrl
Start-Sleep -Milliseconds $BetweenFetchesMs
$html = $resp.Content
$script:FetchCache[$canonicalUrl] = $html

$title = Get-PageTitle $html $PalTitle
$summary = Get-PageSummary $html
$tags = Get-PageTags $title $summary

# Tabs object: always emit overview/policyAndGuidelines/resources triple.
$policyTabUrl = $canonicalUrl
if ($canonicalUrl -notmatch '/(policy|policy-and-guidelines|guidance)$') {
    $policyTabUrl = "$base/policy-and-guidelines"
}
$tabsObj = [pscustomobject]@{
    overview            = "$base/overview"
    policyAndGuidelines = $policyTabUrl
    resources           = "$base/resources"
}

# Chapters
$chapters = Parse-Chapters $html $canonicalUrl
if ($null -eq $chapters) { $chapters = @() }
$chapterList = New-Object System.Collections.Generic.List[object]
$idx = 0
foreach ($c in $chapters) {
    $idx++
    $bareTitle = $c.title
    # Snippet save -- best-effort.
    $snippetText = ''
    if ($c.href -ne $canonicalUrl) {
        $snippetText = Get-ChapterSnippetFromUrl $c.href
    } else {
        $snippetText = Get-ChapterSnippetFromHtml $html $c.title
    }
    if (-not [string]::IsNullOrWhiteSpace($snippetText)) {
        Save-ChapterSnippet -entryId $NewId -chapterIdx $idx -chapterTitle $bareTitle -chapterUrl $c.href -snippetText $snippetText
    }
    [void]$chapterList.Add([pscustomobject]@{ title = $bareTitle; href = $c.href })
}

# Resources
$resources = Parse-Resources $canonicalUrl
if ($null -eq $resources) { $resources = @() }

# Build entry object
$entry = [pscustomobject]@{
    id        = $NewId
    title     = $title
    category  = $DbCategory
    tags      = $tags
    summary   = $summary
    url       = $canonicalUrl
    popular   = $false
    tabs      = $tabsObj
    chapters  = $chapterList.ToArray()
    resources = $resources
}

return $entry

#Requires -Version 5.1
<#
.SYNOPSIS
  Fetch a PAL policy URL and parse it into a patch object.

.DESCRIPTION
  Given a PAL policy page URL and a list of actions_needed (any of
  needs_chapter_tails, needs_full_chapters, needs_resources, needs_tabs),
  fetches the policy page (and its sub-pages where required) and returns a
  PSCustomObject describing the patch to apply via Patch-Jsx.ps1.

  Returned shape:
    {
      tabs       : @('Policy', 'Guidance', 'Resources', ...) | $null
      chapters   : @(
          @{ title = 'Original chapter title'; tail = 'kw1, kw2, kw3'; full = 'Original — kw1, kw2, kw3' },
          ...
      ) | $null
      resources  : @(
          @{ label = 'Resource name'; href = 'https://...' },
          ...
      ) | $null
    }

.PARAMETER Url
  The policy page URL (e.g. https://www2.education.vic.gov.au/pal/.../policy).

.PARAMETER Actions
  Array of action codes telling which fields to populate.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [string]   $Url,
    [Parameter(Mandatory = $true)] [string[]] $Actions
)

$ErrorActionPreference = 'Stop'

$UserAgent = 'Mozilla/5.0 (PAL Quick Search worker)'
$MaxFetches = 20
$BetweenFetchesMs = 250
$RetryDelaysSec = @(30, 90, 180)

$script:fetchCount = 0

# ----- Helpers ---------------------------------------------------------------
function Invoke-Fetch([string]$u) {
    if ($script:fetchCount -ge $MaxFetches) {
        throw "fetch_cap_exceeded ($script:fetchCount)"
    }
    $script:fetchCount++

    $attempt = 0
    while ($true) {
        try {
            $resp = Invoke-WebRequest -Uri $u -UserAgent $UserAgent `
                -UseBasicParsing -TimeoutSec 30
            return $resp
        } catch {
            $code = $null
            if ($_.Exception.Response) {
                try { $code = [int]$_.Exception.Response.StatusCode } catch {}
            }
            $isRetryable = ($code -eq 429) -or ($code -ge 500 -and $code -lt 600) -or `
                           ($null -eq $code)
            if (-not $isRetryable -or $attempt -ge $RetryDelaysSec.Count) {
                throw "fetch_failed url=$u code=$code msg=$($_.Exception.Message)"
            }
            Start-Sleep -Seconds $RetryDelaysSec[$attempt]
            $attempt++
        }
    }
}

function Strip-Html([string]$s) {
    if ($null -eq $s) { return '' }
    $t = [regex]::Replace($s, '<[^>]+>', ' ')
    $t = [System.Web.HttpUtility]::HtmlDecode($t)
    $t = [regex]::Replace($t, '\s+', ' ')
    return $t.Trim()
}

# Load System.Web for HtmlDecode (works on PS 5.1 and 7+).
try { Add-Type -AssemblyName System.Web -ErrorAction SilentlyContinue } catch {}

$script:StopWords = @{}
foreach ($w in @('the','and','a','an','of','to','in','for','on','at','by','with',
                 'is','are','was','were','be','been','this','that','these','those',
                 'it','its','as','or','if','from','will','can','must','should',
                 'may','any','all','also','their','they','our','your','you','we',
                 'has','have','had','not','no','do','does','where','when','which',
                 'who','what','how','why','than','then','so','such','about','into',
                 'over','under','before','after','during','via','per','using',
                 'used','use','new','more','most','some','each','only','other',
                 'between','within','through','without','because','while','here',
                 'there','further','information','policy','guidance','overview',
                 'page','section','part','chapter')) {
    $script:StopWords[$w] = $true
}

function Get-Keywords([string]$text, [int]$count = 5) {
    if ([string]::IsNullOrWhiteSpace($text)) { return @() }
    $words = [regex]::Matches($text.ToLower(), '[a-z][a-z\-]{2,}') | ForEach-Object { $_.Value }
    $kept = New-Object System.Collections.Generic.List[string]
    $seen = @{}
    foreach ($w in $words) {
        if ($script:StopWords.ContainsKey($w)) { continue }
        if ($w.Length -lt 4) { continue }
        if ($seen.ContainsKey($w)) { continue }
        $seen[$w] = $true
        [void]$kept.Add($w)
        if ($kept.Count -ge $count) { break }
    }
    return ,$kept.ToArray()
}

function Make-Absolute([string]$href, [string]$base) {
    if ([string]::IsNullOrWhiteSpace($href)) { return $null }
    if ($href -match '^https?://') { return $href }
    try {
        $baseUri = [Uri]$base
        $abs = [Uri]::new($baseUri, $href)
        return $abs.AbsoluteUri
    } catch {
        return $href
    }
}

function Get-PolicyBaseUrl([string]$u) {
    # Strip the trailing path segment (policy / guidance / resources / overview / etc).
    if ($u -match '^(https?://[^/]+/pal/[^/]+)/') {
        return $Matches[1]
    }
    return ($u -replace '/[^/]+$', '')
}

# ----- Tab detection ---------------------------------------------------------
function Parse-Tabs([string]$html, [string]$pageUrl) {
    $tabs = New-Object System.Collections.Generic.List[string]
    # PAL pages typically render tabs as anchors inside a tab navigation block.
    # Look for nav links pointing at /pal/<slug>/{policy|guidance|resources|overview|...}
    $tabPattern = '<a[^>]+href="([^"]+)"[^>]*>\s*([^<]{2,40})\s*</a>'
    $tabSegments = @('policy','guidance','resources','overview','policy-and-guidelines','templates')
    $base = Get-PolicyBaseUrl $pageUrl
    foreach ($m in [regex]::Matches($html, $tabPattern)) {
        $href = $m.Groups[1].Value
        $label = (Strip-Html $m.Groups[2].Value)
        $abs = Make-Absolute $href $pageUrl
        if (-not $abs) { continue }
        foreach ($seg in $tabSegments) {
            if ($abs -match [regex]::Escape("$base/$seg")) {
                if (-not $tabs.Contains($label) -and $label.Length -gt 1) {
                    [void]$tabs.Add($label)
                }
                break
            }
        }
    }
    if ($tabs.Count -eq 0) { return $null }
    return ,$tabs.ToArray()
}

# ----- Chapter parsing -------------------------------------------------------
function Parse-Chapters([string]$html, [string]$pageUrl) {
    # PAL chapter lists are typically rendered as <ul> with <a> links to
    # sub-pages of the current policy. Heuristic: collect anchors whose href
    # is a sub-path of the policy page and whose label looks like a chapter.
    $chapters = New-Object System.Collections.Generic.List[object]
    $seenHrefs = @{}
    $base = Get-PolicyBaseUrl $pageUrl
    $linkPattern = '<a[^>]+href="([^"]+)"[^>]*>\s*([^<]{4,200})\s*</a>'
    foreach ($m in [regex]::Matches($html, $linkPattern)) {
        $href = $m.Groups[1].Value
        $label = (Strip-Html $m.Groups[2].Value)
        if ([string]::IsNullOrWhiteSpace($label)) { continue }
        $abs = Make-Absolute $href $pageUrl
        if (-not $abs) { continue }
        # Must be a child of the policy section, not the tab itself.
        if ($abs -notmatch [regex]::Escape("$base/")) { continue }
        # Skip the four "tab" segments — those aren't chapters.
        if ($abs -match "$([regex]::Escape($base))/(policy|guidance|resources|overview|policy-and-guidelines|templates)/?$") { continue }
        if ($seenHrefs.ContainsKey($abs)) { continue }
        $seenHrefs[$abs] = $true
        [void]$chapters.Add([pscustomobject]@{ title = $label; href = $abs })
    }
    if ($chapters.Count -eq 0) { return $null }
    return ,$chapters.ToArray()
}

function Get-ChapterTail([string]$chapterUrl) {
    try {
        $resp = Invoke-Fetch $chapterUrl
        Start-Sleep -Milliseconds $BetweenFetchesMs
        $html = $resp.Content
        # First <p> inside the main content.
        $firstP = [regex]::Match($html, '(?is)<p[^>]*>(.*?)</p>')
        if (-not $firstP.Success) { return '' }
        $text = Strip-Html $firstP.Groups[1].Value
        $kw = Get-Keywords $text 5
        return ($kw -join ', ')
    } catch {
        return ''
    }
}

# ----- Resources parsing -----------------------------------------------------
function Parse-Resources([string]$pageUrl) {
    $base = Get-PolicyBaseUrl $pageUrl
    $resourcesUrl = "$base/resources"
    try {
        $resp = Invoke-Fetch $resourcesUrl
        Start-Sleep -Milliseconds $BetweenFetchesMs
    } catch {
        return $null
    }
    $html = $resp.Content
    $resources = New-Object System.Collections.Generic.List[object]
    $seen = @{}
    # Resource links typically point at .docx/.pdf/.xlsx files or external sites.
    $linkPattern = '<a[^>]+href="([^"]+)"[^>]*>\s*([^<]{3,200})\s*</a>'
    foreach ($m in [regex]::Matches($html, $linkPattern)) {
        $href = $m.Groups[1].Value
        $label = (Strip-Html $m.Groups[2].Value)
        if ([string]::IsNullOrWhiteSpace($label)) { continue }
        $abs = Make-Absolute $href $pageUrl
        if (-not $abs) { continue }
        $isDoc = $abs -match '\.(pdf|docx?|xlsx?|pptx?)(\?.*)?$'
        $isExternal = ($abs -notmatch [regex]::Escape('education.vic.gov.au'))
        $isPalSibling = $abs -match [regex]::Escape("$base/")
        if (-not ($isDoc -or $isExternal -or $isPalSibling)) { continue }
        if ($seen.ContainsKey($abs)) { continue }
        $seen[$abs] = $true
        [void]$resources.Add([pscustomobject]@{ label = $label; href = $abs })
    }
    if ($resources.Count -eq 0) { return $null }
    return ,$resources.ToArray()
}

# ----- Main ------------------------------------------------------------------
$wantTabs            = $Actions -contains 'needs_tabs'
$wantTails           = $Actions -contains 'needs_chapter_tails'
$wantFullChapters    = $Actions -contains 'needs_full_chapters'
$wantResources       = $Actions -contains 'needs_resources'

$resp = Invoke-Fetch $Url
Start-Sleep -Milliseconds $BetweenFetchesMs
$html = $resp.Content

$result = [pscustomobject]@{
    tabs      = $null
    chapters  = $null
    resources = $null
}

if ($wantTabs) {
    $result.tabs = Parse-Tabs $html $Url
}

if ($wantTails -or $wantFullChapters) {
    $chapters = Parse-Chapters $html $Url
    if ($null -ne $chapters) {
        $enriched = New-Object System.Collections.Generic.List[object]
        foreach ($c in $chapters) {
            $tail = Get-ChapterTail $c.href
            $full = if ($tail) { "$($c.title) — $tail" } else { $c.title }
            [void]$enriched.Add([pscustomobject]@{
                title = $c.title
                tail  = $tail
                full  = $full
                href  = $c.href
            })
        }
        $result.chapters = ,$enriched.ToArray()
    }
}

if ($wantResources) {
    $result.resources = Parse-Resources $Url
}

return $result

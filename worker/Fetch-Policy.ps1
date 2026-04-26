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
          @{ title = 'Original chapter title'; tail = ''; full = 'Original chapter title' },
          ...
      ) | $null
      resources  : @(
          @{ label = 'Resource name'; href = 'https://...' },
          ...
      ) | $null
    }

  Phase 2.A note: chapter titles are emitted BARE (no em-dash, no keyword
  tails). For each chapter we additionally fetch the chapter content and
  save the first 3-5 paragraphs as a snippet JSON to
  .work-queue\chapter-snippets\<entry_id>-<chapter_idx>.json so a separate
  Phase 2.B orchestrator pass can synthesise V26-style tails via LLM.

.PARAMETER Url
  The policy page URL (e.g. https://www2.education.vic.gov.au/pal/.../policy).

.PARAMETER Actions
  Array of action codes telling which fields to populate.

.PARAMETER EntryId
  Numeric db id of the entry being processed; used to name snippet files.
  Optional -- if omitted, snippet saving is skipped entirely.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [string]   $Url,
    [Parameter(Mandatory = $true)] [string[]] $Actions,
    [Parameter(Mandatory = $false)] [Nullable[double]] $EntryId = $null
)

$ErrorActionPreference = 'Stop'

$UserAgent = 'Mozilla/5.0 (PAL Quick Search worker)'
$MaxFetches = 20
$BetweenFetchesMs = 250
# Backoff schedules differ by failure class.
# 429 = rate limit (be patient); 5xx / network = fail fast (likely persistent).
$RateLimitBackoffSec  = @(30, 90, 180)
$ServerErrorBackoffSec = @(5, 15)
$NetworkBackoffSec     = @(5, 15)

# Hard wall-clock cap for the whole script (across all fetches in one entry).
$script:fetchCount = 0
$script:scriptStartTime = Get-Date
$TotalTimeoutSec = 120

# ----- Helpers ---------------------------------------------------------------
function Test-TotalTimeout {
    if (((Get-Date) - $script:scriptStartTime).TotalSeconds -gt $TotalTimeoutSec) {
        throw "fetch_failed total_timeout (>${TotalTimeoutSec}s)"
    }
}

function Invoke-Fetch([string]$u) {
    if ($script:fetchCount -ge $MaxFetches) {
        throw "fetch_cap_exceeded ($script:fetchCount)"
    }
    $script:fetchCount++

    $attempt = 0
    while ($true) {
        Test-TotalTimeout
        try {
            $resp = Invoke-WebRequest -Uri $u -UserAgent $UserAgent `
                -UseBasicParsing -TimeoutSec 30
            return $resp
        } catch {
            $code = $null
            if ($_.Exception.Response) {
                try { $code = [int]$_.Exception.Response.StatusCode } catch {}
            }

            # 4xx (excluding 429) -- no retry, fail immediately.
            if ($null -ne $code -and $code -ge 400 -and $code -lt 500 -and $code -ne 429) {
                throw "fetch_failed url=$u code=$code msg=$($_.Exception.Message)"
            }

            # 429 -- rate limit, long backoff (PAL deserves patience here).
            if ($code -eq 429) {
                if ($attempt -ge $RateLimitBackoffSec.Count) {
                    throw "fetch_failed url=$u code=429 msg=rate-limit retries exhausted"
                }
                $wait = $RateLimitBackoffSec[$attempt]
                $attempt++
                Test-TotalTimeout
                Start-Sleep -Seconds $wait
                continue
            }

            # 5xx -- server error, fail fast (most PAL 5xx = page gone).
            if ($null -ne $code -and $code -ge 500 -and $code -lt 600) {
                if ($attempt -ge $ServerErrorBackoffSec.Count) {
                    throw "fetch_failed url=$u code=$code msg=5xx persistent ($($_.Exception.Message))"
                }
                $wait = $ServerErrorBackoffSec[$attempt]
                $attempt++
                Test-TotalTimeout
                Start-Sleep -Seconds $wait
                continue
            }

            # Network / DNS / timeout (no HTTP status) -- fail fast.
            if ($null -eq $code) {
                if ($attempt -ge $NetworkBackoffSec.Count) {
                    throw "fetch_failed url=$u network_error msg=$($_.Exception.Message)"
                }
                $wait = $NetworkBackoffSec[$attempt]
                $attempt++
                Test-TotalTimeout
                Start-Sleep -Seconds $wait
                continue
            }

            # Anything else -- no retry.
            throw "fetch_failed url=$u code=$code msg=$($_.Exception.Message)"
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

# ----- Snippet directory -----------------------------------------------------
# Phase 2.A: instead of generating keyword tails inline, we save raw chapter
# snippets to disk so a separate orchestrator-driven Phase 2.B pass can
# synthesise V26-style tails via LLM reasoning.
$script:SnippetDir = $null
try {
    $projRoot = Split-Path -Parent $PSScriptRoot
    if ($projRoot) {
        $script:SnippetDir = Join-Path $projRoot '.work-queue\chapter-snippets'
        if (-not (Test-Path $script:SnippetDir)) {
            New-Item -ItemType Directory -Path $script:SnippetDir -Force | Out-Null
        }
    }
} catch {
    $script:SnippetDir = $null
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
# PAL renders chapters in two distinct shapes (see worker/SELECTOR-NOTES.md):
#
#   Pattern A (multi-page publication): a dedicated <ul data-depth="1"
#     class="...det-publication-menu det-publication-menu__child..."> whose
#     <a class="...det-publication-menu__item-link..."> children link to
#     sub-pages of the current policy. Use those sub-paths as chapter URLs.
#
#   Pattern B (single-page policy): chapters are <h2>/<h3 id="..."> headings
#     inside <div class="rpl-markup__inner">. Use the page URL itself as the
#     chapter URL (matches V26 baseline format for id 7 etc.).
#
# Defensive filters drop garbage like the "Skip to main content" a11y link,
# breadcrumb / nav / header / footer text, and bare anchors. If neither
# pattern yields anything after filters we return an empty array rather than
# falling back to "any anchor on the page" (the v0 bug).

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
    foreach ($p in $script:GarbageLabelPatterns) {
        if ($lower.Contains($p)) { return $true }
    }
    return $false
}

function Test-GarbageHref([string]$href, [string]$base) {
    if ([string]::IsNullOrWhiteSpace($href)) { return $true }
    # Drop in-page anchors (#rpl-main, #main, #content, etc.) -- real PAL
    # chapter URLs are sub-paths of the policy, not anchors.
    if ($href -match '#') { return $true }
    # Must live under the policy base path.
    if ($href -notmatch [regex]::Escape("$base/")) { return $true }
    # Drop tab targets themselves (they're sections, not chapters).
    if ($href -match "$([regex]::Escape($base))/(policy|guidance|resources|overview|policy-and-guidelines|templates)/?$") {
        return $true
    }
    return $false
}

function Parse-ChaptersFromMenu([string]$html, [string]$pageUrl, [string]$base) {
    # Pattern A: locate the dedicated chapter <ul> by its two distinguishing
    # attributes -- data-depth="1" AND det-publication-menu__child. The site
    # also renders a tab nav at data-depth="0" without the __child class, so
    # both checks are required to avoid pulling tabs as chapters.
    $chapters = New-Object System.Collections.Generic.List[object]
    $seenHrefs = @{}

    $ulPattern = '(?is)<ul\b[^>]*\bdata-depth="1"[^>]*\bclass="[^"]*det-publication-menu__child[^"]*"[^>]*>(.*?)</ul>'
    $ulMatches = [regex]::Matches($html, $ulPattern)
    if ($ulMatches.Count -eq 0) {
        # Class attribute order can vary -- try the reverse ordering as well.
        $ulPattern2 = '(?is)<ul\b[^>]*\bclass="[^"]*det-publication-menu__child[^"]*"[^>]*\bdata-depth="1"[^>]*>(.*?)</ul>'
        $ulMatches = [regex]::Matches($html, $ulPattern2)
    }

    foreach ($ul in $ulMatches) {
        $block = $ul.Groups[1].Value
        $linkPattern = '(?is)<a\b[^>]*\bhref="([^"]+)"[^>]*\bclass="[^"]*det-publication-menu__item-link[^"]*"[^>]*>(.*?)</a>'
        $linkMatches = [regex]::Matches($block, $linkPattern)
        if ($linkMatches.Count -eq 0) {
            # class attribute may appear before href -- try the other order.
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
    # Pattern B: extract <h2>/<h3 id="..."> headings from the rpl-markup__inner
    # content block. We deliberately skip the page-title <h2> (the first one,
    # which is just the policy name) and treat <h3>s as the chapter list.
    $chapters = New-Object System.Collections.Generic.List[object]
    $innerMatch = [regex]::Match($html, '(?is)<div\b[^>]*\bclass="[^"]*rpl-markup__inner[^"]*"[^>]*>(.*)$')
    if (-not $innerMatch.Success) { return $null }
    # Bound the search to roughly one screen of content so we don't pull in
    # related-policies sidebars further down the page.
    $section = $innerMatch.Groups[1].Value
    $endIdx = $section.IndexOf('</div></div>')
    if ($endIdx -gt 0) { $section = $section.Substring(0, $endIdx) }

    $headingPattern = '(?is)<h([23])\b[^>]*\bid="([^"]+)"[^>]*>(.*?)</h\1>'
    $hMatches = [regex]::Matches($section, $headingPattern)
    $skipFirstH2 = $true
    foreach ($m in $hMatches) {
        $level = $m.Groups[1].Value
        $label = (Strip-Html $m.Groups[3].Value)
        if ($level -eq '2' -and $skipFirstH2) {
            # The lead h2 is the policy title -- skip exactly once.
            $skipFirstH2 = $false
            continue
        }
        if (Test-GarbageLabel $label) { continue }
        # For single-page policies the chapter href is the page URL (matches
        # V26 baseline: chapter rows share the parent policy URL, the in-page
        # anchor is implied by the heading id but not encoded).
        [void]$chapters.Add([pscustomobject]@{ title = $label; href = $pageUrl })
    }
    if ($chapters.Count -eq 0) { return $null }
    return ,$chapters.ToArray()
}

function Parse-Chapters([string]$html, [string]$pageUrl) {
    $base = Get-PolicyBaseUrl $pageUrl
    # Try Pattern A (multi-page publication) first.
    $a = Parse-ChaptersFromMenu $html $pageUrl $base
    if ($null -ne $a -and $a.Count -gt 0) { return ,$a }
    # Fall back to Pattern B (single-page heading list).
    $b = Parse-ChaptersFromHeadings $html $pageUrl
    if ($null -ne $b -and $b.Count -gt 0) { return ,$b }
    # Neither matched -- explicit empty rather than fall through to garbage.
    return ,@()
}

function Get-FirstParagraphsSnippet([string]$html, [int]$maxParas = 5) {
    # Extract first 3-5 non-trivial <p> from rpl-markup__inner; fall back to
    # first <p> anywhere. Returns plain text (HTML stripped, whitespace normalised).
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
    # Pattern B: return the inner-html slice between this heading and the next
    # h2/h3 on the same already-fetched page (so the snippet extractor can
    # pull paragraphs scoped to this chapter only).
    $innerM = [regex]::Match($html, '(?is)<div\b[^>]*\bclass="[^"]*rpl-markup__inner[^"]*"[^>]*>(.*?)$')
    $section = if ($innerM.Success) { $innerM.Groups[1].Value } else { $html }

    $hPat = [regex]'(?is)<h([23])\b[^>]*\bid="([^"]+)"[^>]*>(.*?)</h\1>'
    $targetEnd = -1
    foreach ($hm in $hPat.Matches($section)) {
        $label = Strip-Html $hm.Groups[3].Value
        if ($label.Trim() -eq $headingTitle.Trim()) {
            $targetEnd = $hm.Index + $hm.Length
            break
        }
    }
    if ($targetEnd -lt 0) { return '' }

    $remainder = $section.Substring($targetEnd)
    $nextHx = [regex]::Match($remainder, '(?is)<h[23]\b')
    $segment = if ($nextHx.Success) { $remainder.Substring(0, $nextHx.Index) } `
               else { $remainder.Substring(0, [Math]::Min($remainder.Length, 6000)) }
    return $segment
}

# URL-level cache: avoids re-fetching the same sub-page (Pattern A chapters
# that share a URL, or when a chapter URL equals the parent page).
$script:FetchCache = @{}

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

    # Format file id: 3 -> "3", 3.5 -> "3.5".
    $idForName = if ($entryId -eq [math]::Floor([double]$entryId)) {
        ([int][double]$entryId).ToString()
    } else {
        ([string][double]$entryId)
    }
    $fileName = "$idForName-$chapterIdx.json"
    $filePath = Join-Path $script:SnippetDir $fileName

    # Cache: skip if already present.
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
    } catch {
        # Snippet save is best-effort -- never fail the chapter on disk error.
    }
}

function Get-ChapterSnippetFromUrl([string]$chapterUrl) {
    # Returns the snippet text or '' on any fetch / 5xx / network error.
    try {
        if (-not $script:FetchCache.ContainsKey($chapterUrl)) {
            $resp = Invoke-Fetch $chapterUrl
            Start-Sleep -Milliseconds $BetweenFetchesMs
            $script:FetchCache[$chapterUrl] = $resp.Content
        }
        $html = $script:FetchCache[$chapterUrl]
        return (Get-FirstParagraphsSnippet $html 5)
    } catch {
        return ''
    }
}

function Get-ChapterSnippetFromHtml([string]$html, [string]$headingTitle) {
    $segment = Get-HeadingSectionHtml $html $headingTitle
    if ([string]::IsNullOrWhiteSpace($segment)) { return '' }
    # Re-use the paragraph extractor on the bounded segment by wrapping it in
    # a synthetic rpl-markup__inner shell so the regex anchors correctly.
    $shell = '<div class="rpl-markup__inner">' + $segment + '</div>'
    return (Get-FirstParagraphsSnippet $shell 5)
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
    # Parse-Chapters returns @() (not $null) when no real chapter list is
    # found. Treat empty as "no chapters" -- emit chapters: @() rather than
    # falling back to garbage anchors.
    if ($null -eq $chapters) { $chapters = @() }
    $enriched = New-Object System.Collections.Generic.List[object]
    $idx = 0
    foreach ($c in $chapters) {
        $idx++
        # Phase 2.A: emit bare titles (no em-dash, no keyword tails). A separate
        # orchestrator-driven Phase 2.B pass will read the saved snippets and
        # patch tails into the JSX via LLM reasoning.
        $bareTitle = $c.title

        # Best-effort snippet save -- never fails the chapter.
        if ($null -ne $EntryId) {
            $snippetText = ''
            if ($c.href -ne $Url) {
                # Pattern A: chapter has its own sub-page -- fetch it.
                $snippetText = Get-ChapterSnippetFromUrl $c.href
            } else {
                # Pattern B: chapter is an in-page heading -- slice from the
                # already-fetched parent HTML (no extra network call).
                $snippetText = Get-ChapterSnippetFromHtml $html $c.title
            }
            if (-not [string]::IsNullOrWhiteSpace($snippetText)) {
                Save-ChapterSnippet -entryId $EntryId `
                    -chapterIdx $idx `
                    -chapterTitle $bareTitle `
                    -chapterUrl $c.href `
                    -snippetText $snippetText
            }
        }

        [void]$enriched.Add([pscustomobject]@{
            title = $bareTitle
            tail  = ''
            full  = $bareTitle
            href  = $c.href
        })
    }
    $result.chapters = ,$enriched.ToArray()
}

if ($wantResources) {
    $result.resources = Parse-Resources $Url
}

return $result

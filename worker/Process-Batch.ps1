#Requires -Version 5.1
<#
.SYNOPSIS
  Helper that processes a batch of pending items (Phase 2 enrichment OR Phase 3
  new-entry creation).

.DESCRIPTION
  Run-Worker.ps1 inlines the batch loop for simplicity and timing precision, so
  this script is provided as a thin convenience wrapper for ad-hoc invocation.
  Routing is by -Phase (default 'phase2').

.PARAMETER Items
  Array of pending-queue items.

.PARAMETER JsxFile
  Absolute path to src\PALSearch.jsx.

.PARAMETER Phase
  'phase2' (default) -- enrichment via Fetch-Policy + Patch-Jsx.
  'phase3'           -- new entries via Create-Entry + Append-Entry.

.OUTPUTS
  PSCustomObject with .Succeeded (array) and .Failed (array).
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [object[]] $Items,
    [Parameter(Mandatory = $true)] [string]   $JsxFile,
    [Parameter()] [ValidateSet('phase2','phase3')] [string] $Phase = 'phase2',
    [Parameter()] [double] $TimeoutMinutes = 6.5
)

$ErrorActionPreference = 'Stop'

$succeeded = @()
$failed = @()
$startTime = Get-Date

foreach ($item in $Items) {
    if (((Get-Date) - $startTime).TotalMinutes -gt $TimeoutMinutes) {
        Write-Host "Process-Batch: timeout, stopping early."
        break
    }
    try {
        if ($Phase -eq 'phase3') {
            $entry = & (Join-Path $PSScriptRoot 'Create-Entry.ps1') `
                -PalUrl $item.pal_url `
                -NewId ([double]$item.new_id) `
                -DbCategory $item.suggested_db_category `
                -PalTitle $item.pal_title

            & (Join-Path $PSScriptRoot 'Append-Entry.ps1') `
                -Entry $entry `
                -JsxFile $JsxFile
        } else {
            $patch = & (Join-Path $PSScriptRoot 'Fetch-Policy.ps1') `
                -Url $item.url `
                -Actions @($item.actions_needed) `
                -EntryId ([double]$item.db_id)

            & (Join-Path $PSScriptRoot 'Patch-Jsx.ps1') `
                -EntryId $item.db_id `
                -Patch $patch `
                -JsxFile $JsxFile
        }
        $succeeded += ,$item
    } catch {
        $err = $_.Exception.Message
        $item | Add-Member -NotePropertyName 'last_error' -NotePropertyValue $err -Force
        $failed += ,$item
    }
}

return [pscustomobject]@{
    Succeeded = $succeeded
    Failed    = $failed
}

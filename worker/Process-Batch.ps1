#Requires -Version 5.1
<#
.SYNOPSIS
  Helper that processes a batch of pending items.

.DESCRIPTION
  Run-Worker.ps1 inlines the batch loop for simplicity and timing precision, so
  this script is provided as a thin convenience wrapper for ad-hoc invocation.
  Given an explicit list of items (parsed from phase2-pending.json), it calls
  Fetch-Policy.ps1 + Patch-Jsx.ps1 for each and returns a hashtable summary.

.PARAMETER Items
  Array of pending-queue items (PSCustomObject with db_id, url, actions_needed).

.PARAMETER JsxFile
  Absolute path to src\PALSearch.jsx.

.OUTPUTS
  PSCustomObject with .Succeeded (array) and .Failed (array).
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [object[]] $Items,
    [Parameter(Mandatory = $true)] [string]   $JsxFile,
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
        $patch = & (Join-Path $PSScriptRoot 'Fetch-Policy.ps1') `
            -Url $item.url `
            -Actions @($item.actions_needed) `
            -EntryId ([double]$item.db_id)

        & (Join-Path $PSScriptRoot 'Patch-Jsx.ps1') `
            -EntryId $item.db_id `
            -Patch $patch `
            -JsxFile $JsxFile

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

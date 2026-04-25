#Requires -Version 5.1
<#
.SYNOPSIS
  Remove the PAL-Search-Phase2-Worker scheduled task. Idempotent.
#>

$ErrorActionPreference = 'Stop'

$taskName = 'PAL-Search-Phase2-Worker'

$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Removed scheduled task '$taskName'."
} else {
    Write-Host "Scheduled task '$taskName' not found (nothing to remove)."
}

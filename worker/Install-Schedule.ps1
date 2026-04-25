#Requires -Version 5.1
<#
.SYNOPSIS
  Register the PAL-Search-Phase2-Worker scheduled task.

.DESCRIPTION
  Creates a Windows Task Scheduler task that runs Run-Worker.ps1 every 5 minutes,
  starting now, repeating indefinitely. Runs as the current logged-in user only.
  Idempotent -- re-registering replaces the existing task.
#>

$ErrorActionPreference = 'Stop'

$taskName    = 'PAL-Search-Phase2-Worker'
$projectRoot = Split-Path -Parent $PSScriptRoot
$workerScript = Join-Path $projectRoot 'worker\Run-Worker.ps1'

if (-not (Test-Path $workerScript)) {
    throw "Cannot find Run-Worker.ps1 at $workerScript"
}

# Prefer pwsh.exe (PowerShell 7+); fall back to powershell.exe (5.1).
$pwshExe = (Get-Command pwsh.exe -ErrorAction SilentlyContinue).Source
if (-not $pwshExe) {
    $pwshExe = (Get-Command powershell.exe -ErrorAction SilentlyContinue).Source
}
if (-not $pwshExe) {
    throw 'Neither pwsh.exe nor powershell.exe found on PATH.'
}

Write-Host "Using shell: $pwshExe"
Write-Host "Project root: $projectRoot"
Write-Host "Worker script: $workerScript"

# Remove any existing instance so this script is idempotent.
$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Removing existing task '$taskName'..."
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

$action = New-ScheduledTaskAction `
    -Execute $pwshExe `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$workerScript`"" `
    -WorkingDirectory $projectRoot

# Trigger every 5 minutes, indefinitely, starting 1 minute from now to give the
# install command time to return.
$startTime = (Get-Date).AddMinutes(1)
$trigger = New-ScheduledTaskTrigger `
    -Once `
    -At $startTime `
    -RepetitionInterval (New-TimeSpan -Minutes 5) `
    -RepetitionDuration ([TimeSpan]::FromDays(3650))   # ~10 years = effectively indefinite

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 8)

# Run as current user, interactive (no stored password, only runs while logged in).
$principal = New-ScheduledTaskPrincipal `
    -UserId "$env:USERDOMAIN\$env:USERNAME" `
    -LogonType Interactive `
    -RunLevel Limited

$task = New-ScheduledTask `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description 'PAL Quick Search -- Phase 2 deep-index enrichment worker.'

Register-ScheduledTask -TaskName $taskName -InputObject $task | Out-Null

$info = Get-ScheduledTaskInfo -TaskName $taskName
Write-Host ""
Write-Host "Registered scheduled task '$taskName'."
Write-Host "Next run time: $($info.NextRunTime)"
Write-Host ""
Write-Host "To verify:        Get-ScheduledTask -TaskName '$taskName'"
Write-Host "To run manually:  pwsh -File worker\Run-Worker.ps1"
Write-Host "To uninstall:     pwsh -File worker\Uninstall-Schedule.ps1"

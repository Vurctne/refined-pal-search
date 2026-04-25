#Requires -Version 5.1
<#
.SYNOPSIS
  Show a human-readable status snapshot of the Phase 2 worker.
#>

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$pendingFile = Join-Path $projectRoot '.work-queue\phase2-pending.json'
$doneFile    = Join-Path $projectRoot '.work-queue\phase2-done.json'
$failedFile  = Join-Path $projectRoot '.work-queue\phase2-failed.json'
$logFile     = Join-Path $projectRoot '.work-queue\recent-runs.log'

function Get-Count($path) {
    if (-not (Test-Path $path)) { return 0 }
    try {
        $obj = Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json
        return @($obj.items).Count
    } catch {
        return 0
    }
}

$pending = Get-Count $pendingFile
$done    = Get-Count $doneFile
$failed  = Get-Count $failedFile

Write-Host 'PAL-Search Phase 2 Worker Status'
Write-Host '================================'
Write-Host "Pending: $pending"
Write-Host "Done:    $done"
Write-Host "Failed:  $failed"
Write-Host ''

# Last run from log file (if any).
if (Test-Path $logFile) {
    $tail = Get-Content $logFile -Tail 30 -ErrorAction SilentlyContinue
    $lastRunEnd = $tail | Where-Object { $_ -match 'RUN_END' } | Select-Object -Last 1
    if ($lastRunEnd) {
        Write-Host "Last run: $lastRunEnd"
    } else {
        $lastLine = $tail | Select-Object -Last 1
        if ($lastLine) { Write-Host "Last log: $lastLine" }
    }
} else {
    Write-Host 'Last run: (no recent-runs.log yet)'
}

# Scheduled task info.
$task = Get-ScheduledTask -TaskName 'PAL-Search-Phase2-Worker' -ErrorAction SilentlyContinue
if ($task) {
    $info = Get-ScheduledTaskInfo -TaskName 'PAL-Search-Phase2-Worker'
    Write-Host "Schedule state:    $($task.State)"
    Write-Host "Next scheduled:    $($info.NextRunTime)"
    Write-Host "Last result code:  $($info.LastTaskResult)"
} else {
    Write-Host 'Schedule:          NOT INSTALLED (run worker\Install-Schedule.ps1)'
}

Write-Host ''
Write-Host 'Last 5 commits:'
Push-Location $projectRoot
try {
    & git log --oneline -n 5 2>&1 | ForEach-Object { Write-Host "  $_" }
} catch {
    Write-Host '  (git log failed)'
} finally {
    Pop-Location
}

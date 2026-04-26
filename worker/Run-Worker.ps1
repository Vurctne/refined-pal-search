#Requires -Version 5.1
<#
.SYNOPSIS
  PAL Quick Search -- worker entry point (Phase 2 + Phase 3 routing).

.DESCRIPTION
  Locks the queue, processes a small batch of pending entries, builds, commits,
  deploys, and self-disables when the queue empties.

  Phase routing: detects which phase queue has work first.
    Phase 3 (priority -- new entries) ahead of Phase 2 (enrichment).
  If both queues are empty the worker self-disables.

  Designed to be triggered every 2-5 minutes by Windows Task Scheduler.
#>

$ErrorActionPreference = 'Stop'

# Resolve project root from script location.
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# --- Paths -------------------------------------------------------------------
$lockFile     = Join-Path $projectRoot '.work-queue\.lock'
$logFile      = Join-Path $projectRoot '.work-queue\recent-runs.log'

# Phase 2 queues.
$p2PendingFile = Join-Path $projectRoot '.work-queue\phase2-pending.json'
$p2DoneFile    = Join-Path $projectRoot '.work-queue\phase2-done.json'
$p2FailedFile  = Join-Path $projectRoot '.work-queue\phase2-failed.json'

# Phase 3 queues.
$p3PendingFile = Join-Path $projectRoot '.work-queue\phase3-pending.json'
$p3DoneFile    = Join-Path $projectRoot '.work-queue\phase3-done.json'
$p3FailedFile  = Join-Path $projectRoot '.work-queue\phase3-failed.json'

$statusFile   = Join-Path $projectRoot 'ORCHESTRATION-STATUS.md'
$jsxFile      = Join-Path $projectRoot 'src\PALSearch.jsx'
$envLocalFile = Join-Path $projectRoot '.env.local'

$batchSize = 3
$batchTimeoutMinutes = 6.5
$lockMaxAgeMinutes = 8

# --- Helpers -----------------------------------------------------------------
function Write-Log([string]$msg) {
    $ts = (Get-Date).ToString('o')
    $line = "$ts $msg"
    try { Add-Content -Path $logFile -Value $line -Encoding UTF8 } catch {}
    Write-Host "[$ts] $msg"
}

function Get-Attempts($item) {
    if ($null -eq $item.attempts) { return 0 }
    try { return [int]$item.attempts } catch { return 0 }
}

function Save-Json($obj, $path) {
    $json = $obj | ConvertTo-Json -Depth 12
    Set-Content -Path $path -Value $json -Encoding UTF8
}

function Ensure-Json($path, $defaultObj) {
    if (-not (Test-Path $path)) {
        Save-Json $defaultObj $path
    }
}

function Load-Json($path) {
    return (Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json)
}

function Get-PendingCount($path) {
    if (-not (Test-Path $path)) { return 0 }
    try {
        $q = Load-Json $path
        if ($null -eq $q.items) { return 0 }
        return @($q.items).Count
    } catch { return 0 }
}

# Phase routing: prefer phase3 if it has work, else phase2.
function Detect-ActivePhase {
    $p3 = Get-PendingCount $p3PendingFile
    if ($p3 -gt 0) { return 'phase3' }
    $p2 = Get-PendingCount $p2PendingFile
    if ($p2 -gt 0) { return 'phase2' }
    return $null
}

# --- Lock check --------------------------------------------------------------
if (Test-Path $lockFile) {
    $age = (Get-Date) - (Get-Item $lockFile).LastWriteTime
    if ($age.TotalMinutes -lt $lockMaxAgeMinutes) {
        Write-Log "PREVIOUS_RUNNING age=$([math]::Round($age.TotalMinutes,1))m -- skipping"
        exit 0
    }
    Write-Log "STALE_LOCK_REMOVED age=$([math]::Round($age.TotalMinutes,1))m"
    Remove-Item $lockFile -Force
}
Set-Content -Path $lockFile -Value (Get-Date).ToString('o') -Encoding UTF8

try {
    Write-Log 'RUN_START'

    $activePhase = Detect-ActivePhase
    if ($null -eq $activePhase) {
        Write-Log "ALL_QUEUES_EMPTY -- disabling schedule"
        try { & (Join-Path $PSScriptRoot 'Uninstall-Schedule.ps1') } catch { Write-Log "UNINSTALL_FAILED $($_.Exception.Message)" }
        $marker = "`n## All phases complete: $((Get-Date).ToString('o'))`n"
        Add-Content -Path $statusFile -Value $marker -Encoding UTF8
        return
    }

    Write-Log "ACTIVE_PHASE=$activePhase"

    # --- Resolve phase-specific paths --------------------------------------
    if ($activePhase -eq 'phase3') {
        $pendingFile = $p3PendingFile
        $doneFile    = $p3DoneFile
        $failedFile  = $p3FailedFile
        $idField     = 'new_id'
        $commitTag   = 'add(phase3)'
        $commitWord  = 'new entries'
    } else {
        $pendingFile = $p2PendingFile
        $doneFile    = $p2DoneFile
        $failedFile  = $p2FailedFile
        $idField     = 'db_id'
        $commitTag   = 'enrich(phase2)'
        $commitWord  = 'entries'
    }

    Ensure-Json $doneFile   ([pscustomobject]@{ items = @() })
    Ensure-Json $failedFile ([pscustomobject]@{ items = @() })

    $pending = Load-Json $pendingFile
    if ($null -eq $pending.items) {
        $pending | Add-Member -NotePropertyName 'items' -NotePropertyValue @() -Force
    }
    $pendingItems = @($pending.items)

    # --- Take batch ---------------------------------------------------------
    $batch = @($pendingItems | Select-Object -First $batchSize)
    $batchIds = ($batch | ForEach-Object { $_.$idField }) -join ','
    Write-Log "BATCH_TAKEN phase=$activePhase size=$($batch.Count) ids=$batchIds"

    $startTime = Get-Date
    $succeeded = @()
    $failedThisRun = @()

    foreach ($item in $batch) {
        if (((Get-Date) - $startTime).TotalMinutes -gt $batchTimeoutMinutes) {
            Write-Log "TIMEOUT -- stopping batch early"
            break
        }
        $itemId = $item.$idField
        Write-Log "PROCESSING phase=$activePhase id=$itemId"
        try {
            if ($activePhase -eq 'phase3') {
                # New-entry creation: fetch + build entry object + append.
                $entry = & (Join-Path $PSScriptRoot 'Create-Entry.ps1') `
                    -PalUrl $item.pal_url `
                    -NewId ([double]$item.new_id) `
                    -DbCategory $item.suggested_db_category `
                    -PalTitle $item.pal_title

                & (Join-Path $PSScriptRoot 'Append-Entry.ps1') `
                    -Entry $entry `
                    -JsxFile $jsxFile
            } else {
                # Enrichment: fetch + patch existing entry.
                $patch = & (Join-Path $PSScriptRoot 'Fetch-Policy.ps1') `
                    -Url $item.url `
                    -Actions @($item.actions_needed) `
                    -EntryId ([double]$item.db_id)

                & (Join-Path $PSScriptRoot 'Patch-Jsx.ps1') `
                    -EntryId $item.db_id `
                    -Patch $patch `
                    -JsxFile $jsxFile
            }
            $succeeded += ,$item
            Write-Log "OK id=$itemId"
        } catch {
            $msg = $_.Exception.Message
            Write-Log "FAILED id=$itemId error=$msg"
            $newAttempts = (Get-Attempts $item) + 1
            if ($item.PSObject.Properties.Match('attempts').Count -gt 0) {
                $item.attempts = $newAttempts
            } else {
                $item | Add-Member -NotePropertyName 'attempts' -NotePropertyValue $newAttempts -Force
            }
            if ($newAttempts -ge 3) { $failedThisRun += ,$item }
        }
    }

    # --- Build verify -------------------------------------------------------
    $buildOk = $false
    if ($succeeded.Count -gt 0) {
        Write-Log "BUILD_START"
        try {
            $buildOutput = & npm run build 2>&1
            if ($LASTEXITCODE -eq 0) {
                $buildOk = $true
                Write-Log "BUILD_OK"
            } else {
                Write-Log "BUILD_FAILED exit=$LASTEXITCODE -- reverting JSX"
                & git checkout HEAD -- $jsxFile 2>&1 | Out-Null
            }
        } catch {
            Write-Log "BUILD_ERROR $($_.Exception.Message) -- reverting JSX"
            try { & git checkout HEAD -- $jsxFile 2>&1 | Out-Null } catch {}
        }

        if (-not $buildOk) {
            $newlyFailed = @()
            foreach ($item in $succeeded) {
                $newAttempts = (Get-Attempts $item) + 1
                if ($item.PSObject.Properties.Match('attempts').Count -gt 0) {
                    $item.attempts = $newAttempts
                } else {
                    $item | Add-Member -NotePropertyName 'attempts' -NotePropertyValue $newAttempts -Force
                }
                if ($newAttempts -ge 3) { $newlyFailed += ,$item }
            }
            $failedThisRun += $newlyFailed
            $succeeded = @()
        }
    } else {
        Write-Log "NO_SUCCESS -- skipping build"
    }

    # --- Update queue files -------------------------------------------------
    $succeededIds = @($succeeded | ForEach-Object { $_.$idField })
    $failedIds = @($failedThisRun | ForEach-Object { $_.$idField })

    $remainingPending = @()
    foreach ($item in $pendingItems) {
        if ($succeededIds -contains $item.$idField) { continue }
        if ($failedIds -contains $item.$idField) { continue }
        $remainingPending += ,$item
    }
    $pending.items = $remainingPending
    if ($pending.PSObject.Properties.Match('total').Count -gt 0) {
        $pending.total = $remainingPending.Count
    } else {
        $pending | Add-Member -NotePropertyName 'total' -NotePropertyValue $remainingPending.Count -Force
    }
    Save-Json $pending $pendingFile

    if ($succeeded.Count -gt 0) {
        $done = Load-Json $doneFile
        if ($null -eq $done.items) {
            $done | Add-Member -NotePropertyName 'items' -NotePropertyValue @() -Force
        }
        $doneItems = @($done.items)
        foreach ($item in $succeeded) {
            $item | Add-Member -NotePropertyName 'completed_at' -NotePropertyValue ((Get-Date).ToString('o')) -Force
            $doneItems += ,$item
        }
        $done.items = $doneItems
        Save-Json $done $doneFile
    }

    if ($failedThisRun.Count -gt 0) {
        $failed = Load-Json $failedFile
        if ($null -eq $failed.items) {
            $failed | Add-Member -NotePropertyName 'items' -NotePropertyValue @() -Force
        }
        $failedItems = @($failed.items)
        foreach ($item in $failedThisRun) {
            $item | Add-Member -NotePropertyName 'failed_at' -NotePropertyValue ((Get-Date).ToString('o')) -Force
            $failedItems += ,$item
        }
        $failed.items = $failedItems
        Save-Json $failed $failedFile
    }

    # --- Commit + deploy ----------------------------------------------------
    if ($succeeded.Count -gt 0 -and $buildOk) {
        $idsCsv = ($succeededIds -join ', ')
        Write-Log "COMMIT_START ids=$idsCsv"
        & git add 'src\PALSearch.jsx' '.work-queue/' 2>&1 | Out-Null
        $commitMsg = "$commitTag" + ': batch ids ' + $idsCsv + " ($commitWord)"
        & git commit -m $commitMsg 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Log "COMMITTED ids=$idsCsv"
        } else {
            Write-Log "COMMIT_FAILED exit=$LASTEXITCODE (continuing)"
        }

        if (Test-Path $envLocalFile) {
            foreach ($line in Get-Content $envLocalFile) {
                if ($line -match '^\s*#') { continue }
                if ($line -match '^\s*$') { continue }
                if ($line -match '^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
                    $key = $Matches[1]
                    $val = $Matches[2].Trim('"').Trim("'")
                    [Environment]::SetEnvironmentVariable($key, $val, 'Process')
                }
            }
        }

        Write-Log "DEPLOY_START"
        try {
            $deployOutput = & npm run deploy 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Log "DEPLOYED"
            } else {
                Write-Log "DEPLOY_FAILED exit=$LASTEXITCODE -- will retry next run"
            }
        } catch {
            Write-Log "DEPLOY_ERROR $($_.Exception.Message)"
        }
    }

    # --- Status report ------------------------------------------------------
    $doneCount = 0
    try { $doneCount = @((Load-Json $doneFile).items).Count } catch {}

    $buildLabel = if ($buildOk) { 'PASS' } elseif ($succeeded.Count -eq 0 -and $failedThisRun.Count -eq 0) { 'SKIPPED (no work)' } else { 'FAIL -- reverted' }

    $statusBlock = @"

## Worker run: $((Get-Date).ToString('o'))
- Phase: $activePhase
- Batch size: $batchSize (took $($batch.Count))
- Succeeded: $($succeeded.Count) -- ids: $($succeededIds -join ', ')
- Failed: $($failedThisRun.Count) -- ids: $($failedIds -join ', ')
- Pending remaining: $($remainingPending.Count)
- Done so far: $doneCount
- Build: $buildLabel
"@
    Add-Content -Path $statusFile -Value $statusBlock -Encoding UTF8

    Write-Log "RUN_END phase=$activePhase succeeded=$($succeeded.Count) failed=$($failedThisRun.Count) remaining=$($remainingPending.Count)"

} catch {
    Write-Log "FATAL $($_.Exception.Message)"
    throw
} finally {
    if (Test-Path $lockFile) {
        try { Remove-Item $lockFile -Force } catch {}
    }
}

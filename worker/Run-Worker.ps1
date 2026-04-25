#Requires -Version 5.1
<#
.SYNOPSIS
  PAL Quick Search -- Phase 2 worker entry point.

.DESCRIPTION
  Locks the queue, processes a small batch of pending entries, builds, commits,
  deploys, and self-disables when the queue empties. Designed to be triggered
  every 5 minutes by Windows Task Scheduler.
#>

$ErrorActionPreference = 'Stop'

# Resolve project root from script location.
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# --- Paths -------------------------------------------------------------------
$lockFile     = Join-Path $projectRoot '.work-queue\.lock'
$logFile      = Join-Path $projectRoot '.work-queue\recent-runs.log'
$pendingFile  = Join-Path $projectRoot '.work-queue\phase2-pending.json'
$doneFile     = Join-Path $projectRoot '.work-queue\phase2-done.json'
$failedFile   = Join-Path $projectRoot '.work-queue\phase2-failed.json'
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

# Track lock removal even on error.
try {
    Write-Log 'RUN_START'

    # --- Load queue files ----------------------------------------------------
    Ensure-Json $doneFile   ([pscustomobject]@{ items = @() })
    Ensure-Json $failedFile ([pscustomobject]@{ items = @() })

    if (-not (Test-Path $pendingFile)) {
        Write-Log "NO_PENDING_FILE -- bailing"
        return
    }

    $pending = Get-Content $pendingFile -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($null -eq $pending.items) {
        $pending | Add-Member -NotePropertyName 'items' -NotePropertyValue @() -Force
    }
    $pendingItems = @($pending.items)

    # --- Self-disable when empty --------------------------------------------
    if ($pendingItems.Count -eq 0) {
        Write-Log "QUEUE_EMPTY -- disabling schedule"
        try {
            & (Join-Path $PSScriptRoot 'Uninstall-Schedule.ps1')
        } catch {
            Write-Log "UNINSTALL_FAILED $($_.Exception.Message)"
        }
        $marker = "`n## Phase 2 complete: $((Get-Date).ToString('o'))`n"
        Add-Content -Path $statusFile -Value $marker -Encoding UTF8
        return
    }

    # --- Take batch ---------------------------------------------------------
    $batch = @($pendingItems | Select-Object -First $batchSize)
    Write-Log "BATCH_TAKEN size=$($batch.Count) ids=$(($batch | ForEach-Object { $_.db_id }) -join ',')"

    $startTime = Get-Date
    $succeeded = @()
    $failedThisRun = @()

    foreach ($item in $batch) {
        if (((Get-Date) - $startTime).TotalMinutes -gt $batchTimeoutMinutes) {
            Write-Log "TIMEOUT -- stopping batch early"
            break
        }
        Write-Log "PROCESSING id=$($item.db_id) url=$($item.url)"
        try {
            $patch = & (Join-Path $PSScriptRoot 'Fetch-Policy.ps1') `
                -Url $item.url `
                -Actions @($item.actions_needed)

            & (Join-Path $PSScriptRoot 'Patch-Jsx.ps1') `
                -EntryId $item.db_id `
                -Patch $patch `
                -JsxFile $jsxFile

            $succeeded += ,$item
            Write-Log "ENRICHED id=$($item.db_id)"
        } catch {
            $msg = $_.Exception.Message
            Write-Log "FAILED id=$($item.db_id) error=$msg"
            $newAttempts = (Get-Attempts $item) + 1
            if ($item.PSObject.Properties.Match('attempts').Count -gt 0) {
                $item.attempts = $newAttempts
            } else {
                $item | Add-Member -NotePropertyName 'attempts' -NotePropertyValue $newAttempts -Force
            }
            if ($newAttempts -ge 3) {
                $failedThisRun += ,$item
            }
            # else: leave in pending; attempts persisted on save.
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
            # Everything that "succeeded" enrichment is now a build-failure;
            # bump attempts and possibly move to failed.
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
        # Nothing enriched -- no need to build.
        Write-Log "NO_ENRICHMENTS -- skipping build"
    }

    # --- Update queue files -------------------------------------------------
    $succeededIds = @($succeeded | ForEach-Object { $_.db_id })
    $failedIds = @($failedThisRun | ForEach-Object { $_.db_id })

    $remainingPending = @()
    foreach ($item in $pendingItems) {
        if ($succeededIds -contains $item.db_id) { continue }
        if ($failedIds -contains $item.db_id) { continue }
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
        $done = Get-Content $doneFile -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($null -eq $done.items) {
            $done | Add-Member -NotePropertyName 'items' -NotePropertyValue @() -Force
        }
        $doneItems = @($done.items)
        foreach ($item in $succeeded) {
            $item | Add-Member -NotePropertyName 'completed_at' `
                -NotePropertyValue ((Get-Date).ToString('o')) -Force
            $doneItems += ,$item
        }
        $done.items = $doneItems
        Save-Json $done $doneFile
    }

    if ($failedThisRun.Count -gt 0) {
        $failed = Get-Content $failedFile -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($null -eq $failed.items) {
            $failed | Add-Member -NotePropertyName 'items' -NotePropertyValue @() -Force
        }
        $failedItems = @($failed.items)
        foreach ($item in $failedThisRun) {
            $item | Add-Member -NotePropertyName 'failed_at' `
                -NotePropertyValue ((Get-Date).ToString('o')) -Force
            $failedItems += ,$item
        }
        $failed.items = $failedItems
        Save-Json $failed $failedFile
    }

    # --- Commit + deploy ----------------------------------------------------
    if ($succeeded.Count -gt 0 -and $buildOk) {
        $idsCsv = ($succeededIds -join ',')
        Write-Log "COMMIT_START ids=$idsCsv"
        & git add 'src\PALSearch.jsx' '.work-queue/' 2>&1 | Out-Null
        $commitMsg = "enrich(phase2): batch ids $idsCsv [$($succeeded.Count) entries]"
        & git commit -m $commitMsg 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Log "COMMITTED ids=$idsCsv"
        } else {
            Write-Log "COMMIT_FAILED exit=$LASTEXITCODE (continuing -- possibly nothing to commit)"
        }

        # Load .env.local into process env so wrangler/npm-deploy can authenticate.
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
    try {
        $doneCount = @((Get-Content $doneFile -Raw -Encoding UTF8 | ConvertFrom-Json).items).Count
    } catch {}

    $buildLabel = if ($buildOk) { 'PASS' } elseif ($succeeded.Count -eq 0 -and $failedThisRun.Count -eq 0) { 'SKIPPED (no enrichments)' } else { 'FAIL -- reverted' }

    $statusBlock = @"

## Worker run: $((Get-Date).ToString('o'))
- Batch size: $batchSize (took $($batch.Count))
- Succeeded: $($succeeded.Count) -- ids: $($succeededIds -join ', ')
- Failed: $($failedThisRun.Count) -- ids: $($failedIds -join ', ')
- Pending remaining: $($remainingPending.Count)
- Done so far: $doneCount
- Build: $buildLabel
"@
    Add-Content -Path $statusFile -Value $statusBlock -Encoding UTF8

    Write-Log "RUN_END succeeded=$($succeeded.Count) failed=$($failedThisRun.Count) remaining=$($remainingPending.Count)"

} catch {
    Write-Log "FATAL $($_.Exception.Message)"
    throw
} finally {
    if (Test-Path $lockFile) {
        try { Remove-Item $lockFile -Force } catch {}
    }
}

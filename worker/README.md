# PAL Quick Search — Phase 2 Worker

A self-driving Windows worker that processes the Phase 2 enrichment queue.
Triggered every 2 minutes by Windows Task Scheduler, runs natively on Windows
PowerShell (no WSL), enriches one batch of entries per run, builds, commits,
deploys, and self-disables when the queue empties.

## Prerequisites

- Windows 10/11 with PowerShell 5.1 or PowerShell 7+ (`pwsh`)
- `git` on the PATH (Git for Windows)
- `node` and `npm` on the PATH (the project uses Vite + Cloudflare Wrangler)
- A populated `.env.local` at the project root with `CLOUDFLARE_API_TOKEN`
  (and any other env vars `npm run deploy` needs)

Verify from a fresh PowerShell window:

```powershell
git --version
node --version
npm --version
pwsh -Version    # or: powershell -Command "$PSVersionTable.PSVersion"
```

## One-time install

From the project root (`D:\Software\Productivity\refined PAL Search`):

```powershell
pwsh -ExecutionPolicy Bypass -File worker\Install-Schedule.ps1
```

If you're on Windows PowerShell 5.1 only:

```powershell
powershell.exe -ExecutionPolicy Bypass -File worker\Install-Schedule.ps1
```

This registers a scheduled task named `PAL-Search-Phase2-Worker` that fires
every 2 minutes, running as the current user, only while the user is logged in.

## Verify the schedule

```powershell
Get-ScheduledTask -TaskName "PAL-Search-Phase2-Worker"
Get-ScheduledTaskInfo -TaskName "PAL-Search-Phase2-Worker"
```

## Manual run (for testing)

You don't need to wait for the next scheduled tick:

```powershell
pwsh -File worker\Run-Worker.ps1
```

The script will:

1. Acquire a per-run lock (skip if previous run still active and < 8 min old).
2. Pull a batch of 3 pending entries.
3. Fetch each policy URL, parse chapters/resources, enrich `src\PALSearch.jsx`.
4. Run `npm run build`. If it fails, revert the JSX and mark the batch as failed.
5. On success: commit `src\PALSearch.jsx` + `.work-queue\` and run `npm run deploy`.
6. Append a run summary to `ORCHESTRATION-STATUS.md` and `.work-queue\recent-runs.log`.
7. When the pending queue empties, automatically uninstall the scheduled task.

## Check progress at any time

```powershell
pwsh -File worker\Get-Status.ps1
```

Shows pending / done / failed counts, last run timestamp, next scheduled run,
and the last 5 git commits on the branch.

## Pause / stop the schedule

```powershell
pwsh -File worker\Uninstall-Schedule.ps1
```

Idempotent — silently succeeds if the task doesn't exist. The worker also
auto-uninstalls itself the moment the queue empties, so you usually won't need
to run this manually.

## Files in this directory

| File                     | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `Install-Schedule.ps1`   | Register the Task Scheduler task (one-time).     |
| `Uninstall-Schedule.ps1` | Remove the Task Scheduler task.                  |
| `Run-Worker.ps1`         | Main entry — locks, processes one batch, exits.  |
| `Process-Batch.ps1`      | Helper invoked by `Run-Worker.ps1` (batch loop). |
| `Fetch-Policy.ps1`       | Fetch + parse a PAL policy URL into a patch.     |
| `Patch-Jsx.ps1`          | Apply a patch to `src\PALSearch.jsx`.            |
| `Get-Status.ps1`         | Human-readable status snapshot.                  |
| `README.md`              | This file.                                       |

## Troubleshooting

- **`npm run deploy` fails with auth error.** Open `.env.local` at the project
  root and confirm `CLOUDFLARE_API_TOKEN=...` is present. The worker reads
  `.env.local` and exports each `KEY=VALUE` line into the process environment
  before calling `npm run deploy`.
- **Build fails.** The worker reverts `src\PALSearch.jsx` with
  `git checkout HEAD -- src\PALSearch.jsx` and bumps the batch's `attempts`
  counter. After 3 failed attempts an item is moved from
  `phase2-pending.json` to `phase2-failed.json` for human review.
- **Task didn't run.** `Get-ScheduledTaskInfo -TaskName "PAL-Search-Phase2-Worker"`
  shows `LastRunTime`, `LastTaskResult`, and `NextRunTime`. The task only runs
  while the user is logged in (no service account required).
- **Stale lock.** `.work-queue\.lock` is removed if older than 8 minutes.
  Otherwise the run is skipped to prevent overlap.
- **Phantom git lock from WSL.** This worker runs natively on Windows and never
  touches WSL — that's the whole point. If you see `.git/index.lock` lying
  around, delete it manually before the next run; `.gitignore` already lists
  it defensively.

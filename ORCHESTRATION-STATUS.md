# ORCHESTRATION-STATUS.md

## Phase Status
- Phase 0: done (2026-04-25)
- Phase 1: done (2026-04-25)
- Phase 2: in-progress — dry-run partial (3 items file-edited, build/commit/deploy blocked); 109 pending
- Phase 3: pending (350 items projected)
- Phase 4: pending (1 known case: id 21 merge into id 17)
- Phase 5: pending

## Phase 2 dry-run summary (2026-04-25)
- Items processed: 3 (id 7, 9, 17 — top V26 priority).
- Edits applied to src/PALSearch.jsx: chapter keyword tails added to all 3; `tabs` field added to id 9.
- Build status: BLOCKED — `npx vite build` fails because Linux WSL mount returns a truncated cached view (1645 lines) of the file even though the actual file on Windows is 1686 lines and contains the full edits (verified via Read tool).
- Commit status: BLOCKED — `.git/index.lock`, `HEAD.lock`, `index.lock.old`, `HEAD.lock.old` all present, and the WSL mount returns "Operation not permitted" on `rm`/`unlink` for any file under `.git/`. The `mcp__cowork__allow_cowork_file_delete` permission was denied when requested. (Pre-existing HEAD.lock from before this session — implies a prior crashed git operation.)
- Deploy status: not attempted — depends on a successful build.
- Outcome: file edits are persisted on the Windows filesystem and will be picked up on the next worker run (which, if scheduled to run from a Windows-native shell rather than the WSL sandbox, should not hit the same mount-cache or lock issues).

## Last batch run
- 2026-04-25T08:55Z — dry_run by setup-agent — processed=3, file-edits=3, deploys=0, failed=0
- Pending: 109, Done: 3, Failed: 0
- Last commit: (none — git blocked)
- Last deploy: (not attempted)

## Defaults adopted (Ivan didn't answer Plan v2 open questions; logged here)
1. Phase 4 escalation: URL-only one-line OK; content drift >20% full diff
2. Phase 5 file split: split policy data into `src/data/policies.js` if `PALSearch.jsx` >2,500 lines
3. New entry `popular`: false unless PAL marks featured
4. Commit cadence: one commit per merged batch
5. Phase 3 coverage: include all 350 missing; low-value entries flagged for per-item ask

## HRWeb decision: A. Include (137 entries), per Ivan 2026-04-25

## Sub-Agent Tally
- Inventory Agent: 1 (done)
- Diff Agent: 1 (done)
- Setup Agent: 1 (in progress)
- Worker Agents: 0 dispatched
- Phase 3 / Cleanup / QA: pending

## In-Flight
(none)

## Cumulative Counters
- PAL fetches: ~30 (Phase 1)
- Commits: 6 (52245e3, 47fb6bd, 34e5f42, b3cdd3b, 31f9d93, ac88ee0, f4a1a84)
- Token estimate: Opus ~250K, Sonnet ~50K (Phase 0 + 1)

## Escalations
- Phase 2 setup ESCALATION: Linux WSL sandbox cannot run git/npm/vite operations cleanly against the D:\ mount. Two distinct mount issues observed:
  1. `.git/*.lock` files cannot be deleted (`rm`, `unlink`, `mv`, `truncate -s 0` all fail with "Operation not permitted") even though Linux user owns them and has 0700 perms. Permission tool `allow_cowork_file_delete` was denied. This blocks every git operation.
  2. After the file-tools (Read/Write/Edit, which are Windows-side) modify a file, the Linux mount continues to return a stale, truncated view (170504 bytes / 1645 lines) instead of the actual on-disk content (1686 lines). `sync` does not refresh. This means npm/vite running in the Linux sandbox will read the wrong file content and fail to build.
- Recommendation: register the scheduled task as a Windows-native cron/Task Scheduler invocation that runs in PowerShell with the project root as cwd, so npm/vite/git all execute via Windows binaries against the native filesystem (no WSL bridge in the loop). Before the first run, the user should manually delete the four stale lock files: `D:\Software\Productivity\refined PAL Search\.git\index.lock`, `index.lock.old`, `HEAD.lock`, `HEAD.lock.old`.

## Last Update
2026-04-25 (during Phase 2 setup)

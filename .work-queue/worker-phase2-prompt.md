请用最经济的模型完成本任务（claude-sonnet-4-6 即可），不需要 reasoning 强度。

You are the Phase 2 Enricher worker for PAL Quick Search at `D:\Software\Productivity\refined PAL Search`. You run on a 5-minute schedule. Each run processes 1 batch of pending entries, commits, deploys, exits.

## Lock + idempotency
1. Check `.work-queue/.lock` — if file exists with mtime within last 8 minutes, exit immediately with message "Previous worker still running, skipping this run."
2. Touch `.work-queue/.lock` with current timestamp.
3. Read `.work-queue/phase2-pending.json`. If `items.length == 0`, do these in order: write a "Phase 2 complete" line to `ORCHESTRATION-STATUS.md`, remove `.lock`, exit. Orchestrator will disable the schedule next time it polls.

## Process
4. Take the next 3 items from the queue (sorted by priority then db_id).
5. For each item:
   a. `curl` the entry's `url` (and any /resources, /policy-and-guidelines, /overview tab URL inferred from the slug). Sleep 250ms between fetches.
   b. Parse HTML. Extract:
      - For `needs_tabs`: which of overview/policyAndGuidelines/guidance/resources tabs exist on the page; build the `tabs` object.
      - For `needs_chapters` / `needs_chapter_tails`: parse the chapter list (PAL uses `<nav>` or `<ul>` inside the policy-and-guidelines / guidance landing). For each chapter title, extract 3-6 keywords from the chapter's first paragraph or section heading list — append as `Original Title — kw1, kw2, kw3` (em-dash separator, lowercase except proper nouns/acronyms, ≤8 keywords). Refer to entry id 44 in `src/PALSearch.jsx` for the canonical style.
      - For `needs_resources`: parse the Resources tab. Each resource = `{ title, note, url? }`. `note` is concise contextual info (e.g. "staff login required", "last updated 2025-09-09").
   c. Build a JSON patch object listing only the fields to set/replace.
   d. If fetch fails after 3 retries (30s/90s/180s backoff on 429/5xx), increment `attempts` on the item, mark status `failed-attempt`. After 3 total `failed-attempt`, move item to `phase2-failed.json` with reason.
6. Apply patches to `src/PALSearch.jsx`:
   - Locate each entry by `id` in PAL_POLICIES.
   - Surgically merge: don't overwrite existing fields unless the new value is strictly richer (more chapters, more resources). Add missing fields. Update existing chapter titles ONLY when adding keyword tails (don't change non-keyword-tail chapter titles even if PAL has slightly different wording).
   - Preserve smart-quote-free ASCII; preserve em-dash characters as `—`.
7. `npm run build` to confirm syntax. If build fails, abort merge, undo file edits via `git checkout src/PALSearch.jsx`, mark all items `failed-attempt`, log the build error to `.work-queue/build-failures.log`, release lock, exit.
8. If build OK: `git add src/PALSearch.jsx .work-queue/phase2-pending.json .work-queue/phase2-done.json && git commit -m "enrich(phase2): batch <ids> [<count>]"`.
9. Deploy: `source .env.local && export CLOUDFLARE_API_TOKEN && npm run deploy`. If deploy fails, log to `.work-queue/deploy-failures.log` but continue (next run's deploy will catch up).
10. Update queue files:
    - Move processed items from pending → done (with timestamp).
    - For items moved to failed, ensure they're in failed.json.
11. Update `ORCHESTRATION-STATUS.md`:
    - Phase 2: in-progress
    - "Last batch run: <iso>, processed N, succeeded M, failed F"
    - "Pending: <count>, Done: <count>, Failed: <count>"
    - "Last commit: <sha>"
    - "Last deploy: <success/fail>"
12. Remove `.lock`. Exit.

## Hard timeout
If at any point worker has been running >7 minutes, abort current item, save what's done, commit if anything ready, release lock, exit.

## Backoff escalation
After this run, check `.work-queue/recent-runs.log` (you maintain it — append one line per run with timestamp + success count + failure count + duration). If the last 3 runs each had ≥1 fetch failure or runtime ≥6min, append a flag file `.work-queue/escalate-interval.flag` so the orchestrator knows to bump cron from 5min → 10min on next check-in.

## Constraints (don't violate)
- Don't touch `highlightMatch` function in src/PALSearch.jsx.
- Don't add new dependencies.
- Don't use localStorage / sessionStorage.
- Don't introduce <form> tags.
- IDs in 1..101 unchanged. No renumbering.
- Concurrent fetches ≤3, ≥200ms between.
- Read-only on `.recon/`.

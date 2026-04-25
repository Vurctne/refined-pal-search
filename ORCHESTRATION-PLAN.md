# ORCHESTRATION-PLAN.md

PAL Quick Search Deep-Index Project — Plan v1
Orchestrator: Claude Opus 4.7 (1M context)
Sub-agents: Claude Sonnet 4.6 (prompt-level fallback; Cowork Task tool does not enforce model selection)
Drafted: 2026-04-25

---

## 0. Baseline (from Phase 0 recon)

- File: `src/PALSearch.jsx` — 1,684 lines, single-file React component
- `PAL_POLICIES.length` = **112**
- 14 categories. Distribution: Students 23 / Finance 20 / HR-Leave 11 / HR-Conduct 10 / HR-Recruitment 9 / OHS 7 / Curriculum 6 / HR-Pay 6 / IT&Privacy 5 / School Operations 5 / Child Safety 3 / HR-Performance 3 / Infrastructure 2 / School Council 2.
- Deep-index coverage gaps: `tabs` 36%, `chapters` 23%, `resources` 39%, `popular` 21%. Universal: id, title, summary, category, tags, url.
- `highlightMatch` uses `indexOf` (regex-free) — constraint stands.
- id 44 confirmed as keyword-tail reference (`'Personal expenses — meals, accommodation, incidentals, 24km radius, ATO rates'`).
- No `HANDOFF-V26.md`, no `CHANGELOG`, no test-query file. Test queries must be authored as part of this plan.
- PAL site (`https://www2.education.vic.gov.au/pal/`) HTTP 200, served via Cloudflare/Lagoon, `cache-control: public, max-age=900` — fetch-friendly.
- Git on `main`, clean. 5 commits to date.

---

## 1. Sub-Agent Roles

All sub-agents receive a prompt header: `请用最经济的模型完成本任务（claude-sonnet-4-6 即可），不需要 reasoning 强度。` Cowork's Task tool does not let the orchestrator pin a sub-agent to a specific model; Sonnet 4.6 is requested-not-enforced. Orchestrator monitors actual cost/latency and escalates if Sonnet drift is suspected.

| Role | Scope | Allowed | Forbidden |
|---|---|---|---|
| **Inventory Agent** | Phase 1 only. One run. | Crawl PAL landing + category nav pages, produce `pal-full-inventory.json`. | Do not edit any project file. Do not fetch individual policy pages. |
| **Enricher Agent** | Phase 2. Multiple parallel instances. | Fetch all tabs/chapters/resources for assigned existing IDs; emit JSON patches + per-batch report. | Cannot create new entries, cannot delete entries, cannot rename categories, cannot touch `highlightMatch`. |
| **New Entry Agent** | Phase 3. Multiple parallel instances. | Create new entries with id 102.1, 102.2, ... small-decimal continuation; full schema; populate from PAL fetch. | Cannot edit existing entries, cannot reuse existing ids, cannot pick categories outside our 14. |
| **Cleanup Agent** | Phase 4. One run, sequential. | For Removed-from-PAL list: redirect URL update, merge into another entry (add old title to tags as alias), or delete with changelog reason. | Each removal/merge must include a `_decision_reason` field for orchestrator review before merge. |
| **QA Agent** | Phase 5. One run. | Run mechanical checks (test queries, URL spot-check, schema validation, id uniqueness). | No code changes. No data edits. Read-only audit. |

---

## 2. Phase Schedule

| Phase | Goal | Checkpoint to Ivan | Estimated wall-clock |
|---|---|---|---|
| **0** | Baseline + this plan | **Plan approval** | done |
| **1** | PAL inventory + diff report | **pal-diff-report.md review** | 15-30 min |
| **2** | Enrich existing 112 entries | per-batch silent merge (orch reviews); summary at end | 90-180 min |
| **3** | Add missing entries from diff | per-batch silent merge; **category ambiguity escalations** | 60-120 min |
| **4** | Handle removed entries | **every delete/merge approved by Ivan** | 15-30 min |
| **5** | QA + final read-through | **final approval + go/no-go** | 30-60 min |

Total estimate: 3.5-7 hours of orchestration + sub-agent wall time. Sub-agents run in parallel where allowed.

---

## 3. Batch Strategy

- **Phase 2 (enrichment)**: split 112 entries into ~12 batches of 8-10 entries, grouped by **category** (so each batch shares vocabulary/structure conventions). Largest categories (Students 23, Finance 20) get split into 2 batches each. Stub entries (id 5, 68, 100, etc.) clustered into a "deep-stub" batch since they need full enrichment from scratch.
- **Phase 3 (new entries)**: batches of 5-8 entries from the diff report's "Missing from DB", grouped by their target category in our 14-category schema. Smaller batches because new-entry work is heavier (full schema construction vs. patching).
- **Phase 4 (cleanup)**: one batch, sequential. Each removal item handled with explicit decision metadata.

---

## 4. Concurrency & Rate Limits

- **Max 3 sub-agents in flight project-wide** at any moment (across all phases).
- Inside each sub-agent: ≥200ms between consecutive fetches against PAL. Use `sleep 0.25` between curls.
- 429 / 5xx response: exponential backoff (30s, then 90s, then 180s) — 3 retries — then log to `fetch-failures.log` and continue.
- Hard cap per sub-agent: 60 fetches per batch. If a batch needs more, split it.
- Orchestrator polls sub-agent transcripts every 30-60s; doesn't busy-poll.

---

## 5. Model Allocation

| Role | Requested model | Reasoning |
|---|---|---|
| Orchestrator (me) | Opus 4.7, 1M context | Cross-batch consistency review needs full data in context; quality judgment on keyword tails. |
| All sub-agents | Sonnet 4.6 (prompt-level request) | Single-batch scope is well-bounded; cost-sensitive given expected 15-25 sub-agent runs. |
| Escalation: if a Sonnet sub-agent fails ≥3 times on the same task | Opus 4.7 retry once | Logged in `ORCHESTRATION-STATUS.md` with reason. Cumulative escalations >5 → halt + Ivan check-in. |

---

## 6. Quality Acceptance

**Per-batch (Enricher / New Entry):**
- Schema valid: required fields present, types correct, no smart quotes, em-dashes preserved.
- Keyword tails: ≥2 keywords per chapter title, ≤8; lowercase except proper nouns/acronyms; em-dash separator; no marketing speak.
- All URLs in resources are well-formed; ≥80% return HTTP 200 on spot-check (orchestrator picks 2 random URLs per batch).
- Tags: lowercase, no duplicates within an entry, summary is 1-2 sentences.

**Cross-batch (orchestrator, end of Phase 2 and Phase 3):**
- Keyword-tail length distribution doesn't deviate >2σ between batches (spot-check by reading reports back-to-back).
- No category drift (e.g. Enricher Agent didn't accidentally re-categorize an entry).
- No id collisions; ids within `1..101` unchanged, new ids strictly above.

**Final (orchestrator + QA Agent, Phase 5):**
- All 9 baseline test queries (§8) return correct top-1.
- ≥30 additional queries covering new data return sensible results.
- Random 10% URL sample: ≥90% HTTP 200 within 5 seconds.
- File still builds clean: `npm run build` succeeds.

---

## 7. Failure & Retry

- **Sub-agent reports failure on item**: orchestrator re-routes item to next-available agent (max 2 retries on a different agent before escalation).
- **Sub-agent crashes / non-responsive >5 min after expected idle**: orchestrator kills task, re-queues batch.
- **Fetch-failures.log**: persistent across phases, one source of truth for skipped URLs. Re-attempted in Phase 5 once before final report.
- **PAL serves >10 consecutive 429s**: orchestrator pauses all sub-agents for 5 min; resumes at half concurrency (max 1 parallel).
- **Token budget alarm** (Opus side): if orchestrator review overhead spikes >20% over plan, halt and report.

---

## 8. Test Queries (Initial 9 — Baseline)

These cover the existing 112-entry dataset. Phase 5 adds ≥30 more for new entries.

1. `long service leave` → top-1 = id 7
2. `anaphylaxis` → top-1 = id 64
3. `duty of care` → top-1 = id 62
4. `personal expenses` → top-1 = id 44 (validates keyword-tail chapter match)
5. `child safe standards` → top-1 = id 75
6. `gift test` → top-1 = id 45 (resource-level match dominates)
7. `wwcc` → id 21 in top-3
8. `edupay ess` → id 6 or id 7 in top-3 (resource-level match)
9. `ministerial order 1359` → id 21 and id 75 both in top-5

Stored in `TEST-QUERIES.md` (created in Phase 5).

---

## 9. Output Artifacts (final state)

- `src/PALSearch.jsx` (or split: `src/data/policies.js` + `src/PALSearch.jsx` if size >2,500 lines after enrichment — orchestrator decides at Phase 5)
- `CHANGELOG-FULL-INDEX.md`
- `TEST-QUERIES-FULL.md` (≥39 queries)
- `fetch-failures.log` (final, hopefully tiny)
- `ORCHESTRATION-STATUS.md` (final state)
- `ORCHESTRATION-SUMMARY.md` — final report: entry count, deep-index coverage %, per-phase wall time, total sub-agent count, Opus vs Sonnet token estimate

---

## 10. Status Tracking

`ORCHESTRATION-STATUS.md` schema (orchestrator updates after each significant action; sub-agents do not write to it):

```
## Phase Status
- Phase 0: done | in-progress | pending — [date]
- Phase 1: ...
- Phase 5: ...

## Sub-Agent Tally
- Inventory Agent: 1 (done | failed)
- Enricher Agents: dispatched X / completed Y / failed Z
- New Entry Agents: ...
- Cleanup Agent: ...
- QA Agent: ...

## In-Flight
- [session_id] [role] [batch] [started_at]

## Cumulative Counters
- PAL fetches (estimated): N
- Commits: M
- Token estimate: Opus ~A, Sonnet ~B

## Escalations to Opus
- [date] [reason] [resolution]

## Last Update
- [iso timestamp]
```

---

## 11. Open Questions for Ivan

1. **Phase 4 escalation level.** Plan says "every delete/merge approved by Ivan." For a removed PAL policy that just renames (URL change only, content identical), is a one-line approval enough or do you want full diff? Default: one-line approval unless content drift >20%.

2. **Phase 5 file split decision.** If `PALSearch.jsx` exceeds 2,500 lines after enrichment, orchestrator may split policy data into `src/data/policies.js`. Confirm: ok to make this structural change, or keep monolithic?

3. **`popular` flag policy for new entries.** Plan default: `false` for all new entries unless an Enricher Agent has strong evidence (e.g. PAL marks it as featured). Confirm.

4. **Commit cadence.** Plan: one commit per batch merged (Phase 2/3), one final cleanup commit (Phase 4), one QA commit (Phase 5). Want fewer (squash per phase) or more (per entry)?

Default to my judgment if you don't answer — I'll log the assumption in `ORCHESTRATION-STATUS.md`.

---

## Appendix A: Constraints (verbatim from spec, propagated to all sub-agent prompts)

1. Don't change `highlightMatch` (uses `indexOf`, not regex).
2. No new dependencies — React + Tailwind core + lucide-react only.
3. No `localStorage` / `sessionStorage`.
4. No `<form>` tags.
5. New ids decimal continuation (102.1, 102.2, ...). Don't renumber existing.
6. Every URL must be fetched and verified (200 within 5s).
7. Style: em-dash separator, lowercase tags, summary 1-2 sentences.
8. Project-wide concurrent fetches ≤3, ≥200ms between.
9. 429/5xx → 30s→90s→180s backoff, 3 retries, then log + skip.
10. Sub-agents stay within their phase scope. No cross-phase work.
11. Sub-agents requested at Sonnet 4.6 level (prompt-level fallback only).

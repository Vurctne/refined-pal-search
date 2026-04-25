# ORCHESTRATION-PLAN.md

PAL Quick Search Deep-Index Project — Plan v2 (aligned with V26 handoff)
Orchestrator: Claude Opus 4.7 (1M context)
Sub-agents: Claude Sonnet 4.6 (prompt-level fallback; Cowork Task tool does not enforce model selection)
Drafted: 2026-04-25 — v2 supersedes v1 (which was drafted before V26 handoff was located)

---

## 0. Baseline (from Phase 0 recon + V26 handoff)

### From recon (current state of `D:\Software\Productivity\refined PAL Search`)
- File: `src/PALSearch.jsx` — 1,684 lines, single-file React component
- `PAL_POLICIES.length` = **112**
- 14 distinct `category` strings used in data. (V26 handoff says "15 categories"; the discrepancy is taxonomy-level: handoff counts an implicit `HR` parent + 5 HR subsets, our data uses the 5 subsets directly. We treat **14** as the operational schema.)
- Distribution: Students 23 / Finance 20 / HR-Leave 11 / HR-Conduct 10 / HR-Recruitment 9 / OHS 7 / Curriculum 6 / HR-Pay 6 / IT&Privacy 5 / School Operations 5 / Child Safety 3 / HR-Performance 3 / Infrastructure 2 / School Council 2.
- Deep-index coverage: `tabs` 36% / `chapters` 23% / `resources` 39% / `popular` 21%. Universal: id, title, summary, category, tags, url.
- Decimal IDs already used: 3.5, 41.5, 41.6, 41.7, 41.8, 53.5, 54.5, 55.5, 55.6, 62.5, 76.5.
- `highlightMatch` uses `indexOf` — V17 historical fix; **must not be reverted to regex** (broke parser repeatedly V1-V15).
- id 44 confirmed as keyword-tail prototype.

### From V26 handoff
- Render target: previously claude.ai artifact (Tailwind core + lucide-react only). Now Vite + React + Tailwind on Cloudflare Pages — **Priority 3 #4 from V26 handoff is already done**.
- V26 added travel-insurance/VMIA tags across ids 37, 43, 44, 86 (already in our data).
- V26's priority work this project picks up: Priority 1 #2 (systematic chapter-title enrichment) and Priority 2 #3 (coverage gaps).
- Keyboard shortcuts (`/`, Esc, arrows, Enter) functional but UI-silent — preserved.
- No `<form>` tags. No `localStorage`/`sessionStorage`. No new deps.

---

## 1. Sub-Agent Roles

All sub-agents receive prompt header: `请用最经济的模型完成本任务（claude-sonnet-4-6 即可），不需要 reasoning 强度。`

Cowork Task tool does not let orchestrator pin model — Sonnet 4.6 is request-not-enforce. Orchestrator monitors for cost/latency drift.

| Role | Scope | Allowed | Forbidden |
|---|---|---|---|
| **Inventory Agent** | Phase 1 only. One run. | Crawl PAL landing + category nav, produce `pal-full-inventory.json` (title/url/category/last_updated). | Edit project files. Fetch individual policy pages. |
| **Enricher Agent** | Phase 2. Multiple parallel. | Fetch tabs/chapters/resources for assigned existing IDs; emit JSON patches + per-batch report. | Create new entries, delete entries, rename categories, touch `highlightMatch`. |
| **New Entry Agent** | Phase 3. Multiple parallel. | Create entries id 102.1, 102.2, ... small-decimal continuation; full schema; populated from PAL fetch. | Edit existing entries, reuse existing ids, pick categories outside our 14. |
| **Cleanup Agent** | Phase 4. Sequential. | URL update / merge / delete on Removed-from-PAL list, with `_decision_reason` per item for orch review. | Touch entries not in the removed list. |
| **QA Agent** | Phase 5. One run. | Mechanical checks (V26 9 tests + ≥30 new, URL spot-check, schema validation, id uniqueness, keyboard-behaviour static check). | Code or data changes. |

---

## 2. Phase Schedule

| Phase | Goal | Checkpoint | Estimate |
|---|---|---|---|
| **0** | Baseline + this plan | **Plan approval** | done |
| **1** | PAL inventory + diff report | **pal-diff-report.md review** | 15-30 min |
| **2** | Enrich existing 112 entries (chapter keyword tails + missing tabs/resources) | per-batch silent merge; cross-batch consistency at end | 90-180 min |
| **3** | Add missing entries from diff + coverage gaps from V26 list | per-batch merge; **category ambiguity escalations** | 60-120 min |
| **4** | Handle removed entries | **per-item Ivan approval** (one-line OK if URL-only rename, full diff if content drift >20%) | 15-30 min |
| **5** | QA + final read-through | **final go/no-go** | 30-60 min |

Total: 3.5-7 hr wall-clock.

---

## 3. Batch Strategy

### Phase 2: enrichment of 112 existing entries
- ~12 batches × 8-10 entries, grouped by **category** for vocabulary cohesion.
- Largest categories split: **Students** 23 → 2 batches (engagement+behaviour / health+wellbeing+disability), **Finance** 20 → 2 batches (manual+procurement / parent payments+misc).
- **Priority candidates per V26 handoff** (chapter keyword tail enrichment) — front-loaded into early batches: **ids 7, 9, 17, 27, 37, 45, 48, 56, 59, 64, 73, 77, 80, 85, 86, 91**.
- Stub-only entries (no tabs/chapters/resources at all): cluster into a "deep-stub" batch — they need full enrichment from scratch.

### Phase 3: new entries
- **Coverage gaps from V26 handoff** + Phase 1 diff:
  - Digital Learning in Schools
  - Out-of-Home Care (LOOKOUT, schools support)
  - Koorie Education specifics (KESO, cultural inclusion, Voice to Parliament)
  - VCE / VCAL / VPC specifics
  - Student Wellbeing Action Plan
  - Respectful Relationships (program)
  - Camps and Catering (separate from Excursions)
  - First Aid (standalone — currently merged into id 83 OHS)
  - Visitors in Schools
  - Volunteers in Schools
- Plus whatever Phase 1 inventory surfaces beyond these.
- Batches: 5-8 per batch, grouped by target category.

### Phase 4
- Single batch, sequential. Each item = one decision (update/merge/delete) + reason.

---

## 4. Concurrency & Rate Limits

- **Project-wide ≤3 sub-agents in flight** at any moment.
- Per-agent: ≥200ms between PAL fetches (`sleep 0.25` between curls).
- 429/5xx: backoff 30s → 90s → 180s, 3 retries, then `fetch-failures.log` and continue.
- Hard cap 60 fetches per sub-agent batch.
- Orchestrator polls every 30-60s; no busy-poll.

---

## 5. Model Allocation

| Role | Requested | Reasoning |
|---|---|---|
| Orchestrator | Opus 4.7, 1M ctx | Cross-batch consistency review needs full data + all reports in context. |
| All sub-agents | Sonnet 4.6 (prompt-level) | Single-batch scope; cost-sensitive at expected 15-25 sub-agent runs. |
| Escalation | Opus 4.7 retry once | If Sonnet fails ≥3× on the same item. Logged in `ORCHESTRATION-STATUS.md`. >5 cumulative escalations → halt + Ivan check-in. |

---

## 6. Quality Acceptance

### Per-batch (Enricher / New Entry)
- Schema valid: required fields present + correct types; no smart quotes; em-dashes preserved.
- Keyword tails: ≥2 keywords per chapter title, ≤8; lowercase except proper nouns/acronyms; em-dash separator; no marketing speak.
- URLs in resources well-formed; ≥80% return HTTP 200 on spot-check (orchestrator picks 2 random URLs/batch).
- Tags: lowercase, no intra-entry dupes, summary 1-2 sentences.

### Cross-batch (orchestrator, end of Phases 2 and 3)
- Keyword-tail length distribution doesn't deviate >2σ between batches.
- No category drift (Enricher didn't accidentally re-categorize).
- No id collisions; ids ≤101 unchanged, new ids strictly above.

### Final (orchestrator + QA Agent, Phase 5)
- All 9 V26 baseline tests pass (§8).
- ≥30 additional queries covering new data return sensible results.
- Random 10% URL sample: ≥90% HTTP 200 within 5s.
- `npm run build` succeeds.
- `highlightMatch` unchanged from current implementation.

---

## 7. Failure & Retry

- Sub-agent reports failure on item: re-route to next agent (max 2 retries on different agent before escalation).
- Sub-agent crash / non-responsive >5min after expected idle: kill task, re-queue batch.
- `fetch-failures.log` persists across phases. Re-attempted once in Phase 5.
- PAL serves >10 consecutive 429s: orchestrator pauses all sub-agents 5 min, resumes at concurrency 1.
- Token budget alarm (Opus side): >20% over plan → halt + report.

---

## 8. Test Queries — V26 Canonical Baseline (9)

**These are the V26 handoff's actual regression tests. Phase 5 must pass all 9 plus add ≥30 more.**

1. `long service leave` → id 7, popular, **top result**
2. `hire or rehire` → deep-match into Recruitment (id 17) resource, shows **"📄 Resource:" banner**
3. `cat:finance gift` → Gifts, Benefits and Hospitality (id 45)
4. `annaphalaxis` (typo) → Anaphylaxis (id 64) via **Levenshtein**
5. `travel insurance` → Finance Manual (id 37) strongest, Travel (43), Travel and Personal Expenses (44), Excursions (86) all in top results
6. `24km meals accommodation` → id 44 with **"Chapter: Personal expenses — meals, accommodation..." banner** (V26 regression test for keyword-tail effectiveness)
7. **Empty query** → popular policies shown in "Frequently accessed" grid
8. **Esc from focused input** → clears query
9. **`/` from anywhere else** → focuses input

Tests 7-9 are UI-behaviour assertions, not data queries — QA Agent runs them via static code inspection (the keyboard-handler block in PALSearch.jsx must remain intact) plus a build smoke test.

Stored in `TEST-QUERIES.md` — created Phase 5.

---

## 9. Output Artifacts (final state)

- `src/PALSearch.jsx` (or split: `src/data/policies.js` + `src/PALSearch.jsx` if size >2,500 lines after enrichment — orchestrator decides at Phase 5)
- `CHANGELOG-FULL-INDEX.md`
- `TEST-QUERIES-FULL.md` (≥39 queries: 9 V26 + ≥30 new)
- `fetch-failures.log` (final, hopefully tiny)
- `ORCHESTRATION-STATUS.md` (final state)
- `ORCHESTRATION-SUMMARY.md` — final report: entry count, deep-index coverage %, per-phase wall time, sub-agent count, Opus vs Sonnet token estimate
- `CLAUDE.md` — V26 Priority 4 #9: documents data shape, scoring weights, regex-bug history, contribution rules

---

## 10. Status Tracking

`ORCHESTRATION-STATUS.md` schema (orchestrator-only writes):

```
## Phase Status
- Phase 0..5: pending|in-progress|done — [date]

## Sub-Agent Tally
- Inventory / Enricher / New Entry / Cleanup / QA: dispatched/completed/failed counts

## In-Flight
- [session_id] [role] [batch] [started_at]

## Cumulative Counters
- PAL fetches (estimated): N
- Commits: M
- Token estimate: Opus ~A, Sonnet ~B

## Escalations to Opus / Ivan
- [date] [reason] [resolution]

## Last Update — [iso timestamp]
```

---

## 11. Open Questions for Ivan

1. **Phase 4 escalation level.** Default: one-line approval if URL-only rename / content drift <20%; full diff otherwise.
2. **Phase 5 file split.** Default: split policy data into `src/data/policies.js` if `PALSearch.jsx` >2,500 lines.
3. **`popular` flag for new entries.** Default: `false` unless PAL marks featured or evidence of high-traffic.
4. **Commit cadence.** Default: one commit per merged batch.
5. **Coverage scope confirmation.** V26 lists 10 specific gaps — should Phase 3 stop there, or go beyond if Phase 1 inventory finds more?
# PAL Recon Report

## Handoff docs found / missing

- `HANDOFF-V26.md` — **not found** (project root or parents).
- `HANDOFF*.md` (any version) — **none found**.
- `CHANGELOG*.md` — **none found**.
- `TEST-QUERIES*.md` — **none found**.
- Only markdown in repo: `README.md` (deployment + Cloudflare Pages notes; no version notes, schema rules, or test queries).

## Codebase data shape

- File: `src/PALSearch.jsx` (1,684 lines, ~166 KB).
- `PAL_POLICIES.length` = **112** entries.
- **14 categories** (count per category):
  - Students — 23
  - Finance — 20
  - HR - Leave — 11
  - HR - Conduct — 10
  - HR - Recruitment — 9
  - OHS — 7
  - Curriculum — 6
  - HR - Pay — 6
  - IT & Privacy — 5
  - School Operations — 5
  - Child Safety — 3
  - HR - Performance — 3
  - Infrastructure — 2
  - School Council — 2

- **Universal fields (100% of entries):** `id`, `title`, `summary`, `category`, `tags`, `url`.
- **Optional fields:**
  - `popular`: 24/112 (21%)
  - `tabs`: 40/112 (36%)
  - `chapters`: 26/112 (23%)
  - `resources`: 44/112 (39%)
- No `lastUpdated`, `audience`, `icon`, `priority`, `keywords`, or `description` fields exist.

**Sample structures:**
- **Deep (id 37):** tabs (yes), tags (31), chapters (20), resources (63) — largest entry, ~14.7 KB.
- **Mid (id 84):** tabs (yes), tags (10), chapters (4), resources (11) — ~3 KB.
- **Stub (id 5 "Overpayments"):** no tabs/chapters/resources, tags (3), only id+title+category+tags+summary+url — ~226 bytes. Other stubs: id 68, id 100.

**`highlightMatch` (lines 1150–1199):** confirmed uses `lower.indexOf(t, idx)` in a while loop — **no regex**. Case-insensitive substring matching only. Builds non-overlapping match positions, merges, returns React fragments wrapping matches in `<mark>`. Constraint: any future tokenizer/highlighter changes must stay regex-free here.

## id 44 chapters quote

Entry id 44 = "Travel and Personal Expenses — Teaching Service" (HR - Pay-adjacent). Verbatim chapters array:

```js
chapters: [
      { title: 'Introduction', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/overview' },
      { title: 'Travel expenses — mileage, conveyance, private vehicle, public transport, work-related travel', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/travel-expenses' },
      { title: 'Personal expenses — meals, accommodation, incidentals, 24km radius, ATO rates', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/personal-expenses' },
      { title: 'Reimbursement of expenses — claims, receipts, advances', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/reimbursement-expenses' },
      { title: 'Relocation expenses — household removal, comprehensive insurance, re-establishment allowance', url: 'https://www2.education.vic.gov.au/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/relocation-expenses' }
    ]
```

Keyword-tail style confirmed: `Topic — kw1, kw2, kw3, specific number/term, ATO rates`.

## Test queries

No test query file found. No `TEST-QUERIES*`, no test runner, no hard-coded test cases in `src/` (no `__tests__`, no `*.test.*`, no `vitest`/`jest` config in package.json scripts).

## Git state

Branch: `main`. Working tree clean (`nothing to commit, working tree clean`).

Last 10 commits (only 5 exist):
```
31f9d93 chore: add npm run deploy script
b3cdd3b chore: configure for Cloudflare Pages deployment
34e5f42 feat: import full PAL_POLICIES dataset (~101 entries across 14 categories)
47fb6bd feat: import PAL search engine 3 (React + Vite + Tailwind)
52245e3 chore: scaffold project
```
Note: commit message says "~101 entries" but actual count is 112.

## PAL site reachability

- `HEAD https://www2.education.vic.gov.au/pal/` → **HTTP/2 200**, `content-type: text/html`, `content-length: 431127`, served via Cloudflare/QuantWAF + Lagoon (amazeeio). `cache-control: public, max-age=900`. Strict-transport-security set, `x-frame-options: SAMEORIGIN`. Reachable.
- Body grep matches: `policy` (×2), `category` (×3) in first 5 hits — landing page contains category/policy structure as expected. No further pages fetched.

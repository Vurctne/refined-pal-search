Handoff: PAL Quick Search — V26
Project overview
PAL Quick Search — an unofficial staff-side search tool for the Victorian Department of Education's Policy and Advisory Library (PAL). Single-file React component, client-side only, no backend.
Current state (V26)

File: single React component (~1,000+ lines)
Render target: Claude artifact runtime (application/vnd.ant.react) — Tailwind core utilities + lucide-react icons only
Status: functional, clean render, no known bugs

What it does

Searches ~100 indexed PAL policies across 15 categories (HR subsets, Finance, Students, OHS, Child Safety, School Council, School Operations, Infrastructure, IT & Privacy, Curriculum)
Deep-indexes each policy's sub-structure: chapters[], resources[], and tabs{} — so a search for "hire or rehire" surfaces the matching resource inside the Recruitment policy, not just the top-level policy
Scoring: multi-token matching with weights — title ×4, tags ×2.5, resources ×2, chapters ×1.8, summary ×1.5, category ×1. Typo tolerance via Levenshtein distance
Query syntax: plain tokens, "quoted phrases" for exact matches, cat:finance for category filter
Auto-expands result cards when the match came from deep substructure; shows match banners ("📄 Resource: ..." / "📖 Chapter: ...")
Tracks recent searches and recently-opened policies in component state (no persistence)
Category filter pills (horizontal scroll), popular policies grid, search suggestions chips
Keyboard: / focuses search, Esc clears and blurs, arrow keys navigate results, Enter opens (shortcuts functional but no longer shown in the UI)

Data shape
js{
  id: number,                    // unique; decimals (3.5, 41.5, 54.5, etc.) used to insert without renumbering
  title: string,
  category: string,              // must match one of CATEGORIES
  tags: string[],
  summary: string,
  url: string,                   // primary link to PAL — use /overview if /policy doesn't exist
  popular?: boolean,             // shows ⭐ and appears in "Frequently accessed"
  tabs?: {                       // top nav tabs for the PAL page
    overview?: string,
    policyAndGuidelines?: string,
    guidance?: string,
    resources?: string
  },
  chapters?: [{ title, url }],   // subsections within Policy/Guidance
  resources?: [{ title, note, url? }]  // forms, templates, contacts
}
V26 changelog (since V17 handoff)

V18: Fixed keyboard shortcuts (/ and Esc) with capture-phase listeners on both window and document, plus direct onKeyDown handler on the input for reliable Esc behaviour when focus is inside the input.
V20: Removed the / to search · Esc to clear hint text from the header (shortcuts still work, just no longer advertised).
V21–V22: Travel insurance data gap — added travel insurance, vmia, victorian managed insurance authority tags across Finance Manual (id 37), Travel (id 43), Travel and Personal Expenses (id 44), and Excursions (id 86). Added a dedicated "Section 21 — Insurance Arrangements" resource entry under Finance Manual. Expanded the insurance contact note to mention travel insurance and VMIA claims.
V24: Fixed broken URL — id 44 (Travel and Personal Expenses) changed from non-existent /policy path to working /overview path.
V26: Enriched chapter titles in id 44 with keyword tails so searches land on the semantically correct chapter. E.g. "Personal expenses" → "Personal expenses — meals, accommodation, incidentals, 24km radius, ATO rates". Previously, searches for "24km" or "meals" would wrongly surface the "Travel expenses" chapter because its title contained the token "travel" which appeared in the query context.

Architecture notes

All state is in-memory — no localStorage/sessionStorage (forbidden in artifact runtime)
Regex-free highlighter — the highlightMatch function uses indexOf-based position tracking, NOT regex character classes. Do not "simplify" it back to regex; previous attempts broke the parser repeatedly (see "Historical bug" below)
Em-dashes (—) are used heavily in titles and notes to match official PAL style
Decimal IDs (3.5, 41.5, 54.5, 55.5, 55.6, 62.5, 76.5) were inserted later without renumbering the array — preserve this pattern when adding new entries
Keyboard shortcuts are live but silent — functional but no longer shown in UI

Historical bug (keep documented)
V1–V15 hit repeated parser errors from a corrupted regex string inside highlightMatch. The regex /[.*+?^${}()|[\]\\]/g combined with '\\$&' replacement confused the artifact's Babel parser, particularly when adjacent to a chunk of accidentally-pasted policy data. V17 fixed this by replacing the regex-based approach with indexOf position-merging. Any future refactor must preserve this approach.
Known limitations

No persistence: recent searches and recently-clicked lists reset on page reload
selectedIndex keyboard highlight doesn't auto-scroll into view
Some PAL URLs may still be wrong — one broken URL (id 44) has been fixed but no systematic validation has run; others likely exist
Chapter titles across the dataset are often too terse to match real user queries — V26 fixed one entry (id 44) but this pattern affects many other policies
Mobile: category filter row scrolls horizontally; no dropdown fallback
Data coverage: ~100 policies; full PAL has more. Known gaps include Digital Learning in Schools, Out-of-Home Care, Koorie Education specifics, VCE/VCAL-only policies

Likely next tasks for Claude Code
Priority 1 — Data integrity

URL validator script — crawl all url fields across policies, chapters, and resources. Flag 404s and redirects. PAL uses inconsistent URL patterns (/policy, /overview, /policy-and-guidelines) so standardisation needs to be per-entry, not blanket-replaced. At least one broken URL (id 44, now fixed) proves this is needed.
Systematic chapter-title enrichment — V26 demonstrated that chapter titles from PAL are often terse labels ("Introduction", "Approvals", "Personal expenses") that don't match the vocabulary users actually search with. Apply the same pattern used in id 44 across all entries: append a — keyword tail describing what's actually in the chapter. Approach:

For each policy with chapters[], fetch the chapter page
Extract 3–6 keywords from the first paragraph or key content
Append as title: 'Original Title — keyword1, keyword2, keyword3'
Preserve the original URL
Good candidates to start with: ids 7, 9, 17, 27, 37, 45, 48, 56, 59, 64, 73, 77, 80, 85, 86, 91 (all have chapter arrays)



Priority 2 — Coverage
3. Expand data coverage — fill known gaps: Digital Learning in Schools, Out-of-Home Care, Koorie Education, VCE/VCAL specifics, Student Wellbeing Action Plan, Respectful Relationships, Camps and Catering, First Aid standalone, Visitors in Schools, Volunteers in Schools
Priority 3 — Migration and polish
4. Migrate out of artifact — scaffold as Vite + React + Tailwind, add localStorage persistence for recent searches / clicks, proper routing, deploy as internal tool
5. Tune fuzzy search — per-field Levenshtein thresholds (stricter on titles, looser on resource notes). Consider lowering weight of pure title-token matches for chapters when the query tokens also appear in the summary (V26 suggests a scoring issue, not just a data issue, underlies the chapter-title problem).
6. Auto-scroll selectedIndex into view when using arrow keys
7. Mobile polish — category dropdown on narrow viewports
8. Report-broken-link button that opens a prefilled mailto
Priority 4 — Governance
9. CLAUDE.md to drop into the repo once scaffolded — documents data shape, scoring logic, the historical regex bug, and contribution rules (especially: don't reintroduce regex-based term escaping in the highlighter)
10. Data source note — the dataset was built from PAL scraping + manual curation. Document the source-of-truth workflow so updates are reproducible when PAL changes.
Environment constraints to preserve

Pure React + Tailwind core + lucide-react only (if staying in artifact)
No external data fetches
All logic in one file for artifact portability
No <form> elements (artifact restriction)
No browser storage APIs inside the artifact

Test queries to verify on any change

"long service leave" → id 7, popular, top result
hire or rehire → should deep-match into Recruitment (id 17) resource, show "📄 Resource:" banner
cat:finance gift → Gifts, Benefits and Hospitality (id 45)
annaphalaxis (typo) → Anaphylaxis (id 64) via Levenshtein
travel insurance → Finance Manual (strongest), Travel, Travel and Personal Expenses, Excursions
24km meals accommodation → should surface id 44 with "Chapter: Personal expenses — meals, accommodation..." banner (V26 regression test)
Empty query → popular policies shown in "Frequently accessed" grid
Esc from focused input → clears query
/ from anywhere else → focuses input
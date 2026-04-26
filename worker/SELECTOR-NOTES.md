# PAL Chapter Selector Notes

PAL (`www2.education.vic.gov.au/pal/...`) is a Drupal/Nuxt SSR site rendered
with the Ripple component library (`rpl-*`, `det-*` class prefixes). Chapter
information lives in **two distinct shapes** depending on whether the policy
is a multi-page publication or a single page.

## Pattern A — Multi-page publication (e.g. id 44, Travel & Personal Expenses)

Chapters are sub-pages listed inside a **dedicated chapter `<ul>`** that is
clearly marked with both `data-depth="1"` and the modifier class
`det-publication-menu__child`. The `<ul>` opens with a sentinel
`<span class="det-chapters-title">Chapters</span>`, then each chapter is an
`<a class="...det-publication-menu__item-link">` whose href is a sub-path of
the policy (NOT a `#` anchor).

Selector / regex:

```
<ul ... data-depth="1" ... class="...det-publication-menu det-publication-menu__child..." ...>
   <li><span class="det-chapters-title">Chapters</span></li>
   <li><a href="/pal/<slug>/policy-and-guidelines/<chapter>"
          class="...det-publication-menu__item-link...">
       <span class="rpl-link__inner"> Chapter title </span>
     </a></li>
   ...
</ul>
```

Example fragment (from `/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines`):

```html
<ul data-depth="1" class="det-publication-menu det-publication-menu__child" ...>
  <li><span class="det-chapters-title">Chapters</span></li>
  <li><a href="/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/overview"
         class="rpl-link rpl-link--nuxt det-publication-menu__item-link" ...>
       <span class="rpl-link__inner">Introduction</span></a></li>
  <li><a href="/pal/travel-and-personal-expenses-teaching-service/policy-and-guidelines/personal-expenses"
         class="rpl-link rpl-link--nuxt det-publication-menu__item-link" ...>
       <span class="rpl-link__inner">Personal expenses</span></a></li>
  ... (8 chapters total) ...
</ul>
```

## Pattern B — Single-page policy (e.g. id 7, Long Service Leave)

The policy body is one page. Chapters are the `<h2>` and `<h3>` headings
inside `<div class="rpl-markup__inner">`. Each heading has an `id` (used as
in-page anchor target). For the V26 baseline format, we keep the chapter
`url` equal to the page URL (no `#fragment`).

Selector / regex:

```
<div class="rpl-markup__inner"> ... <h3 id="<anchor>">Chapter title</h3> ... </div>
```

Example fragment (from `/pal/long-service-leave-teaching-service/policy-and-guidelines`):

```html
<div class="rpl-markup__inner">
  <h2 id="policy-and-guidelines-for-long-service-leave">Policy and Guidelines for Long Service Leave</h2>
  <h3 id="entitlement">Entitlement</h3>
  <h3 id="granting-long-service-leave">Granting long service leave</h3>
  <h3 id="commuting-long-service-leave-to-salary">Commuting long service leave to salary</h3>
  <h3 id="school-vacations-and-public-holidays-during-long-service-leave">School vacations and public holidays during long service leave</h3>
  <h3 id="illness-or-injury-during-long-service-leave">Illness or injury during long service leave</h3>
</div>
```

## What to ignore (sources of garbage in the v0 scraper)

- **Skip-to-main-content link** — `<a href="#rpl-main">Skip to main content</a>`
  sits in the page header. The v0 scraper picked this up first, so 70% of
  enriched entries got chapters like `Skip to main content — menu, return, ...`.
- **Tab nav** — `<ul data-depth="0" class="det-publication-menu">` whose items
  are `Overview / Policy and Guidelines / Resources`. These are top-level
  sections, NOT chapters. Filter by requiring `data-depth="1"` AND
  `det-publication-menu__child`.
- **Breadcrumbs** — `<nav aria-label="breadcrumbs">`. Skip.
- **Site header / footer / search** — `rpl-site-header`, `rpl-site-footer`,
  `rpl-search-form`. Skip.
- **"Chapters" sentinel `<span>`** — has class `det-chapters-title` and lives
  in the chapter `<ul>` itself but is not an `<a>`. Naturally skipped because
  we only match anchors, but worth flagging.
- **Related-content sidebars** — `rpl-card`, `rpl-document-link` lists at the
  bottom of policy pages. Not chapters.
- **Title length guard** — drop labels `< 4` chars to avoid stray `›`/`>` etc.
- **Defensive substring filter** — drop label if it contains (case-insensitive)
  any of: `skip to`, `main content`, `menu`, `navigation`, `search`, `footer`,
  `header`, `breadcrumb`.
- **No empty fallback** — if the dedicated chapter list is missing AND the
  page has no `rpl-markup__inner` headings, return `chapters: @()` rather
  than fall through to "any anchor on the page".

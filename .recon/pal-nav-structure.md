# PAL Navigation Structure

PAL (Policy and Advisory Library) at https://www2.education.vic.gov.au/pal/ is a Nuxt.js (Vue) frontend backed by a Drupal CMS with a JSON:API. The primary machine-readable interface is `/api/v1/node/publication?site=5`, which returns all published policy publications with their PAL category taxonomy terms in paginated 50-item pages.

The frontend renders an A-Z topic listing via `/filter-az` with query-string filters (e.g., `filters[title_az][type]=prefix&filters[title_az][values]=A`), but this route was in maintenance mode at crawl time. Individual policy topic pages are accessible at `/pal/<slug>` and redirect to the first sub-page (typically `/policy`).

## Crawl Strategy

Single crawl source: `GET https://www2.education.vic.gov.au/api/v1/node/publication?site=5`
- Paginated at 50 items per page
- Include: `field_pal_category` taxonomy term (returns category names)
- Fields: `title, path, changed, field_pal_category`
- Total pages: 10

## Crawl Targets

- Page 1: offset=0, fetched 50 items
- Page 2: offset=50, fetched 50 items
- Page 3: offset=100, fetched 50 items
- Page 4: offset=150, fetched 50 items
- Page 5: offset=200, fetched 50 items
- Page 6: offset=250, fetched 50 items
- Page 7: offset=300, fetched 50 items
- Page 8: offset=350, fetched 50 items
- Page 9: offset=400, fetched 50 items
- Page 10: offset=450, fetched 3 items

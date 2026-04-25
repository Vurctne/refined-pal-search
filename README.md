# Refined PAL Search

Refined version of the PAL Search Engine (v3).

## Status

Full PAL_POLICIES dataset imported (112 entries across 14 categories). Built with Vite + React + Tailwind. Configured for Cloudflare Pages deployment.

## Structure

```
refined PAL Search/
├── index.html              # Vite HTML entry, mounts <div id="root">
├── package.json            # npm scripts and dependencies
├── vite.config.js          # Vite + @vitejs/plugin-react
├── tailwind.config.js      # Tailwind content globs
├── postcss.config.js       # Tailwind + autoprefixer
├── public/
│   └── _redirects          # SPA fallback for Cloudflare Pages
├── .gitignore
├── README.md
└── src/
    ├── main.jsx            # React entry, renders <PALSearch /> into #root
    ├── index.css           # @tailwind base/components/utilities
    └── PALSearch.jsx       # Full PAL search component
```

## Deployment

### Local development

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server (default: http://localhost:5173)
```

### Production build

```bash
npm run build      # outputs static assets to dist/
npm run preview    # preview the production build locally
```

### Cloudflare Pages (auto-deploy)

The repo is wired up to Cloudflare Pages. Pushing to `main` triggers an automatic build and deploy. Production URL: **https://pal.schooltool.com.au**.

Build settings (already configured in the CF Pages dashboard, listed here for reference):

| Setting                  | Value           |
| ------------------------ | --------------- |
| Framework preset         | `Vite`          |
| Build command            | `npm run build` |
| Build output directory   | `dist`          |
| Root directory           | *(blank)*       |
| Node version (env var)   | `NODE_VERSION=20` |

The `public/_redirects` file ships `/*  /index.html  200` so any path served by Pages falls back to the SPA — future-proofs us for client-side routing.

### First-time setup

If you're setting this up from scratch (e.g. on a new account or after a repo migration):

1. **Create the GitHub repo** and push this codebase to `main`.
2. **Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.** Select the GitHub repo and branch `main`.
3. **Build settings:** enter the values from the table above. Add `NODE_VERSION=20` under *Environment variables → Production* (and *Preview*, if you want preview deploys to use Node 20 too).
4. **Save and Deploy.** First build runs immediately; subsequent pushes to `main` trigger automatic deploys.
5. **Custom domain:** Pages project → *Custom domains → Set up a custom domain* → enter `pal.schooltool.com.au`. If `schooltool.com.au` is on Cloudflare, the CNAME is added automatically; otherwise add a CNAME record at your DNS provider pointing `pal` to the `*.pages.dev` URL Cloudflare gives you.

# Refined PAL Search

Refined version of the PAL Search Engine (v3).

## Status

Imported and building — Vite + React + Tailwind scaffold in place. Awaiting full ~1100-line PAL search component source (currently a stub).

## Structure

```
refined PAL Search/
├── index.html              # Vite HTML entry, mounts <div id="root">
├── package.json            # npm scripts and dependencies
├── vite.config.js          # Vite + @vitejs/plugin-react
├── tailwind.config.js      # Tailwind content globs
├── postcss.config.js       # Tailwind + autoprefixer
├── .gitignore
├── README.md
└── src/
    ├── main.jsx            # React entry, renders <PALSearch /> into #root
    ├── index.css           # @tailwind base/components/utilities
    └── PALSearch.jsx       # PAL search component (stub — full source pending)
```

## Setup

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server (default: http://localhost:5173)
npm run build      # production build to dist/
npm run preview    # preview the production build
```

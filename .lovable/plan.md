## Problem

The preview loads at `/portfolio/` and shows a 404 — the whole site looks blank. Console confirms: `404 Error: User attempted to access non-existent route: /portfolio/`.

Cause: `vite.config.ts` sets `base: '/portfolio/'` (for GitHub Pages deploy), so all assets and the preview URL are served under `/portfolio/`. But `BrowserRouter` in `src/App.tsx` has no `basename`, so when the browser is at `/portfolio/`, React Router looks for a route literally matching `/portfolio/` — none exists, so the catch-all `*` renders `NotFound`.

## Fix

Pass `basename={import.meta.env.BASE_URL}` to `BrowserRouter` in `src/App.tsx`. This automatically uses `/portfolio` in production/preview (matching `vite.config.ts`) and `/` in environments where base is root, so no route definitions need to change.

## Verification

After the change, reload `/portfolio/` — the Home page (`Index`) should render instead of NotFound, and internal `<Link to="/work">` etc. will correctly navigate to `/portfolio/work`.

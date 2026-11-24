# Project Architecture Rules

- Gate live-cursor transport and rendering off on /play, so the game keeps native pointers and receives no portfolio chat/reaction shortcuts.
- Live-cursor shape swaps (resize etc.) are detected via `data-cursor` attributes read in LiveCursors' pointermove, because live cursors hide the system cursor and must borrow its shapes themselves.

- Chat follow-up questions travel as a trailing suggestions JSON marker in the existing text stream; hide metadata during rendering and fall back safely to keep the current transport compatible.
- Keep the chosen inline typing dots within AI Elements Message/MessageContent; the installed Shimmer uses incompatible theme variables and offers no dot variant, so this loading-only exception preserves accessible status and reduced motion.

- Coordinate independent floating controls through window events, including the footer character/custom cursor and drawing-clear/AI launcher pairs, so their layout remains decoupled.
- Game-to-portfolio navigation uses origin/source-validated messages handled by the Play page router, not window.top, because the preview can itself be embedded.
- The "Ask about my work" assistant answers from a generated snapshot of the project data (`bun ./scripts/build-portfolio-context.ts`), so re-run it and redeploy the function whenever project content changes — the edge function cannot import app source.
- The home page is the portfolio canvas (`src/components/canvas`): each case is a section with a Case notes frame and stageshow pieces; there are no case-study pages, and `/work` and `/project/:slug` redirect to `/#<slug>`.
- Keep project facts in projectsData and featuredProjects; the canvas sections in `canvasFrames.tsx` curate from them, so update both when a case changes.
- Share portrait and footer-character phrases through one local-state quote hook and an anchored bubble component, so both work independently of live cursors.
- Reuse the game-logo asset pointer in React and its exact served URL in static game HTML, so game loading and title display one asset without duplicate binaries.
- Nav and theme-toggle active pills are measured or CSS-positioned locally, never shared framer `layoutId`s, because duplicated/remounted instances made them fly or vanish.
- Gate the HUD restart wrapper by completion state, not viewport; let actions wrap and anchor confirmation below so restart remains reachable without overflowing narrow screens.
- Stageshow pieces live in src/components/stage/pieces and are shown on the home canvas; try new ones on the unlinked /lab/pieces page first, and film each with `--gate` (notes in REHEARSAL.md).

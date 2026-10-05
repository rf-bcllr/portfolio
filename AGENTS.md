# Project Architecture Rules

- Coordinate independent floating controls through window events, including the footer character/custom cursor and drawing-clear/AI launcher pairs, so their layout remains decoupled.
- Game-to-portfolio navigation uses origin/source-validated messages handled by the Play page router, not window.top, because the preview can itself be embedded.
- The "Ask about my work" assistant answers from a generated snapshot of the project data (`bun ./scripts/build-portfolio-context.ts`), so re-run it and redeploy the function whenever project content changes — the edge function cannot import app source.
- Keep Work project facts in projectsData and presentation metadata in featuredProjects; a playable project may replace its outcome block with a Play CTA without changing other cards.
- Resolve Home folder thumbnails from featuredProjects media items by slug and slide index, so the folder reuses the same media as Work without duplicating asset references.

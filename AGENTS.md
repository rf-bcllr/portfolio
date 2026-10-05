# Project Architecture Rules

- Coordinate independent floating controls through window events, including the footer character/custom cursor and drawing-clear/AI launcher pairs, so their layout remains decoupled.
- The "Ask about my work" assistant answers from a generated snapshot of the project data (`bun ./scripts/build-portfolio-context.ts`), so re-run it and redeploy the function whenever project content changes — the edge function cannot import app source.
- Keep Work project facts in projectsData and presentation metadata in featuredProjects; a playable project may replace its outcome block with a Play CTA without changing other cards.

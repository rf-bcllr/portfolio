# Project Architecture Rules

- Coordinate the footer character and custom cursor through a window event, so the decorative pointer remains independent of page layout.- The "Ask about my work" assistant answers from a generated snapshot of the project data (`bun ./scripts/build-portfolio-context.ts`), so re-run it and redeploy the function whenever project content changes — the edge function cannot import app source.

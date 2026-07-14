## Goal
Replace the vertical scroll list of project cards on `/work` with a stacked-card navigator inspired by the 21st.dev "AnimatedCardStack" pattern. The `WorkProjectCard` visuals and content stay exactly as they are — only the navigation and layout around them changes.

## Behavior
- Show the featured projects as a stack of 3 visible layers (front card + two peeking behind it), rest hidden.
- Front card is fully readable and interactive (media carousel inside it keeps working).
- Controls to advance: a "Next" button, plus click-on-back-card and keyboard Left/Right arrows.
- On "Next": front card animates down/out, back cards scale/translate up one slot, a new card enters from the back. Loops through `featuredProjects`.
- Optional "Previous" affordance mirrors the animation.
- A small indicator (e.g. `03 / 08`) and dots showing position in the list.
- Reduced motion: respect `prefers-reduced-motion` — swap animation for a simple crossfade.

## Structure
```text
Work page
└── ProjectCardStack (new)
    ├── stack viewport (relative, fixed height)
    │   ├── layer 0 (front)  → <WorkProjectCard project={...} />
    │   ├── layer 1 (peek)   → <WorkProjectCard ... /> (scale .96, y -16, dim)
    │   └── layer 2 (peek)   → <WorkProjectCard ... /> (scale .92, y -32, more dim)
    ├── counter + dots
    └── prev / next buttons
```

## Technical notes
- New file: `src/components/ProjectCardStack.tsx`. Uses `framer-motion` (already in the project via `AnimatedSection`) with `AnimatePresence` + `motion.div` wrappers around existing `WorkProjectCard`. No edits to `WorkProjectCard` itself.
- Edit `src/pages/Work.tsx` to render `<ProjectCardStack projects={featuredProjects} />` in place of the current `.map`.
- Stack height: use a fixed min-height container matching the tallest card (e.g. `min-h-[720px] lg:min-h-[640px]`) so layers can stack absolutely without layout shift.
- Peek layers use `pointer-events-none` and `aria-hidden` so only the front card is interactive.
- State: `activeIndex` cycles modulo `projects.length`; `direction` (+1 / -1) drives enter/exit variants.
- Keep the existing card's per-card rotation intact; just wrap in the animated positioner.

## Out of scope
- No changes to `WorkProjectCard` visuals, media carousel, colors, badges, or content.
- No changes to `/` (Index) or other pages.
- No new dependencies.

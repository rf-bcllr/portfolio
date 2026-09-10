# Activate the two remaining skills and run a full portfolio review

## Goal

Bring back the two review guides that were removed earlier (accessibility and interface), turn them on alongside the four already active, then use all six to produce a prioritised list of concrete improvements for the portfolio.

## Step 1 — Add the missing guides

The four guides currently active are: UI, typography, colors, layout. The accessibility and interface guides were deleted, so they get fetched again from the same public source and prepared for activation. Activation shows an approval card for each one — approve both when they appear.

## Step 2 — Review the whole portfolio against all six guides

Pages and pieces to review:

- Home, Work, Project detail, Resume, Certifications, Experience, 404
- Header/menu, theme switch, project slider, cursor + background drawing, cards, footer

Each guide gets applied as a separate focused pass so findings stay clean rather than blending together:

| Pass | What it looks at |
| --- | --- |
| Accessibility | Missing image descriptions, unlabeled icon-only buttons, keyboard navigation, contrast, heading order, single main landmark, tap target sizes |
| Interface | Feedback on interactions, empty/loading states, motion restraint, focus states, hover affordances |
| UI | Card and component consistency across pages |
| Typography | Scale, weights, line length, tracking consistency |
| Colors | Token usage, no hardcoded colors, accent discipline, both themes |
| Layout | Spacing rhythm, grid alignment, mobile and tablet behaviour |

Checks run against the live preview on both a phone and a desktop size, and in both light and dark, so findings are based on what actually renders — not just the code.

## Step 3 — Deliver the findings

You get one report grouped by severity:

- **Critical** — things that block someone from using the site (e.g. a button a screen reader can't name)
- **Warning** — things that make the experience worse but still usable
- **Polish** — refinements

Each item names where it is, what's wrong, and why it matters. Nothing gets changed in this step.

## Step 4 — Fix, with your approval

After you read the report, you pick what to fix. Default suggestion: fix all critical items first, then decide on the rest. No visual redesign happens without you asking for it — the review will very likely suggest changes to the look, and those stay proposals.

## Technical notes

- Skill drafts are staged under `.agents/skills/<name>` and activated via the skill apply tool; `.workspace/skills/` is regenerated per message and never edited directly.
- Review passes use Playwright against `http://localhost:8080` at 393x804 and 1440x900, capturing screenshots plus console output.
- Read-only for steps 2 and 3; no source files change until step 4.

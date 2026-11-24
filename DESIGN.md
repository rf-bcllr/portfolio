# DESIGN.md: rfbcllr portfolio design guide

Status: **direction not chosen yet.** Sections 1–3 are research. Section 4 holds the rules every page follows, whichever direction wins. Section 5 is the token sheet for each of the three candidate directions. Once one is picked, delete the other two sheets, and section 5 becomes the system.

Mockups: `/lab/directions` (unlinked; `?d=a`, `?d=b`, `?d=c`). Screenshots: `docs/design-research/`.

---

## 1. Research: ten product-designer portfolios

All captured on 23 Nov 2026 at 1440×900, first screen only.

| # | Site | Layout | Type | Colour | Spacing | What to take |
|---|---|---|---|---|---|---|
| 1 | [rauno.me](https://rauno.me) · `p01-rauno.jpg` | The site is a horizontal row of labelled artboards on a grey canvas, with a scrubber at the top. The first artboard holds the intro. | Neo-grotesk at about 56px. The lines are staggered, alternating flush-left and indented, so a sentence reads as a shape. | Light grey canvas, white artboards, black text, one huge pure-yellow disc overlapping the type. | Very wide grey gutters around each artboard. Inside the artboard, the type sits tight to the left edge. | The site *is* a design file: artboards, labels, a canvas. Don't take the yellow disc, which is his signature. |
| 2 | [ryo.lu](https://ryo.lu) · `p10-ryo.jpg` | One sentence fills the first screen. Below it sit two columns of links, then language switches. | About 88px grotesk for the sentence, with a thick grey underline under the live words. Everything else is small mono caps with letter-spacing. | White, black, grey underlines. No accent. | The sentence starts about 120px from the top. Meta rows run on a tight 16px rhythm. | A sentence as the hero, linked words as navigation, mono caps for metadata. |
| 3 | [benji.org](https://benji.org) · `p04-benji.jpg` | A single column about 520px wide: bio paragraphs, then a writing list grouped by year. | 14–15px sans throughout. Hierarchy comes only from grey vs ink. | Off-white, ink, mid-grey, one pink "New" tag. | 1px hairlines between list rows, roughly 36px rows. | Restraint. A date column on the right turns a list into an archive. |
| 4 | [jakub.kr](https://jakub.kr) · `p05-jakub.jpg` | A 520px column. The intro has inline links, inline brand icons and `⌘K` keycaps. Projects follow as rows. | 15px sans. Ink links inside grey prose. | White, ink, grey, small bordered icon tiles. | 40px rounded icon tile + title + one-line description per row, with hairlines. | The icon-tile row gives each project an identity at list size. |
| 5 | [brianlovin.com](https://brianlovin.com) · `p07-brianlovin.jpg` | Centered column: avatar, name, a bold 20px one-sentence intro, a social icon row, then Writing and Projects lists. | Name 17px semibold. The intro is a 20px grey statement. Lists are plain 16px. | White, ink, grey. | Generous: about 48px between groups. | One sentence that says the role, the city and the company. |
| 6 | [joshpuckett.me](https://joshpuckett.me) · `p06-joshpuckett.jpg` | Centered column: `@handle` heading with a short rule under it, bio paragraphs, then a Projects list. | 15px sans. Company names in ink, the rest in grey, so the names scan like a list. | White, ink, grey. | 24px paragraph gaps. A short 24px rule under headings. | Two text tones carry the hierarchy, with no bold and no colour. |
| 7 | [jasonyuan.design](https://jasonyuan.design) · `p11-jasonyuan.jpg` | Three columns at the top (name / nav / bio), then a row of large work images that blur in. | 14px sans. Linked names in a lighter grey. | Near-black ground, white text, grey links. The work images carry all the colour. | The header sits on a 3-column grid with equal gutters. Images run edge to edge in a row. | A 3-column header grid. A dark ground makes the work glow. |
| 8 | [vanschneider.com](https://vanschneider.com) · `p09-vanschneider.jpg` | Nav as three categorised columns. A huge centered statement over an engraving. | Outlined condensed caps at about 120px. Small serif-ish nav with ✣ bullets. Tiny green category labels. | Black, thin grey arch-line pattern, red logo pill, green labels. | The statement sits low and centered. The nav is compact, top-right. | Categorised nav columns. Don't take the costume: engravings and Latin. |
| 9 | [oliviatruong.com](https://www.oliviatruong.com) · `p19-olivia.jpg` | A full-bleed art-directed photograph (a miniature desk and a real hand) with the name on the left. The next section's colour block overlaps upward. | 40px book serif for the name, 11px spaced caps for the role. | Mustard photo ground, then a dusty blue block. | Name block at about 1/3 height. Lots of air. | One real, made photograph shows personality better than a sticker cloud. |
| 10 | [lynnandtonic.com](https://lynnandtonic.com) · `p17-lynn.jpg` | Centered title, then a table of contents with dotted leaders and roman numerals. A version number sits at the bottom. | Custom decorative display lettering. Small caps for the TOC. | Paper-textured beige, ink. | A narrow 220px TOC column with generous line-height. | The work as a table of contents. A yearly redesign marked with a version number. |

Also looked at: emilkowal.ski and paco.me (same single-column text pattern as Benji/Jakub), frankchimero.com (all-mono list on dark slate), adhamdannaway.com (split designer/coder portrait, dated 2010s pattern), alexwidua.com and dennissnellenberg.com (the capture caught a blank page and a loader). robinnoguier.com, marianopascual.me and marianacastilho.com would not render headless.

**What the strong ones share**
- One ground, one ink, at most one accent. On image-led sites the work supplies the colour.
- A grotesk at 500–700 with negative tracking for display, plus either the same face small or a mono for metadata. No ornamental third face.
- The first screen says *who + what* in one sentence. Nobody uses a "Hi! I'm" headline alone.
- Lists beat card grids on personal sites. Where cards appear, the image is the card.
- Hairlines (1px, 10–15% ink) separate rows. No drop shadows, no thick borders.

## 2. Research: the eleven references

| Site | Layout | Type | Colour | Spacing | Take / avoid |
|---|---|---|---|---|---|
| [jiro.build](https://jiro.build) · `r01` | Promo marquee, a centered hero over a dimmed collage of templates, category tabs, a 4-column card grid. | Large white grotesk with a tilted red price badge. | Near-black, red promo, **violet** logo and sign-up. | Hero padded about 80px. Cards on a 24px gutter. | Take: a dimmed collage of real work behind a hero. Avoid: violet, glow, sale shouting. |
| [header.design](https://header.design) · `r02` | Left-aligned hero headline, a 3D ticket and pretzel objects on the right, filter tabs, a card row. | Heavy extended black caps, the second line in an orange-to-red fade. | Cream `#F5F1EA`, black, orange. | Headline block about 40% width. Faint 40px grid behind. | Take: warm cream, one tactile object. Avoid: the gradient-text line. |
| [recent.design](https://recent.design) · `r03` | A 140px left rail (nav, sponsor, sign-up), a 3-column masonry of mixed black and white cards, a right "Design jobs" column. | Small 13–14px sans everywhere. The content is the type. | White, ink, black cards, author avatars. | 8px card radius, 16px gaps, dense. | **Basis of direction B.** The rail holds the person, the feed holds the work. |
| [landdding.com](https://landdding.com) · `r04` | Search-first header, an intro panel with a stats strip, a 4-column grid of site screenshots with author + upvote. | 32px sans headline, grey second half. | Light grey `#F4F4F2`, white cards, ink. | 24px panel padding. | Take: the author row under each shot. Avoid: the stats strip (a stat-card row). |
| [fontinlogo.com](https://fontinlogo.com) · `r05` | Left hero, a pair of pill CTAs, avatar proof, then a poster carousel. | 56px grotesk. The headline's last phrase is set in grey, not in another face. | White, ink, grey. | Headline at 8% from the left, 64px between sections. | Take: two-tone headline (ink then grey), which is what direction A's subline does. |
| [backgrounds.supply](https://backgrounds.supply) · `r06` | A centered hero over a magenta aurora with a glossy app icon. | Sans headline with **one italic serif word**. | Magenta/purple gradient, white. | Centered stack. | Avoid all of it: it is three of the banned patterns at once. |
| [uxpilot.ai/motion](https://uxpilot.ai/motion) · `r07` | Centered caps headline, a prompt box, suggestion chips, a logo row. | Huge condensed caps; the last line in **violet**. | Pale grey-green, ink, violet. | Tight stacked headline. | Take: suggestion chips under an input (relevant to "Ask about my work"). Avoid: violet line. |
| [horizonx.so](https://horizonx.so) · `r08` | Centered 40px headline, **one product object** as the hero picture, a black pill CTA beside a plain text link. | Bold grotesk, tight. | White, ink. The object carries the colour. | Lots of air. The object is about 25% of the width. | Take: one real object instead of a collage; primary + quiet secondary action. |
| [inspora.design](https://inspora.design) · `r09` | Top nav center, square-ish grey filter chips, a 4-column masonry of product UI shots. | Small UI sans. | White, light grey chips, black/white shots. | 12px gaps, 12px radius. | Confirms direction B: a masonry of real UI reads as "designer". |
| [motionin.design](https://motionin.design) · `r10` | 64px left headline, the **categories as a 20px text list on the right**, segmented All/Free/Paid, cards on `#F2F2F2` with 24px radius. | Neo-grotesk 64px, tight. | White, grey cards, ink. | Big 24px radius cards with 40px inner padding. | Take: categories as plain large text links instead of chips. |
| [bencho.dev](https://bencho.dev) · `r11` | Centered headline, halftone dot ornaments, a logo row, interaction-verb chips (Hover, Press, Drag…), grey cards. | 40px semibold grotesk. | White, ink, grey dots. | Centered, about 80px air. | Take: verb chips as filters. Halftone dots are a nice quiet texture. |

## 3. The current site, audited

Screens: `c01-home.jpg`, `c02-work.jpg`. These are findings only; nothing has been changed.

| Severity | Finding | Where |
|---|---|---|
| HIGH | The first screen says the name, not the job or the result. "Hi! My name is Rafael Bacellar" plus a sticker cloud. The role sits in 10px caps inside the card. | `src/components/hero/HeroSection.tsx:30`, `ResizableTitle.tsx:8` |
| HIGH | /work shows one project at a time in a stacked carousel, so a recruiter can't see the nine cases or compare them. | `src/pages/Work.tsx`, `ProjectCardStack.tsx` |
| MEDIUM | Too many systems at once: a neo-brutal offset shadow, a dashed outline, rotated stickers, a dot-grid background, a pill nav with a shadow, a floating "Ask" button with a shadow, a 3D folder. Each is fine; together nothing leads. | `hero/*`, `SiteNav.tsx`, `AnimatedBackground.tsx` |
| MEDIUM | Metadata is set as 9–10px bold caps with 0.2–0.3em tracking, which is below a readable size and repeated everywhere (chips, labels, buttons). | `HeroSection.tsx:52-61`, `Index.tsx:43` |
| MEDIUM | The Home "At a glance" section is three icon cards with generic claims ("Systems thinker", "Fast iterations"), while the measured results (4.8★, 12k+, $8.5k/month) sit two clicks deep. | `src/pages/Index.tsx:49-73` |
| MEDIUM | The fixed "Ask about my work" button overlaps the right edge of footers and last rows at every width. | `src/components/AskPortfolio.tsx` |
| LOW | Outcome copy mixes styles and decimal marks: "+ $8,5k" vs "4.8★"; caps highlights ("PROMPT ENGINEERING") next to sentence case. | `src/data/featuredProjects.ts:212-221` |

Not reviewed: full accessibility pass, reduced-motion behaviour of the live hero, dark mode. These will be checked on the build.

---

## 4. Rules every page follows

These hold for A, B or C.

### Content
- The first screen answers **who, what, proof** in one sentence and one line of facts: "Rafa designs school and AI products in Brazil. Lately: Meu Arco went from 2.9 to 4.8 stars…". No greeting-only headline.
- Every project shows **one measured result** when one exists (4.8★, 12k+, 92%, $8.5k/month). Without one, write "In progress" in muted ink. Never write "TBD".
- One decimal style (point), one currency style (`$8.5k`), sentence case everywhere. Caps only in mono metadata.
- Project facts live in `projectsData`, presentation in `featuredProjects` (AGENTS.md). Display names that differ from data titles (Cheguei, Saúde e Ponto) go in one map, not inline.
- Contact is LinkedIn until an email is published. Buttons are a verb plus an object ("Talk to Rafa", "Open the case study", "Start the game").

### Layout
- One container: `max-width: 1240px`, side padding 24px (mobile) and 40px (≥768). Left and right content edges are equal on every section.
- Grid: 12 columns, 24px gutter. A list row uses fixed columns for number, year and result, so the result column lines up down the page.
- One idea per section. A section is 1–2 screens tall at 1440×900, and its heading is the first thing in it.
- The work is visible from the first screen: the index starts within one scroll (A), the feed is the page (B), or the frames sit on the canvas (C).
- No carousels for primary content. Filters are fine.

### Type
- **Never Inter.** Never a serif headline with one italic word. Never gradient text.
- Two families at most: one grotesk (display and body) and one mono (metadata). Weights 400/500/600, plus 700–800 only for display in C.
- Scale (px): 12 mono meta · 14 UI · 16/17 body · 20–30 lead · 32–56 h2 · 44–104 h1 (`clamp`). Line-height 1.45 for body, 0.95–1.05 for display.
- Tracking: display −0.035 to −0.045em, body 0, mono caps +0.06 to +0.08em. Nothing under 12px. No bold caps below 13px.
- `text-wrap: balance` on headings, `pretty` on paragraphs, `tabular-nums` on years and results.

### Colour
- One ground, one ink, one muted ink, one hairline, **one** accent. The project media is the only other colour.
- **No purple or violet** in the page's own design, and no purple gradients. Third-party logos keep their colours.
- The accent marks interaction (links, selection, the one primary button) and availability, never decoration.
- Text contrast ≥ 4.5:1 on its ground. Muted ink must pass on the paper ground (A’s `#5F5C55` on `#F1EFE9` is 5.8:1; C’s muted was darkened to `#5E5D58` to pass on its canvas).

### Spacing
- 4px base. Steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Section padding 96px (desktop) and 64px (mobile). List rows 20px vertical. Card inner padding 6px around media, 12px around text.
- Hairlines, not boxes, separate rows. No container more than two boxes deep.

### Media
- Real project media only: the `featuredProjects` media items, with video when it exists. No stock, no mood images.
- Video: `muted loop playsInline`, poster first. It rests on the poster under `prefers-reduced-motion`.
- Lovable-hosted assets (`/__l5e/...`) only resolve on the deployed site. Components fall back to the next media item, then to a titled tile, never a broken image.
- No captions under images. The title and result sit in the row or card, not under the picture.
- Phone screens are shown as phones (9:18.2) and web screens as 16:10. No rotation in the final system.

### Motion
- The hero enters once (opacity and 8–12px rise, 500ms, `cubic-bezier(0.25,0.46,0.45,0.94)`).
- Hover: linked cards lift 2px, media zooms to 1.02 inside its frame, row titles shift 6px, underlines draw left to right (300–500ms). Press: scale 0.98.
- Nothing fades in on scroll, no parallax, no scroll-jacking. One designed "moment" per page at most (A: the pointer preview; C: frame selection).
- Everything rests under `prefers-reduced-motion`, and nothing stays hidden.

### Components
- Buttons: one primary (solid ink, or accent in C), one secondary (text link with an arrow). No glow, no gradient, no offset shadow.
- Chips: pill, 36px tall, a hairline border, a count in mono. Pressed = ink fill (`aria-pressed`).
- Results are set inline in the row or panel (value + label). **Never four stat cards in a row.**
- The global floating "Ask about my work" button must not cover content. Give the last section bottom padding, or dock the button into the nav (decision pending).

### Accessibility
- Every control has a name. Focus is visible (2px outline, 4px offset). Tap targets are ≥ 44px outside running text.
- Keyboard parity: anything revealed on hover (A's preview) is also revealed on focus. C's canvas moves with ← →.
- Check 375px: no sideways scroll (the A index needed `minmax(0,1fr)` for that).

### Bans (from the brief, enforced in review)
No Inter · no purple gradients · no glowing buttons · no serif headline with one italic word · no four stat cards in a row · nothing that looks like a template. If a page could belong to anyone, redo it.

---

## 5. Direction sheets (pick one)

### A · Statement & index (ref: ryo.lu + lynnandtonic.com) · `m-a.jpg`
A sentence hero with the two best cases linked inline. A grayscale portrait in a circle with an availability tag. The work as a numbered table of contents (No. · Project · Company · Year · Result), with a preview that follows the pointer (and focus). Then experience, logos and a typographic close.

| Token | Value |
|---|---|
| Ground | `#F1EFE9` paper |
| Ink / muted | `#151514` / `#5F5C55` |
| Hairline | `rgba(21,21,20,.14)` |
| Accent | `#1D4ED8` cobalt (links, availability) |
| Display + body | Schibsted Grotesk 400/500/600 |
| Meta | IBM Plex Mono 400/500, caps, +0.08em |
| Radius | 0 on rows; full circle on the portrait; 8px on the preview |

Strongest for recruiters scanning results; the quietest of the three.

### B · Work feed (ref: recent.design) · `m-b.jpg`
A left rail holds the person (avatar, one-line bio, nav, availability, LinkedIn). The main column is a masonry feed of real media with filter chips (AI, Mobile, Design systems, Research, Games) and a result pill on every card. A right column carries experience, a colleague's quote and the game entry.

| Token | Value |
|---|---|
| Ground / rail / card | `#FFFFFF` / `#F6F6F4` / `#F6F6F4` |
| Ink / muted | `#0B0B0A` / `#6A6A66` |
| Hairline | `#E7E6E2` |
| Accent | none; `#16A34A` only for the availability dot |
| Body | Geist 400/500/600 |
| Meta | Geist Mono 400/500 |
| Radius | 16px card, 12px media, pill chips |

Most "designer-native" (it reads like the sites designers browse); the media must be strong, because it is the whole page.

### C · Canvas (ref: rauno.me) · `m-c.jpg`
The site as a design file. Layers on the left (Hello + nine frames), artboards on a dotted canvas in the middle, an inspector on the right (company, year, role, time, result, highlights, "Open the case study"). The Hello frame has a comment pin carrying a real recommendation. Zoom and ← → work. Below 1024px it becomes a vertical stack of frames, each with its result.

| Token | Value |
|---|---|
| Canvas / dots | `#E8E6E0` / `rgba(20,20,18,.13)` 1px on a 22px grid |
| Panels | `#FFFFFF`, hairline `#E4E2DC` |
| Ink / muted | `#141412` / `#5E5D58` |
| Accent | `#1F6FEB` selection blue (selection, primary button) |
| Display | Bricolage Grotesque 500/700/800 |
| UI / meta | JetBrains Mono 400/500 |
| Radius | 0 on frames, 8px on controls, comment pin 14px with one 3px corner |

Most memorable and closest to the existing Figma-comment and resize-handle motifs. It is the most work to make fully accessible and mobile-native.

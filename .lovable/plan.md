## Two small text changes

### 1. `src/pages/Resume.tsx` (line 65)
Hide the "End-to-End Product Designer" subtitle on mobile, keep it on desktop. Add `hidden md:block` to the `<p>`.

### 2. `src/pages/Index.tsx` (hero description)
Replace both the mobile and desktop hero paragraphs (currently two `<p>` variants with bold "8+/10+ years") with a single line: **"I'm your next end-to-end product designer"**. One `<p>` shared across breakpoints, keeping current typography (`text-[17px] leading-[1.75] text-muted-foreground`, `max-w-[430px]`, `mt-6`).

No other content or styling changes.

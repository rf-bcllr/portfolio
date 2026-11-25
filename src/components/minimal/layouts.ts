/**
 * Where each cover sits in each arrangement. Every layout is a pure function of the card, the
 * (fractional) position in the list and the stage, so positions can be scrubbed and blended.
 * Transforms, opacity and clip only: no card is ever resized.
 */
export type Mode = "row" | "spiral" | "stack" | "grid";
export type Pose = { x: number; y: number; z: number; ry: number; rz: number; s: number; o: number; clip: number; cap: number; veil: number };
export type StageBox = { w: number; h: number; pad: number; top: number; bottom: number; base: number; gap: number; ratios: number[] };

const CAP = 34; // the caption line under a cover

/** Row: left edge of each card, and how far the row can travel. */
export function rowTrack(b: StageBox) {
  const left: number[] = [];
  let x = 0;
  b.ratios.forEach((r) => { left.push(x); x += b.base * r + b.gap; });
  const total = x - b.gap;
  return { left, travel: Math.max(0, total - (b.w - b.pad * 2)), raw: left[left.length - 1] || 1 };
}

const at = (xs: number[], p: number) => {
  const i = Math.max(0, Math.min(xs.length - 1, Math.floor(p)));
  const j = Math.min(xs.length - 1, i + 1);
  return xs[i] + (xs[j] - xs[i]) * (p - i);
};
/** Pixels the row has moved at a position: the first card starts flush left, the last ends flush right. */
export const rowScroll = (b: StageBox, pos: number) => {
  const t = rowTrack(b);
  return (at(t.left, pos) / t.raw) * t.travel;
};

function row(b: StageBox, i: number, pos: number): Pose {
  const t = rowTrack(b);
  const w = b.base * b.ratios[i];
  return { x: -b.w / 2 + b.pad + t.left[i] + w / 2 - rowScroll(b, pos), y: (b.top + b.bottom) / 2 - CAP / 2 - b.h / 2, z: 0, ry: 0, rz: 0, s: 1, o: 1, clip: 0, cap: 1, veil: 0 };
}

function spiral(b: StageBox, i: number, pos: number): Pose {
  const d = i - pos;
  const room = b.bottom - b.top - 64;
  const narrow = b.w < 700;
  const size = Math.min(room * 0.74, 400, (b.w * (narrow ? 0.64 : 0.36)) / b.ratios[i]);
  const radius = narrow ? b.w * 0.92 : Math.min(600, b.w * 0.37);
  const a = d * 0.84; // about 48 degrees a step: seven or eight covers to a turn
  const depth = (1 - Math.cos(a)) / 2; // 0 in front, 1 at the far side
  const far = Math.max(0, Math.abs(d) - 4);
  return {
    x: Math.sin(a) * radius,
    y: (b.top + b.bottom - 64) / 2 - b.h / 2 + d * (narrow ? 46 : 58),
    z: (Math.cos(a) - 1) * radius,
    ry: ((a * 180) / Math.PI) * 0.86,
    rz: 0,
    s: size / b.base,
    o: Math.max(0, 1 - far),
    clip: 0,
    cap: 0,
    // Distance is white, not transparency: covers behind never show through each other
    veil: Math.min(0.78, depth * 0.62 + Math.max(0, Math.abs(d) - 1) * 0.09),
  };
}

const DECK = 1.3; // every card in the stack is cropped to this shape, from its foot
function stack(b: StageBox, i: number, pos: number): Pose {
  const d = i - pos;
  const room = b.bottom - b.top - 64;
  const width = Math.min(b.w - b.pad * 2, 760, (room - 96) * DECK);
  const height = width / DECK;
  const s = width / (b.base * b.ratios[i]);
  const full = width / b.ratios[i];
  const behind = Math.max(0, d);
  const gone = Math.max(0, -d);
  const k = 1 - 0.055 * behind;
  // Center of the uncropped card, so that the cropped top edge lands where the deck needs it
  const peek = 26 * (1 - Math.pow(0.86, behind)) / 0.14;
  const topEdge = b.bottom - 64 - height - peek + gone * 120;
  return {
    x: gone * (i % 2 ? 40 : -40),
    y: topEdge + (full * k) / 2 - b.h / 2,
    z: -behind * 2 + gone * 4,
    ry: 0,
    rz: gone * (i % 2 ? 5 : -5),
    s: s * k,
    o: gone > 0 ? Math.max(0, 1 - gone * 1.5) : Math.max(0, Math.min(1, 6.2 - behind)),
    clip: Math.max(0, 1 - height / full),
    cap: 0,
    veil: 0,
  };
}

/** Grid: justified rows at one height, the column count that gives the largest covers. */
function gridRows(b: StageBox) {
  const n = b.ratios.length;
  const W = b.w - b.pad * 2, H = b.bottom - b.top;
  let best = { h: -Infinity, rows: [] as number[][] };
  for (let r = 1; r <= n; r++) {
    const per = Math.ceil(n / r);
    const rows: number[][] = [];
    for (let k = 0; k < n; k += per) rows.push(Array.from({ length: Math.min(per, n - k) }, (_, j) => k + j));
    const widest = Math.max(...rows.map((x) => x.reduce((t, c) => t + b.ratios[c], 0)));
    const byW = (W - b.gap * (per - 1)) / widest;
    const byH = (H - CAP * rows.length - b.gap * (rows.length - 1)) / rows.length;
    const h = Math.min(byW, byH, b.base);
    if (h > best.h) best = { h, rows };
  }
  return best;
}
function grid(b: StageBox, i: number): Pose {
  const g = gridRows(b);
  const r = g.rows.findIndex((x) => x.includes(i));
  const line = g.rows[r];
  const block = g.rows.length * (g.h + CAP) + b.gap * (g.rows.length - 1);
  const y0 = b.top + (b.bottom - b.top - block) / 2;
  // Rows start on the page margin, like everything else
  let x = -b.w / 2 + b.pad;
  for (const c of line) { if (c === i) break; x += g.h * b.ratios[c] + b.gap; }
  return { x: x + (g.h * b.ratios[i]) / 2, y: y0 + r * (g.h + CAP + b.gap) + g.h / 2 - b.h / 2, z: 0, ry: 0, rz: 0, s: g.h / b.base, o: 1, clip: 0, cap: 1, veil: 0 };
}

export const pose = (mode: Mode, b: StageBox, i: number, pos: number): Pose =>
  mode === "row" ? row(b, i, pos) : mode === "spiral" ? spiral(b, i, pos) : mode === "stack" ? stack(b, i, pos) : grid(b, i);

export const mix = (a: Pose, b: Pose, t: number): Pose => {
  const l = (p: number, q: number) => p + (q - p) * t;
  return { x: l(a.x, b.x), y: l(a.y, b.y), z: l(a.z, b.z), ry: l(a.ry, b.ry), rz: l(a.rz, b.rz), s: l(a.s, b.s), o: l(a.o, b.o), clip: l(a.clip, b.clip), cap: l(a.cap, b.cap), veil: l(a.veil, b.veil) };
};

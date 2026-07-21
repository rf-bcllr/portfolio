import type { SVGProps } from "react";

/**
 * Stylized Shai-Hulud (Dune sandworm) — rising body curving out of dunes
 * with a ringed circular maw. Uses currentColor so it inherits from the toggle.
 */
export function DuneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* Dune horizon */}
      <path d="M2 38c5 0 7-3 12-3s7 3 12 3 7-3 12-3 6 2 8 2" opacity="0.6" />
      {/* Worm body rising and curving */}
      <path d="M6 34c2-10 8-14 14-12 4 1.5 5 6 3 9" />
      {/* Front of body / head arcing forward */}
      <path d="M23 31c-1.5 3.5 0 7 4 8.5" opacity="0.9" />
      {/* Circular maw */}
      <circle cx="30" cy="20" r="8.5" />
      {/* Inner ring */}
      <circle cx="30" cy="20" r="4" />
      {/* Maw teeth — radial spokes */}
      <g strokeWidth={1.4}>
        <path d="M30 11.5v3" />
        <path d="M30 25.5v3" />
        <path d="M21.5 20h3" />
        <path d="M35.5 20h3" />
        <path d="M24 14l2 2" />
        <path d="M34 24l2 2" />
        <path d="M36 14l-2 2" />
        <path d="M26 24l-2 2" />
      </g>
    </svg>
  );
}

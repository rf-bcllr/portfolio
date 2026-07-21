import type { SVGProps } from "react";

export function DuneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* Trefoil / triquetra petals */}
      <path d="M24 6c5 6 5 12 0 18-5-6-5-12 0-18z" />
      <path d="M9.6 33c1.4-7.6 6.4-11 13.4-11-1 7.7-5 12-13.4 11z" />
      <path d="M38.4 33c-1.4-7.6-6.4-11-13.4-11 1 7.7 5 12 13.4 11z" />
      {/* Sun core */}
      <circle cx="24" cy="26" r="4.5" />
      {/* Sun rays */}
      <g strokeWidth={1.6}>
        <path d="M24 18v2.5" />
        <path d="M24 31.5V34" />
        <path d="M16 26h2.5" />
        <path d="M29.5 26H32" />
        <path d="M18.5 20.5l1.8 1.8" />
        <path d="M27.7 29.7l1.8 1.8" />
        <path d="M29.5 20.5l-1.8 1.8" />
        <path d="M20.3 29.7l-1.8 1.8" />
      </g>
    </svg>
  );
}

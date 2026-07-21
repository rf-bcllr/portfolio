import type { LucideProps } from "lucide-react";

export function DuneIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Minimalist sunset: semi-circle sun + horizon line */}
      <path d="M4 12a8 8 0 0 1 16 0" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
}

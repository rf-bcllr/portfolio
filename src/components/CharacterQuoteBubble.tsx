export function CharacterQuoteBubble({ quote, id, placement = "above" }: { quote?: string; id: string; placement?: "above" | "portrait" }) {
  if (!quote) return null;

  return (
    <span
      id={id}
      role="status"
      className={`pointer-events-none absolute z-40 w-max whitespace-normal rounded-[18px] rounded-bl-[4px] bg-primary px-3 py-2 text-left font-sans text-[13px] font-medium leading-snug text-primary-foreground shadow-md ${placement === "portrait" ? "bottom-3 left-3 max-w-[calc(100%-24px)]" : "bottom-full left-0 mb-2 max-w-[min(260px,calc(100vw-48px))]"}`}
    >
      {quote}
    </span>
  );
}
export function CharacterQuoteBubble({ quote, id, placement = "above" }: { quote?: string; id: string; placement?: "above" | "portrait" }) {
  if (!quote) return null;

  return (
    <span
      id={id}
      role="status"
      className={`pointer-events-none absolute z-40 w-max whitespace-normal rounded-[18px] rounded-bl-[4px] bg-primary px-3 py-2 text-left font-sans text-[13px] font-medium leading-snug text-primary-foreground shadow-md ${placement === "portrait" ? "right-2 top-2 max-w-[calc(100%-16px)] sm:left-full sm:right-auto sm:top-0 sm:ml-2 sm:max-w-[min(220px,calc((100vw-340px)/2))]" : "left-full top-0 ml-2 max-w-[min(220px,calc(100vw-118px))]"}`}
    >
      {quote}
    </span>
  );
}
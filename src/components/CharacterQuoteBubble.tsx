export function CharacterQuoteBubble({ quote, id }: { quote?: string; id: string }) {
  if (!quote) return null;

  return (
    <span
      id={id}
      role="status"
      className="pointer-events-none absolute bottom-full left-0 z-40 mb-2 w-max max-w-[min(260px,calc(100vw-48px))] whitespace-normal rounded-[18px] rounded-bl-[4px] bg-primary px-3 py-2 text-left font-sans text-[13px] font-medium leading-snug text-primary-foreground shadow-md"
    >
      {quote}
    </span>
  );
}
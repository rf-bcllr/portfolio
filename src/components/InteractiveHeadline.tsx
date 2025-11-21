interface InteractiveHeadlineProps {
  text: string;
  className?: string;
  splitChars?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const InteractiveHeadline = ({
  text,
  className = "",
  splitChars = false,
  as: Component = "h2",
}: InteractiveHeadlineProps) => {
  if (!splitChars) {
    return <Component className={`headline-interactive ${className}`}>{text}</Component>;
  }

  return (
    <Component className={className}>
      {text.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="char-interactive"
          style={{
            display: char === " " ? "inline" : "inline-block",
            transitionDelay: `${index * 10}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Component>
  );
};

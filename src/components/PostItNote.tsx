interface PostItNoteProps {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
}

export const PostItNote = ({ children, rotate = -2, className = "" }: PostItNoteProps) => {
  return (
    <div
      className={`relative w-full max-w-[280px] bg-[hsl(var(--postit))] p-5 text-[hsl(var(--postit-foreground))] shadow-[8px_8px_0_0_hsl(var(--foreground)/0.18)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <p className="text-[15px] font-medium leading-[1.5]">{children}</p>
      {/* folded corner */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 right-0 size-6"
        style={{
          background: "linear-gradient(135deg, transparent 50%, hsl(var(--postit-fold)) 50%)",
        }}
      />
    </div>
  );
};

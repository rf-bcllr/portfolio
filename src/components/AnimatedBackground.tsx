export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute -right-44 -top-48 size-[520px] rounded-full bg-primary/[0.055]" />
      <div className="absolute -bottom-40 -left-36 size-[380px] rounded-full bg-primary/[0.045]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-card/70 to-transparent" />
      <div className="absolute inset-0 opacity-40 figjam-grid" />
    </div>
  );
};

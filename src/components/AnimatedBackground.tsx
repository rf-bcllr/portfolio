export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 opacity-70 figjam-grid" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-secondary/80 to-transparent" />
    </div>
  );
};

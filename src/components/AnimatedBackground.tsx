export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 opacity-75 figjam-grid" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-card/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-secondary/50 to-transparent" />
    </div>
  );
};

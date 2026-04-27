export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 figjam-grid" />
      <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-card/60 to-transparent" />
    </div>
  );
};

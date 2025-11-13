interface OrganicBackgroundProps {
  variant?: 'default' | 'hero' | 'section';
}

export const OrganicBackground = ({ variant = 'default' }: OrganicBackgroundProps) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Blobs orgânicos - simulando as "nuvens" azuis */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px] animate-floatReverse" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] animate-pulse-glow" />
      
      {variant === 'hero' && (
        <>
          <div className="absolute top-1/4 right-1/3 w-[350px] h-[350px] bg-accent/20 rounded-full blur-[90px] animate-float" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-primary/15 rounded-full blur-[100px] animate-floatReverse" />
        </>
      )}
    </div>
  );
};

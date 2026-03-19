import React from 'react';

interface GamingSectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const GamingSectionTitle = ({ title, subtitle, className = '' }: GamingSectionTitleProps) => {
  return (
    <div className={`text-center mb-6 ${className}`}>
      {/* Decorative top line */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-primary" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-primary" />
      </div>

      <h2
        className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight uppercase"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--led-cyan)), hsl(var(--primary)))',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradient-shift 6s ease infinite',
          textShadow: 'none',
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p className="text-sm md:text-base text-muted-foreground mt-1.5 tracking-wide">
          {subtitle}
        </p>
      )}

      {/* Decorative bottom line */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent via-primary/50 to-primary" />
        <div className="h-1 w-6 md:w-10 rounded-full bg-gradient-to-r from-primary to-accent" />
        <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent via-primary/50 to-primary" />
      </div>
    </div>
  );
};

export default GamingSectionTitle;

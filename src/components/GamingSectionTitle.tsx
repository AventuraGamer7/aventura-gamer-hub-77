import React from 'react';

interface GamingSectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const GamingSectionTitle = ({ title, subtitle, className = '' }: GamingSectionTitleProps) => {
  return (
    <div className={`mb-5 ${className}`}>
      <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
        <div className="flex items-baseline gap-2">
          <span className="h-4 w-1 rounded-sm bg-primary/70" aria-hidden />
          <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <span className="hidden sm:inline text-xs md:text-sm text-muted-foreground font-normal">
              · {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamingSectionTitle;

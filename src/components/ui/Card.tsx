import React from 'react';

interface CardProps {
  className?: string;
  /** @deprecated Use variant="glass" instead */
  glass?: boolean;
  variant?: 'default' | 'glass' | 'gradient' | 'highlight';
  hover?: boolean;
  children: React.ReactNode;
}

export function Card({
  className = '',
  glass = false,
  variant,
  hover = false,
  children,
}: CardProps) {
  // glass prop is kept for backward compatibility — maps to 'glass' variant
  const resolvedVariant = variant ?? (glass ? 'glass' : 'default');

  const hoverClasses = hover
    ? 'motion-safe:transition-all motion-safe:duration-200 hover:-translate-y-1 hover:border-amber-500/25 cursor-pointer'
    : '';

  if (resolvedVariant === 'gradient') {
    // Gradient border uses a wrapper approach for reliable cross-browser support
    return (
      <div className={`p-[1px] rounded-2xl bg-gradient-to-br from-amber-500 to-amber-300 ${hoverClasses} ${className}`}>
        <div className="bg-[#20232B] rounded-2xl p-6 h-full">
          {children}
        </div>
      </div>
    );
  }

  if (resolvedVariant === 'highlight') {
    return (
      <div
        className={`bg-[#20232B] border border-[rgba(245,158,11,0.16)] rounded-2xl p-6 ${hoverClasses} ${className}`}
        style={{ borderLeftColor: '#F59E0B', borderLeftWidth: '2px' }}
      >
        {children}
      </div>
    );
  }

  if (resolvedVariant === 'glass') {
    return (
      <div
        className={`backdrop-blur-sm bg-[#20232B]/80 border border-[rgba(245,158,11,0.16)] rounded-2xl p-6 ${hoverClasses} ${className}`}
      >
        {children}
      </div>
    );
  }

  // default
  return (
    <div
      className={`bg-[#20232B] border border-[rgba(245,158,11,0.16)] rounded-2xl p-6 ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}

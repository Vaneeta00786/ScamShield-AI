import React from 'react';

interface BadgeProps {
  variant: 'success' | 'danger' | 'caution' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
  danger: 'bg-red-500/15 text-red-400 border-red-500/30',
  caution: 'bg-caution/15 text-caution border-caution/30',
  info: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  neutral: 'bg-white/8 text-[#9CA3AF] border-white/10',
};

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-0.5 text-xs',
};

export function Badge({ variant, size = 'md', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center border rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

// Inner ring is slightly smaller
const innerSizeMap: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-5 h-5',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}
    >
      {/* Outer ring — amber, spins clockwise */}
      <span
        className={`absolute inset-0 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin ${sizeMap[size]}`}
      />
      {/* Inner ring — light amber, spins counter-clockwise */}
      <span
        className={`absolute rounded-full border-2 border-amber-300/20 border-b-amber-300 ${innerSizeMap[size]}`}
        style={{ animation: 'spin 0.8s linear infinite reverse' }}
      />
    </span>
  );
}

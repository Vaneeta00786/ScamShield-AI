import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  color?: 'cyan' | 'green' | 'red' | 'amber';
  animated?: boolean;
}

const colorMap: Record<NonNullable<ProgressBarProps['color']>, { bar: string; glow: string }> = {
  cyan: {
    bar: 'bg-amber-500',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
  },
  green: {
    bar: 'bg-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(52,211,153,0.5)]',
  },
  red: {
    bar: 'bg-red-400',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]',
  },
  amber: {
    bar: 'bg-caution',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
  },
};

export function ProgressBar({ value, label, color = 'cyan', animated = true }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  // Animate width from 0 → value on mount
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(clamped), 50);
    return () => clearTimeout(t);
  }, [clamped]);

  const { bar, glow } = colorMap[color];

  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted">{label}</span>
          <span className="text-xs font-semibold text-primary tabular-nums">{clamped}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="w-full h-2 bg-white/10 rounded-full overflow-hidden"
      >
        <div
          className={`h-full rounded-full ${bar} ${glow} ${
            animated ? 'motion-safe:transition-[width] motion-safe:duration-700' : ''
          }`}
          style={{ width: `${animated ? width : clamped}%` }}
        />
      </div>
    </div>
  );
}

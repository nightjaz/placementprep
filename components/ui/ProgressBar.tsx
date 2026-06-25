'use client';

interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  current,
  max,
  color = 'bg-emerald-500',
  showLabel = true,
  size = 'md',
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;

  const heights = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-zinc-800 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${color} ${heights[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-zinc-600 mt-1">
          <span>{current} / {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
}

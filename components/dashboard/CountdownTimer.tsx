'use client';

import { useCountdown } from '@/lib/hooks';

interface CountdownTimerProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { days, hours, minutes, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-emerald-400 font-medium">Placement Time</p>
        <p className="text-zinc-500 text-sm mt-1">Go get it.</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Time Left</p>
      <div className="flex justify-center gap-4">
        <div>
          <p className="text-3xl font-bold text-zinc-100">{days}</p>
          <p className="text-zinc-600 text-xs">days</p>
        </div>
        <div className="text-zinc-700 text-2xl font-light">:</div>
        <div>
          <p className="text-3xl font-bold text-zinc-100">{String(hours).padStart(2, '0')}</p>
          <p className="text-zinc-600 text-xs">hrs</p>
        </div>
        <div className="text-zinc-700 text-2xl font-light">:</div>
        <div>
          <p className="text-3xl font-bold text-zinc-100">{String(minutes).padStart(2, '0')}</p>
          <p className="text-zinc-600 text-xs">min</p>
        </div>
      </div>
      {days <= 7 && (
        <p className="text-red-400/80 text-xs mt-3">Final week</p>
      )}
    </div>
  );
}

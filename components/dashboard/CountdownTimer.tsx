'use client';

import { useCountdown } from '@/lib/hooks';

interface CountdownTimerProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className="text-center">
        <div className="text-4xl font-bold text-emerald-400">PLACEMENT TIME!</div>
        <p className="text-zinc-400 mt-2">You got this! Go crush it!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-zinc-400 text-sm mb-2">Time until placements</p>
      <div className="flex justify-center gap-4">
        <TimeBlock value={days} label="DAYS" highlight={days <= 7} />
        <TimeBlock value={hours} label="HRS" />
        <TimeBlock value={minutes} label="MIN" />
        <TimeBlock value={seconds} label="SEC" />
      </div>
      {days <= 7 && (
        <p className="text-red-400 text-sm mt-3 font-medium animate-pulse">
          Final week! Every hour counts!
        </p>
      )}
    </div>
  );
}

function TimeBlock({ value, label, highlight = false }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className={`
      flex flex-col items-center min-w-[60px] p-3 rounded-lg
      ${highlight ? 'bg-red-950/50 border border-red-700' : 'bg-zinc-800'}
    `}>
      <span className={`text-3xl font-bold ${highlight ? 'text-red-400' : 'text-zinc-100'}`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  );
}

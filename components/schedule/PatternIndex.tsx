'use client';

import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { PATTERN_INDEX } from '@/data/schedule';

export function PatternIndex() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <CardHeader
          title="Pattern Index"
          subtitle="Recognition anchor for revision — given the clue, name the pattern"
        />
        <span className="text-zinc-500 text-sm pb-4">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="space-y-1">
          <div className="grid grid-cols-[1fr_1.4fr_1.2fr] gap-2 px-3 py-1.5 text-xs text-zinc-500 uppercase tracking-wider">
            <span>Pattern</span>
            <span>Typical clue</span>
            <span>State / structure</span>
          </div>
          {PATTERN_INDEX.map((entry) => (
            <div
              key={entry.pattern}
              className="grid grid-cols-[1fr_1.4fr_1.2fr] gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 text-sm"
            >
              <span className="text-zinc-200 font-medium">{entry.pattern}</span>
              <span className="text-zinc-400">{entry.clue}</span>
              <span className="text-zinc-500 font-mono text-xs self-center">{entry.state}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

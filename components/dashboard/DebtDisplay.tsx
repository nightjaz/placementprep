'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { getTotalDebt, getDebtSummary, hasDebt } from '@/lib/debt-system';

export function DebtDisplay() {
  const debt = getTotalDebt();
  const summary = getDebtSummary();
  const inDebt = hasDebt();

  if (!inDebt) {
    return (
      <Card>
        <CardHeader title="Debt" subtitle="None" />
        <div className="text-center py-4">
          <p className="text-zinc-500 text-sm">No outstanding debt</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="danger">
      <CardHeader title="Debt" />

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-red-400">-{debt.totalXP}</p>
          <p className="text-zinc-500 text-xs mt-1">XP owed (10% daily interest)</p>
        </div>

        <div className="space-y-1.5">
          {summary.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-red-300/80">
              <div className="w-1 h-1 rounded-full bg-red-500/50" />
              {item}
            </div>
          ))}
        </div>

        <p className="text-zinc-600 text-xs text-center">
          Complete extra tasks to pay off
        </p>
      </div>
    </Card>
  );
}

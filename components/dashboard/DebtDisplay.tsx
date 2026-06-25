'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { getTotalDebt, getDebtSummary, hasDebt } from '@/lib/debt-system';

export function DebtDisplay() {
  const debt = getTotalDebt();
  const summary = getDebtSummary();
  const inDebt = hasDebt();

  if (!inDebt) {
    return (
      <Card variant="success">
        <CardHeader title="Debt Status" subtitle="You're debt-free!" />
        <div className="text-center py-4">
          <span className="text-4xl">✨</span>
          <p className="text-emerald-400 mt-2 font-medium">No outstanding debt</p>
          <p className="text-zinc-500 text-sm mt-1">Keep up the good work!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="danger">
      <CardHeader
        title="⚠️ Outstanding Debt"
        subtitle="Pay it off to stop XP bleeding!"
      />

      <div className="space-y-4">
        <div className="text-center py-2">
          <p className="text-4xl font-bold text-red-400">-{debt.totalXP}</p>
          <p className="text-zinc-400 text-sm">XP in debt (grows 10% daily!)</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase">You owe:</p>
          <ul className="space-y-1">
            {summary.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-red-300">
                <span className="text-red-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-950/50 rounded-lg p-3 text-center">
          <p className="text-red-400 text-sm font-medium">
            Complete extra tasks to pay off debt!
          </p>
          <p className="text-red-300/70 text-xs mt-1">
            Tasks beyond daily goals count toward debt repayment
          </p>
        </div>
      </div>
    </Card>
  );
}

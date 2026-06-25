'use client';

import { DailyLog, UserSettings } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card, CardHeader } from '@/components/ui/Card';

interface DailyProgressProps {
  log: DailyLog;
  settings: UserSettings;
}

export function DailyProgress({ log, settings }: DailyProgressProps) {
  const dsaProgress = log.dsaProblems.length;
  const dsaGoal = settings.dailyDSAGoal;
  const bootcampCount = log.dsaProblems.filter(p => p.isBootcamp).length;

  const fundamentalsDone = log.fundamentalsTopic !== null;
  const electronicsDone = log.electronicsTopic !== null;
  const numericalsProgress = log.numericalsSolved;

  const allGoalsMet =
    dsaProgress >= dsaGoal &&
    fundamentalsDone &&
    electronicsDone &&
    numericalsProgress >= settings.dailyNumericalGoal;

  return (
    <Card variant={allGoalsMet ? 'success' : 'default'}>
      <CardHeader
        title="Today's Progress"
        subtitle={allGoalsMet ? "All goals completed! 🎉" : "Keep grinding!"}
      />

      <div className="space-y-4">
        <ProgressSection
          label="DSA Problems"
          current={dsaProgress}
          goal={dsaGoal}
          detail={bootcampCount > 0 ? `(${bootcampCount} from bootcamp)` : undefined}
          color={dsaProgress >= dsaGoal ? 'bg-emerald-500' : 'bg-blue-500'}
        />

        <div className="grid grid-cols-2 gap-4">
          <GoalCheck
            label="CS Fundamentals"
            completed={fundamentalsDone}
            detail={log.fundamentalsTopic?.topicName}
          />
          <GoalCheck
            label="Electronics"
            completed={electronicsDone}
            detail={log.electronicsTopic?.topicName}
          />
        </div>

        <ProgressSection
          label="Numericals"
          current={numericalsProgress}
          goal={settings.dailyNumericalGoal}
          color={numericalsProgress >= settings.dailyNumericalGoal ? 'bg-emerald-500' : 'bg-purple-500'}
        />

        <div className="pt-2 border-t border-zinc-700">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Today&apos;s XP</span>
            <span className="text-emerald-400 font-medium">+{log.xpEarned} XP</span>
          </div>
          {log.xpDecayed > 0 && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-zinc-400">XP Decayed</span>
              <span className="text-red-400 font-medium">-{log.xpDecayed} XP</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ProgressSection({
  label,
  current,
  goal,
  detail,
  color,
}: {
  label: string;
  current: number;
  goal: number;
  detail?: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-zinc-300">{label}</span>
        <div className="flex items-center gap-2">
          {detail && <span className="text-xs text-zinc-500">{detail}</span>}
          <span className={`text-sm font-medium ${current >= goal ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {current}/{goal}
          </span>
        </div>
      </div>
      <ProgressBar current={current} max={goal} color={color} showLabel={false} size="sm" />
    </div>
  );
}

function GoalCheck({
  label,
  completed,
  detail,
}: {
  label: string;
  completed: boolean;
  detail?: string;
}) {
  return (
    <div className={`
      p-3 rounded-lg border
      ${completed ? 'bg-emerald-950/30 border-emerald-700' : 'bg-zinc-800/50 border-zinc-700'}
    `}>
      <div className="flex items-center gap-2">
        <span className={`text-lg ${completed ? 'text-emerald-400' : 'text-zinc-500'}`}>
          {completed ? '✓' : '○'}
        </span>
        <div>
          <p className={`text-sm font-medium ${completed ? 'text-emerald-300' : 'text-zinc-400'}`}>
            {label}
          </p>
          {detail && (
            <p className="text-xs text-zinc-500 truncate max-w-[120px]">{detail}</p>
          )}
        </div>
      </div>
    </div>
  );
}

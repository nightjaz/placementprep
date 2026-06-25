'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getShameWall, getUserProfile } from '@/lib/storage';
import { ShameEntry } from '@/types';

export default function ShameWallPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ShameEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = getUserProfile();
    if (!profile) {
      router.push('/');
      return;
    }
    const wall = getShameWall();
    setEntries(wall.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  const totalXPLost = entries.reduce((sum, e) => sum + e.xpLost, 0);
  const totalDebtIncurred = entries.reduce((sum, e) => sum + e.debtIncurred, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="bg-red-950/50 border-b border-red-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-red-400">Wall of Shame</h1>
              <p className="text-red-300/70 text-sm mt-1">
                Your missed goals and broken streaks live here forever.
              </p>
            </div>
            <Link href="/">
              <Button variant="ghost">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {entries.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-medium text-zinc-200">Clean Record!</h2>
            <p className="text-zinc-400 mt-2">
              You haven&apos;t missed any goals yet. Keep it that way!
            </p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card variant="danger">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-400">-{totalXPLost.toLocaleString()}</p>
                  <p className="text-red-300/70 text-sm">Total XP Lost</p>
                </div>
              </Card>
              <Card variant="danger">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-400">{entries.length}</p>
                  <p className="text-red-300/70 text-sm">Shame Entries</p>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              {entries.map((entry, index) => (
                <Card key={index} variant="danger">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-zinc-400 text-sm">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {entry.missedGoals.map((goal, i) => (
                          <li key={i} className="text-red-300 text-sm flex items-center gap-2">
                            <span className="text-red-500">✗</span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                      {entry.excuseGiven && (
                        <p className="text-zinc-500 text-sm mt-2 italic">
                          &quot;{entry.excuseGiven}&quot;
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {entry.xpLost > 0 && (
                        <p className="text-red-400 font-medium">-{entry.xpLost} XP</p>
                      )}
                      {entry.debtIncurred > 0 && (
                        <p className="text-red-300/70 text-sm">+{entry.debtIncurred} debt</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-zinc-500 text-sm">
                Every entry here is a reminder of what happens when you slack off.
              </p>
              <p className="text-zinc-600 text-xs mt-1">
                The best way to avoid seeing this page is to complete your daily goals.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

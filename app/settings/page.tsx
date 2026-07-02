'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getUserProfile, updateUserProfile } from '@/lib/storage';
import { ELECTRONICS_TOPICS, DEFAULT_SETTINGS } from '@/lib/constants';
import { UserSettings, ElectronicsCategory } from '@/types';
import Link from 'next/link';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setSettings(profile.settings);
    }
  }, []);

  const handleSave = () => {
    const profile = getUserProfile();
    if (profile) {
      updateUserProfile({ settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const toggleEceCategory = (category: ElectronicsCategory) => {
    const current = settings.enabledEceCategories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    setSettings({ ...settings, enabledEceCategories: updated });
  };

  const eceCategories = Object.entries(ELECTRONICS_TOPICS) as [ElectronicsCategory, typeof ELECTRONICS_TOPICS.analog][];

  return (
    <main className="min-h-screen bg-zinc-950 p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
            <p className="text-zinc-500 text-sm">Customize your prep journey</p>
          </div>
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm">
            Back
          </Link>
        </div>

        <Card>
          <CardHeader title="DSA Goals" subtitle="Adjust your daily targets" />
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Daily DSA Goal: <span className="text-zinc-100 font-medium">{settings.dailyDSAGoal}</span>
              </label>
              <input
                type="range"
                min="1"
                max="15"
                value={settings.dailyDSAGoal}
                onChange={(e) => setSettings({ ...settings, dailyDSAGoal: parseInt(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>1</span>
                <span>15</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Bootcamp Problems: <span className="text-zinc-100 font-medium">{settings.bootcampProblemsCount}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.bootcampProblemsCount}
                onChange={(e) => setSettings({ ...settings, bootcampProblemsCount: parseInt(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>1</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="ECE Categories" subtitle="Enable topics relevant to you" />
          <div className="space-y-2">
            {eceCategories.map(([key, value]) => {
              const isEnabled = settings.enabledEceCategories?.includes(key) || false;
              return (
                <button
                  key={key}
                  onClick={() => toggleEceCategory(key)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg border transition-all
                    ${isEnabled
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}
                  `}
                >
                  <div className="text-left">
                    <p className="font-medium">{value.name}</p>
                    <p className="text-xs text-zinc-500">{value.topics.length} topics</p>
                  </div>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center
                    ${isEnabled
                      ? 'bg-emerald-500/20 border-emerald-500/50'
                      : 'border-zinc-700'}
                  `}>
                    {isEnabled && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {(settings.enabledEceCategories?.length || 0) === 0 && (
            <p className="text-amber-500 text-sm mt-3">
              No ECE categories enabled. ECE tracking will be disabled.
            </p>
          )}
        </Card>

        <Card>
          <CardHeader title="CS Fundamentals" subtitle="Theory revision settings" />
          <div className="space-y-4">
            <button
              onClick={() => setSettings({
                ...settings,
                dailyFundamentalsGoal: settings.dailyFundamentalsGoal === 1 ? 0 : 1
              })}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg border transition-all
                ${settings.dailyFundamentalsGoal === 1
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}
              `}
            >
              <div className="text-left">
                <p className="font-medium">CS Fundamentals</p>
                <p className="text-xs text-zinc-500">OS, DBMS, CN topics</p>
              </div>
              <div className={`w-5 h-5 rounded border flex items-center justify-center
                ${settings.dailyFundamentalsGoal === 1
                  ? 'bg-emerald-500/20 border-emerald-500/50'
                  : 'border-zinc-700'}
              `}>
                {settings.dailyFundamentalsGoal === 1 && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Other Settings" subtitle="Additional options" />
          <div className="space-y-4">
            <button
              onClick={() => setSettings({ ...settings, harshMode: !settings.harshMode })}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg border transition-all
                ${settings.harshMode
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}
              `}
            >
              <div className="text-left">
                <p className="font-medium">Harsh Mode</p>
                <p className="text-xs text-zinc-500">XP decay for missed tasks, shame wall</p>
              </div>
              <div className={`w-5 h-5 rounded border flex items-center justify-center
                ${settings.harshMode
                  ? 'bg-red-500/20 border-red-500/50'
                  : 'border-zinc-700'}
              `}>
                {settings.harshMode && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Daily Numericals Goal: <span className="text-zinc-100 font-medium">{settings.dailyNumericalGoal}</span>
              </label>
              <input
                type="range"
                min="0"
                max="15"
                value={settings.dailyNumericalGoal}
                onChange={(e) => setSettings({ ...settings, dailyNumericalGoal: parseInt(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>0</span>
                <span>15</span>
              </div>
            </div>
          </div>
        </Card>

        <Button onClick={handleSave} className="w-full">
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </main>
  );
}

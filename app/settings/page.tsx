'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { exportAllData, getUserProfile, importAllData, updateUserProfile } from '@/lib/storage';
import { ELECTRONICS_TOPICS, DEFAULT_SETTINGS } from '@/lib/constants';
import { UserSettings, ElectronicsCategory } from '@/types';
import Link from 'next/link';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [dataMessage, setDataMessage] = useState('');
  const importRef = useRef<HTMLInputElement>(null);

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

  const handleExport = () => {
    const blob = new Blob([exportAllData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `placement-quest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setDataMessage('Backup downloaded.');
  };

  const handleImport = async (file?: File) => {
    if (!file) return;
    try {
      importAllData(await file.text());
      setDataMessage('Backup imported. Reloading…');
      window.location.reload();
    } catch (error) {
      setDataMessage(error instanceof Error ? error.message : 'Could not import this backup.');
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
          <button
            onClick={() => setSettings({ ...settings, dailyElectronicsGoal: settings.dailyElectronicsGoal > 0 ? 0 : 1 })}
            className="w-full flex items-center justify-between p-3 mt-4 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400"
          >
            <span className="text-sm">Include electronics in daily goals</span>
            <span className="text-xs">{settings.dailyElectronicsGoal > 0 ? 'On' : 'Off'}</span>
          </button>
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

            <button
              onClick={() => setSettings({ ...settings, useStarterPlan: !settings.useStarterPlan })}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                settings.useStarterPlan
                  ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="text-left">
                <p className="font-medium">35-day starter plan</p>
                <p className="text-xs text-zinc-500">Show the original curated curriculum on Overview</p>
              </div>
              <span className="text-xs">{settings.useStarterPlan ? 'On' : 'Off'}</span>
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
                <p className="text-xs text-zinc-500">Accountability copy and shame wall; earned XP stays safe</p>
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

            <button
              onClick={() => setSettings({ ...settings, xpDecayEnabled: !settings.xpDecayEnabled })}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                settings.xpDecayEnabled
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="text-left">
                <p className="font-medium">XP decay</p>
                <p className="text-xs text-zinc-500">Deduct missed daily goals once the next day; XP never drops below zero</p>
              </div>
              <span className="text-xs">{settings.xpDecayEnabled ? 'On' : 'Off'}</span>
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

        <Card>
          <CardHeader title="Your data" subtitle="Portable by design — no account required" />
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleExport} variant="secondary">Export backup</Button>
            <Button onClick={() => importRef.current?.click()} variant="secondary">Import backup</Button>
          </div>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => handleImport(event.target.files?.[0])}
          />
          {dataMessage && <p className="text-sm text-zinc-400 mt-3">{dataMessage}</p>}
        </Card>

        <Button onClick={handleSave} className="w-full">
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </main>
  );
}

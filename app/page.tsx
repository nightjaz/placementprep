'use client';

import { useUserProfile } from '@/lib/hooks';
import { Onboarding } from '@/components/Onboarding';
import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  const { profile, loading, initProfile, refreshProfile } = useUserProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce">⚔️</div>
          <p className="text-zinc-400 mt-4">Loading PlacementQuest...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Onboarding onComplete={initProfile} />;
  }

  return <Dashboard profile={profile} onRefresh={refreshProfile} />;
}

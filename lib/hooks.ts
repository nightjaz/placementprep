'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile, DailyLog, Quest } from '@/types';
import { getUserProfile, createUserProfile, updateUserProfile, getTodayLog, saveDailyLog, getQuests, saveQuests } from './storage';
import { checkAndUpdateStreak } from './streak-manager';
import { applyDailyInterest } from './debt-system';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      const existingProfile = getUserProfile();
      if (existingProfile) {
        setProfile(existingProfile);
        checkAndUpdateStreak();
        applyDailyInterest();
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  const initProfile = useCallback((placementDate: string) => {
    const newProfile = createUserProfile(placementDate);
    setProfile(newProfile);
    return newProfile;
  }, []);

  const refreshProfile = useCallback(() => {
    const existingProfile = getUserProfile();
    setProfile(existingProfile);
    return existingProfile;
  }, []);

  const update = useCallback((updates: Partial<UserProfile>) => {
    const updated = updateUserProfile(updates);
    setProfile(updated);
    return updated;
  }, []);

  return { profile, loading, initProfile, refreshProfile, update };
}

export function useTodayLog() {
  const [log, setLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    setLog(getTodayLog());
  }, []);

  const refresh = useCallback(() => {
    const todayLog = getTodayLog();
    setLog(todayLog);
    return todayLog;
  }, []);

  const update = useCallback((updates: Partial<DailyLog>) => {
    const currentLog = getTodayLog();
    const updated = { ...currentLog, ...updates };
    saveDailyLog(updated);
    setLog(updated);
    return updated;
  }, []);

  return { log, refresh, update };
}

export function useCountdown(targetDate: string) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalDays: 0,
          isExpired: true,
        });
        return;
      }

      const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        totalDays,
        isExpired: false,
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    setQuests(getQuests());
  }, []);

  const refresh = useCallback(() => {
    const currentQuests = getQuests();
    setQuests(currentQuests);
    return currentQuests;
  }, []);

  const update = useCallback((updatedQuests: Quest[]) => {
    saveQuests(updatedQuests);
    setQuests(updatedQuests);
  }, []);

  const completeQuest = useCallback((questId: string) => {
    const currentQuests = getQuests();
    const updated = currentQuests.map(q =>
      q.id === questId ? { ...q, completed: true, completedAt: new Date().toISOString() } : q
    );
    saveQuests(updated);
    setQuests(updated);
  }, []);

  return { quests, refresh, update, completeQuest };
}

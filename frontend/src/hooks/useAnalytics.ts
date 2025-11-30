import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../services/analyticsApi';
import type { MonthlyAnalyticsResponse, WeeklyAnalyticsResponse } from '../types';

interface UseAnalyticsReturn {
  monthlyAnalytics: MonthlyAnalyticsResponse | null;
  weeklyAnalytics: WeeklyAnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  fetchMonthly: (month: string) => Promise<void>;
  fetchWeekly: () => Promise<void>;
  recomputeMonthly: (month: string) => Promise<void>;
  recomputeWeekly: () => Promise<void>;
  deleteMonthly: (month: string) => Promise<void>;
  deleteWeekly: () => Promise<void>;
}

export const useAnalytics = (userId: string | null | undefined): UseAnalyticsReturn => {
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<MonthlyAnalyticsResponse | null>(null);
  const [weeklyAnalytics, setWeeklyAnalytics] = useState<WeeklyAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthly = useCallback(async (month: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsApi.getMonthly(userId, month);
      setMonthlyAnalytics(data);
    } catch (err: any) {
      if (err?.response?.status === 400 || err?.response?.status === 404) {
        try {
          const data = await analyticsApi.generateMonthly(userId, month);
          setMonthlyAnalytics(data);
        } catch (generateErr) {
          const errorMessage = generateErr instanceof Error ? generateErr.message : 'Failed to generate monthly analytics';
          setError(errorMessage);
          setMonthlyAnalytics(null);
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch monthly analytics';
        setError(errorMessage);
        setMonthlyAnalytics(null);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchWeekly = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsApi.getWeeklyLast7(userId);
      setWeeklyAnalytics(data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const data = await analyticsApi.generateWeeklyLast7(userId);
          setWeeklyAnalytics(data);
        } catch (generateErr) {
          const errorMessage = generateErr instanceof Error ? generateErr.message : 'Failed to generate weekly analytics';
          setError(errorMessage);
          setWeeklyAnalytics(null);
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weekly analytics';
        setError(errorMessage);
        setWeeklyAnalytics(null);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const recomputeMonthly = useCallback(async (month: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await analyticsApi.recomputeMonthly(userId, month);
      await fetchMonthly(month);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to recompute monthly analytics';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchMonthly]);

  const recomputeWeekly = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await analyticsApi.recomputeWeeklyLast7(userId);
      await fetchWeekly();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to recompute weekly analytics';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchWeekly]);

  const deleteMonthly = useCallback(async (month: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await analyticsApi.deleteMonthly(userId, month);
      setMonthlyAnalytics(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete monthly analytics';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const deleteWeekly = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await analyticsApi.deleteWeeklyLast7(userId);
      setWeeklyAnalytics(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete weekly analytics';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    monthlyAnalytics,
    weeklyAnalytics,
    loading,
    error,
    fetchMonthly,
    fetchWeekly,
    recomputeMonthly,
    recomputeWeekly,
    deleteMonthly,
    deleteWeekly,
  };
};


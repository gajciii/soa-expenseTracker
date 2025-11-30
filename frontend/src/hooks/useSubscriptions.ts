import { useState, useEffect, useCallback } from 'react';
import { subscriptionApi } from '../services/subscriptionApi';
import type { Subscription, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../types';

interface UseSubscriptionsReturn {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  fetchUserSubscriptions: () => Promise<void>;
  createSubscription: (data: CreateSubscriptionRequest) => Promise<void>;
  updateSubscription: (id: string, data: UpdateSubscriptionRequest) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
}

export const useSubscriptions = (userId: string | null | undefined): UseSubscriptionsReturn => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserSubscriptions = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await subscriptionApi.getUserSubscriptions(userId);
      setSubscriptions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscriptions';
      setError(errorMessage);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createSubscription = useCallback(async (data: CreateSubscriptionRequest) => {
    setLoading(true);
    setError(null);
    try {
      await subscriptionApi.createSubscription(data);
      await fetchUserSubscriptions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserSubscriptions]);

  const updateSubscription = useCallback(async (id: string, data: UpdateSubscriptionRequest) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await subscriptionApi.updateSubscription(id, userId, data);
      await fetchUserSubscriptions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchUserSubscriptions]);

  const deleteSubscription = useCallback(async (id: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await subscriptionApi.deleteSubscription(id, userId);
      await fetchUserSubscriptions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchUserSubscriptions]);

  useEffect(() => {
    if (userId) {
      fetchUserSubscriptions();
    }
  }, [userId, fetchUserSubscriptions]);

  return {
    subscriptions,
    loading,
    error,
    fetchUserSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
};


import { useState, useEffect, useCallback } from 'react';
import { categoryBudgetApi } from '../services/categoryBudgetApi';
import type { BudgetResponse, BudgetRequest } from '../types';

interface UseBudgetsReturn {
  budgets: BudgetResponse[];
  loading: boolean;
  error: string | null;
  fetchBudgets: (month?: string) => Promise<void>;
  upsertBudget: (budgetData: BudgetRequest) => Promise<{ message: string } | null>;
  updateBudget: (budgetId: string, budgetData: BudgetRequest) => Promise<{ message: string } | undefined>;
  deleteBudget: (budgetId: string) => Promise<void>;
}

export const useBudgets = (userId: string | null | undefined): UseBudgetsReturn => {
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async (month?: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await categoryBudgetApi.getBudgets(userId, month);
      setBudgets(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri pridobivanju proračunov';
      setError(errorMessage);
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const upsertBudget = useCallback(async (budgetData: BudgetRequest) => {
    if (!userId) return null;
    
    setLoading(true);
    setError(null);
    try {
      const result = await categoryBudgetApi.upsertBudget(userId, budgetData);
      await fetchBudgets(budgetData.month);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri ustvarjanju/pridobivanju proračuna';
      setError(errorMessage);
      console.error('Error upserting budget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchBudgets]);

  const updateBudget = useCallback(async (budgetId: string, budgetData: BudgetRequest) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await categoryBudgetApi.updateBudget(userId, budgetId, budgetData);
      await fetchBudgets(budgetData.month);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri posodabljanju proračuna';
      setError(errorMessage);
      console.error('Error updating budget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchBudgets]);

  const deleteBudget = useCallback(async (budgetId: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await categoryBudgetApi.deleteBudget(userId, budgetId);
      await fetchBudgets();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri brisanju proračuna';
      setError(errorMessage);
      console.error('Error deleting budget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchBudgets]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    upsertBudget,
    updateBudget,
    deleteBudget,
  };
};


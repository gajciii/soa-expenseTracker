import { useState, useEffect, useCallback, useRef } from 'react';
import { expenseApi } from '../services/api';
import type { ExpenseResponse, ExpenseRequest, Item, ExpenseParams } from '../types';

interface UseExpensesReturn {
  expenses: ExpenseResponse[];
  loading: boolean;
  error: string | null;
  fetchExpenses: (params?: ExpenseParams) => Promise<void>;
  createExpense: (expenseData: ExpenseRequest) => Promise<{ message: string; expense_id: string } | null>;
  deleteExpense: (expenseId: string) => Promise<void>;
  deleteAllExpenses: () => Promise<void>;
  updateItem: (expenseId: string, itemId: string, itemData: Item) => Promise<Item | undefined>;
  updateDescription: (expenseId: string, description: string) => Promise<{ message: string } | undefined>;
}

const getExpenseIdMap = (userId: string): Map<string, string> => {
  try {
    const stored = localStorage.getItem(`expense_ids_${userId}`);
    if (stored) {
      return new Map(JSON.parse(stored));
    }
  } catch (e) {
    console.error('Error reading expense IDs from localStorage:', e);
  }
  return new Map();
};

const saveExpenseIdMap = (userId: string, map: Map<string, string>): void => {
  try {
    localStorage.setItem(`expense_ids_${userId}`, JSON.stringify(Array.from(map.entries())));
  } catch (e) {
    console.error('Error saving expense IDs to localStorage:', e);
  }
};

export const useExpenses = (userId: string | null | undefined): UseExpensesReturn => {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const currentParamsRef = useRef<ExpenseParams>({});

  const fetchExpenses = useCallback(async (params: ExpenseParams = {}) => {
    if (!userId) return;
    
    currentParamsRef.current = params;
    setLoading(true);
    setError(null);
    try {
      const data = await expenseApi.getExpenses(userId, params);
      const expenseIdMap = getExpenseIdMap(userId);
      const expensesWithIds = data.map(expense => {
        const expenseId = expenseIdMap.get(expense.created_at);
        return expenseId ? { ...expense, expense_id: expenseId } : expense;
      });
      setExpenses(expensesWithIds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri pridobivanju expense-ov';
      setError(errorMessage);
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createExpense = useCallback(async (expenseData: ExpenseRequest) => {
    if (!userId) return null;
    
    setLoading(true);
    setError(null);
    try {
      const result = await expenseApi.createExpense(userId, expenseData);
      if (result && result.expense_id) {
        const newExpenses = await expenseApi.getExpenses(userId);
        const newExpense = newExpenses
          .filter(e => e.description === expenseData.description)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        
        if (newExpense) {
          const expenseIdMap = getExpenseIdMap(userId);
          expenseIdMap.set(newExpense.created_at, result.expense_id);
          saveExpenseIdMap(userId, expenseIdMap);
        }
      }
      await fetchExpenses(currentParamsRef.current);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri ustvarjanju expense-a';
      setError(errorMessage);
      console.error('Error creating expense:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchExpenses]);

  const deleteExpense = useCallback(async (expenseId: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await expenseApi.deleteExpense(userId, expenseId);
      const expenseIdMap = getExpenseIdMap(userId);
      for (const [key, value] of expenseIdMap.entries()) {
        if (value === expenseId) {
          expenseIdMap.delete(key);
          break;
        }
      }
      saveExpenseIdMap(userId, expenseIdMap);
      await fetchExpenses(currentParamsRef.current);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri brisanju expense-a';
      setError(errorMessage);
      console.error('Error deleting expense:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchExpenses]);

  const updateItem = useCallback(async (expenseId: string, itemId: string, itemData: Item) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await expenseApi.updateItem(userId, expenseId, itemId, itemData);
      await fetchExpenses(currentParamsRef.current);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri posodabljanju item-a';
      setError(errorMessage);
      console.error('Error updating item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchExpenses]);

  const deleteAllExpenses = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await expenseApi.deleteAllExpenses(userId);
      localStorage.removeItem(`expense_ids_${userId}`);
      await fetchExpenses(currentParamsRef.current);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri brisanju vseh expense-ov';
      setError(errorMessage);
      console.error('Error deleting all expenses:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchExpenses]);

  const updateDescription = useCallback(async (expenseId: string, description: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await expenseApi.updateExpenseDescription(userId, expenseId, description);
      await fetchExpenses(currentParamsRef.current);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri posodabljanju opisa';
      setError(errorMessage);
      console.error('Error updating description:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchExpenses]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    deleteExpense,
    deleteAllExpenses,
    updateItem,
    updateDescription,
  };
};


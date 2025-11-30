import { useState, useEffect, useCallback } from 'react';
import { sharedExpensesApi } from '../services/sharedExpensesApi';
import type {
  GroupExpenseResponse,
  GroupExpenseRequest,
  GroupRequest,
  GroupResponse,
  GroupTitleRequest,
} from '../types';

interface UseSharedExpensesReturn {
  groupExpenses: GroupExpenseResponse[];
  groups: GroupResponse[];
  selectedGroup: GroupResponse | null;
  groupMembers: string[];
  loading: boolean;
  error: string | null;
  createGroup: (data: GroupRequest) => Promise<void>;
  fetchGroupExpenses: (groupId: string) => Promise<void>;
  fetchUserGroups: () => Promise<void>;
  fetchGroup: (id: string) => Promise<void>;
  fetchGroupMembers: (id: string) => Promise<void>;
  updateGroupExpense: (groupId: string, expenseId: string, data: GroupExpenseRequest) => Promise<void>;
  deleteGroupExpense: (groupId: string, expenseId: string) => Promise<void>;
  updateGroupTitle: (id: string, title: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
}

export const useSharedExpenses = (userId: string | null | undefined): UseSharedExpensesReturn => {
  const [groupExpenses, setGroupExpenses] = useState<GroupExpenseResponse[]>([]);
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupResponse | null>(null);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserGroups = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await sharedExpensesApi.getUserGroups(userId);
      setGroups(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user groups';
      setError(errorMessage);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createGroup = useCallback(async (data: GroupRequest) => {
    setLoading(true);
    setError(null);
    try {
      await sharedExpensesApi.createGroup(data);
      await fetchUserGroups();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create group';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserGroups]);

  const fetchGroupExpenses = useCallback(async (groupId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sharedExpensesApi.getGroupExpenses(groupId);
      setGroupExpenses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch group expenses';
      setError(errorMessage);
      setGroupExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroup = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sharedExpensesApi.getGroup(id);
      setSelectedGroup(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch group';
      setError(errorMessage);
      setSelectedGroup(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroupMembers = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sharedExpensesApi.getGroupMembers(id);
      setGroupMembers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch group members';
      setError(errorMessage);
      setGroupMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGroupExpense = useCallback(async (groupId: string, expenseId: string, data: GroupExpenseRequest) => {
    setLoading(true);
    setError(null);
    try {
      await sharedExpensesApi.updateGroupExpense(groupId, expenseId, data);
      await fetchGroupExpenses(groupId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update group expense';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchGroupExpenses]);

  const deleteGroupExpense = useCallback(async (groupId: string, expenseId: string) => {
    setLoading(true);
    setError(null);
    try {
      await sharedExpensesApi.deleteGroupExpense(groupId, expenseId);
      await fetchGroupExpenses(groupId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete group expense';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchGroupExpenses]);

  const updateGroupTitle = useCallback(async (id: string, title: string) => {
    setLoading(true);
    setError(null);
    try {
      await sharedExpensesApi.updateGroupTitle(id, { title });
      await fetchGroup(id);
      await fetchUserGroups();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update group title';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchGroup, fetchUserGroups]);

  const deleteGroup = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await sharedExpensesApi.deleteGroup(id);
      setSelectedGroup(null);
      await fetchUserGroups();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete group';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserGroups]);

  useEffect(() => {
    if (userId) {
      fetchUserGroups();
    }
  }, [userId, fetchUserGroups]);

  return {
    groupExpenses,
    groups,
    selectedGroup,
    groupMembers,
    loading,
    error,
    createGroup,
    fetchGroupExpenses,
    fetchUserGroups,
    fetchGroup,
    fetchGroupMembers,
    updateGroupExpense,
    deleteGroupExpense,
    updateGroupTitle,
    deleteGroup,
  };
};


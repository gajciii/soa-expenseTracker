import { useState, useEffect, useCallback } from 'react';
import { categoryBudgetApi } from '../services/categoryBudgetApi';
import type { CategoryResponse, CategoryRequest } from '../types';

interface UseCategoriesReturn {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (categoryData: CategoryRequest) => Promise<{ message: string; category_id: string } | null>;
  updateCategory: (categoryId: string, categoryData: CategoryRequest) => Promise<{ message: string } | undefined>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

export const useCategories = (userId: string | null | undefined): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await categoryBudgetApi.getCategories(userId);
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri pridobivanju kategorij';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createCategory = useCallback(async (categoryData: CategoryRequest) => {
    if (!userId) return null;
    
    setLoading(true);
    setError(null);
    try {
      const result = await categoryBudgetApi.createCategory(userId, categoryData);
      await fetchCategories();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri ustvarjanju kategorije';
      setError(errorMessage);
      console.error('Error creating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchCategories]);

  const updateCategory = useCallback(async (categoryId: string, categoryData: CategoryRequest) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await categoryBudgetApi.updateCategory(userId, categoryId, categoryData);
      await fetchCategories();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri posodabljanju kategorije';
      setError(errorMessage);
      console.error('Error updating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchCategories]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      await categoryBudgetApi.deleteCategory(userId, categoryId);
      await fetchCategories();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri brisanju kategorije';
      setError(errorMessage);
      console.error('Error deleting category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};


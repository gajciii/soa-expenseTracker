import axios, { AxiosInstance } from 'axios';
import { CATEGORY_BUDGET_API_BASE_URL } from '../config/api';
import type {
  CategoryRequest,
  CategoryResponse,
  CreateCategoryResponse,
  BudgetRequest,
  BudgetResponse,
} from '../types';

const api: AxiosInstance = axios.create({
  baseURL: CATEGORY_BUDGET_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryBudgetApi = {
  createCategory: async (userId: string, categoryData: CategoryRequest): Promise<CreateCategoryResponse> => {
    const response = await api.post<CreateCategoryResponse>(`/${userId}/categories/create`, categoryData);
    return response.data;
  },

  getCategories: async (userId: string): Promise<CategoryResponse[]> => {
    const response = await api.get<CategoryResponse[]>(`/${userId}/categories`);
    return response.data;
  },

  updateCategory: async (userId: string, categoryId: string, categoryData: CategoryRequest): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/${userId}/categories/${categoryId}/update`, categoryData);
    return response.data;
  },

  deleteCategory: async (userId: string, categoryId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/${userId}/categories/${categoryId}/delete`);
    return response.data;
  },

  upsertBudget: async (userId: string, budgetData: BudgetRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/${userId}/budgets/upsert`, budgetData);
    return response.data;
  },

  getBudgets: async (userId: string, month?: string): Promise<BudgetResponse[]> => {
    const response = await api.get<BudgetResponse[]>(`/${userId}/budgets`, { params: month ? { month } : {} });
    return response.data;
  },

  updateBudget: async (userId: string, budgetId: string, budgetData: BudgetRequest): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/${userId}/budgets/${budgetId}/update`, budgetData);
    return response.data;
  },

  deleteBudget: async (userId: string, budgetId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/${userId}/budgets/${budgetId}/delete`);
    return response.data;
  },
};

export default categoryBudgetApi;


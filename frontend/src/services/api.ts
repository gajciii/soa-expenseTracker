import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../config/api';
import type {
  Item,
  ExpenseRequest,
  ExpenseResponse,
  Report,
  CreateExpenseResponse,
  CreateReportResponse,
  ExpenseParams,
} from '../types';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expenseApi = {
  getExpenses: async (userId: string, params: ExpenseParams = {}): Promise<ExpenseResponse[]> => {
    const response = await api.get<ExpenseResponse[]>(`/${userId}/expenses/`, { params });
    return response.data;
  },

  createExpense: async (userId: string, expenseData: ExpenseRequest): Promise<CreateExpenseResponse> => {
    const response = await api.post<CreateExpenseResponse>(`/${userId}/expenses/create`, expenseData);
    return response.data;
  },

  updateItem: async (userId: string, expenseId: string, itemId: string, itemData: Item): Promise<Item> => {
    const response = await api.put<Item>(
      `/${userId}/expenses/${expenseId}/item/${itemId}/update`,
      itemData
    );
    return response.data;
  },

  updateExpenseDescription: async (
    userId: string,
    expenseId: string,
    description: string
  ): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(
      `/${userId}/expenses/description/update`,
      { description },
      { params: { expense_id: expenseId } }
    );
    return response.data;
  },

  deleteExpense: async (userId: string, expenseId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/${userId}/expenses/expense/delete/${expenseId}`);
    return response.data;
  },

  deleteAllExpenses: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/${userId}/expenses/expense/delete-all`);
    return response.data;
  },

  createReport: async (userId: string, params: ExpenseParams = {}): Promise<CreateReportResponse> => {
    const response = await api.post<CreateReportResponse>(`/${userId}/expenses/report/create`, null, { params });
    return response.data;
  },

  getAllReportIds: async (userId: string): Promise<string[]> => {
    const response = await api.get<string[]>(`/${userId}/expenses/reports`);
    return response.data;
  },

  getReport: async (userId: string, reportId: string): Promise<Report> => {
    const response = await api.get<Report>(`/${userId}/expenses/report`, {
      params: { report_id: reportId },
    });
    return response.data;
  },

  deleteReport: async (userId: string, reportId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/${userId}/expenses/report/delete/${reportId}`);
    return response.data;
  },

  deleteAllReports: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/${userId}/expenses/report/delete-all`);
    return response.data;
  },
};

export default expenseApi;


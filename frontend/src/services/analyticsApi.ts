import axios, { AxiosInstance } from 'axios';
import { ANALYTICS_API_BASE_URL } from '../config/api';
import { addInterceptors } from '../utils/axiosInterceptor';
import type {
  MonthlyAnalyticsResponse,
  WeeklyAnalyticsResponse,
} from '../types';

const api: AxiosInstance = axios.create({
  baseURL: ANALYTICS_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dodaj interceptorje za avtomatsko dodajanje Bearer tokena
addInterceptors(api);

export const analyticsApi = {
  getMonthly: async (userId: string, month: string): Promise<MonthlyAnalyticsResponse> => {
    const response = await api.get<MonthlyAnalyticsResponse>(`/${userId}/analytics/monthly`, {
      params: { month },
    });
    return response.data;
  },

  generateMonthly: async (userId: string, month: string): Promise<MonthlyAnalyticsResponse> => {
    const response = await api.post<MonthlyAnalyticsResponse>(`/${userId}/analytics/monthly/generate`, {
      month,
    });
    return response.data;
  },

  recomputeMonthly: async (userId: string, month: string): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/${userId}/analytics/monthly/${month}/recompute`);
    return response.data;
  },

  deleteMonthly: async (userId: string, month: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/${userId}/analytics/monthly/${month}/delete`);
    return response.data;
  },

  getWeeklyLast7: async (userId: string): Promise<WeeklyAnalyticsResponse> => {
    const response = await api.get<WeeklyAnalyticsResponse>(`/${userId}/analytics/weekly/last7`);
    return response.data;
  },

  generateWeeklyLast7: async (userId: string): Promise<WeeklyAnalyticsResponse> => {
    const response = await api.post<WeeklyAnalyticsResponse>(`/${userId}/analytics/weekly/last7/generate`);
    return response.data;
  },

  recomputeWeeklyLast7: async (userId: string): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/${userId}/analytics/weekly/last7/recompute`);
    return response.data;
  },

  deleteWeeklyLast7: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/${userId}/analytics/weekly/last7/delete`);
    return response.data;
  },
};

export default analyticsApi;


import axios, { AxiosInstance } from 'axios';
import { SUBSCRIPTION_API_BASE_URL } from '../config/api';
import type {
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from '../types';

const api: AxiosInstance = axios.create({
  baseURL: SUBSCRIPTION_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const subscriptionApi = {
  getUserSubscriptions: async (userId: string): Promise<Subscription[]> => {
    const response = await api.get<Subscription[]>(`/subscriptions/user/${userId}`);
    return response.data;
  },

  getSubscription: async (id: string, userId: string): Promise<Subscription> => {
    const response = await api.get<Subscription>(`/subscriptions/${id}/user/${userId}`);
    return response.data;
  },

  createSubscription: async (subscriptionData: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await api.post<Subscription>(`/subscriptions`, subscriptionData);
    return response.data;
  },

  updateSubscription: async (id: string, userId: string, subscriptionData: UpdateSubscriptionRequest): Promise<Subscription> => {
    const response = await api.put<Subscription>(`/subscriptions/${id}/user/${userId}`, subscriptionData);
    return response.data;
  },

  deleteSubscription: async (id: string, userId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/subscriptions/${id}/user/${userId}`);
    return response.data;
  },
};

export default subscriptionApi;


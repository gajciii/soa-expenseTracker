import axios, { AxiosInstance } from 'axios';
import { NOTIFICATION_API_BASE_URL } from '../config/api';
import { addInterceptors } from '../utils/axiosInterceptor';
import type {
  Reminder,
  CreateReminderRequest,
  UpdateReminderRequest,
  Notification,
  CreateNotificationRequest,
  UpdateNotificationRequest,
} from '../types';

const notificationApi: AxiosInstance = axios.create({
  baseURL: NOTIFICATION_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dodaj interceptorje za avtomatsko dodajanje Bearer tokena
addInterceptors(notificationApi);

export const reminderApi = {
  createReminder: async (data: CreateReminderRequest): Promise<Reminder> => {
    const response = await notificationApi.post<Reminder>('/reminders', data);
    return response.data;
  },

  getRemindersForUser: async (userId: string): Promise<Reminder[]> => {
    const response = await notificationApi.get<Reminder[]>(`/reminders/user/${userId}`);
    return response.data;
  },

  getReminder: async (id: number): Promise<Reminder> => {
    const response = await notificationApi.get<Reminder>(`/reminders/${id}`);
    return response.data;
  },

  updateReminder: async (id: number, data: UpdateReminderRequest): Promise<Reminder> => {
    const response = await notificationApi.put<Reminder>(`/reminders/${id}`, data);
    return response.data;
  },

  deleteReminder: async (id: number): Promise<void> => {
    await notificationApi.delete(`/reminders/${id}`);
  },

  processDueReminders: async (): Promise<void> => {
    await notificationApi.post('/reminders/process-due');
  },
};

export const notificationApiService = {
  createNotification: async (data: CreateNotificationRequest): Promise<Notification> => {
    const response = await notificationApi.post<Notification>('/notifications', data);
    return response.data;
  },

  getNotificationsForUser: async (userId: string): Promise<Notification[]> => {
    const response = await notificationApi.get<Notification[]>(`/notifications/user/${userId}`);
    return response.data;
  },

  getNotification: async (id: number): Promise<Notification> => {
    const response = await notificationApi.get<Notification>(`/notifications/${id}`);
    return response.data;
  },

  updateNotification: async (id: number, data: UpdateNotificationRequest): Promise<Notification> => {
    const response = await notificationApi.put<Notification>(`/notifications/${id}`, data);
    return response.data;
  },

  markNotificationAsRead: async (id: number): Promise<Notification> => {
    const response = await notificationApi.put<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  deleteNotification: async (id: number): Promise<void> => {
    await notificationApi.delete(`/notifications/${id}`);
  },

  deleteAllNotificationsForUser: async (userId: string): Promise<void> => {
    await notificationApi.delete(`/notifications/user/${userId}`);
  },
};

export default { reminderApi, notificationApiService };


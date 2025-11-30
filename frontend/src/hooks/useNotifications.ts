import { useState, useEffect, useCallback } from 'react';
import { notificationApiService } from '../services/notificationApi';
import type { Notification, CreateNotificationRequest, UpdateNotificationRequest } from '../types';

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  createNotification: (data: CreateNotificationRequest) => Promise<Notification | null>;
  updateNotification: (id: number, data: UpdateNotificationRequest) => Promise<Notification | null>;
  markAsRead: (id: number) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  unreadCount: number;
}

export const useNotifications = (userId: string | null | undefined): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await notificationApiService.getNotificationsForUser(userId);
      setNotifications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri pridobivanju obvestil';
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createNotification = useCallback(async (data: CreateNotificationRequest) => {
    if (!userId) return null;

    setLoading(true);
    setError(null);
    try {
      const result = await notificationApiService.createNotification(data);
      await fetchNotifications();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri ustvarjanju obvestila';
      setError(errorMessage);
      console.error('Error creating notification:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchNotifications]);

  const updateNotification = useCallback(async (id: number, data: UpdateNotificationRequest) => {
    if (!userId) return null;

    setLoading(true);
    setError(null);
    try {
      const result = await notificationApiService.updateNotification(id, data);
      await fetchNotifications();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri posodabljanju obvestila';
      setError(errorMessage);
      console.error('Error updating notification:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchNotifications]);

  const markAsRead = useCallback(async (id: number) => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      await notificationApiService.markNotificationAsRead(id);
      await fetchNotifications();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri označevanju obvestila kot prebranega';
      setError(errorMessage);
      console.error('Error marking notification as read:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchNotifications]);

  const deleteNotification = useCallback(async (id: number) => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      await notificationApiService.deleteNotification(id);
      await fetchNotifications();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri brisanju obvestila';
      setError(errorMessage);
      console.error('Error deleting notification:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchNotifications]);

  const deleteAllNotifications = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      await notificationApiService.deleteAllNotificationsForUser(userId);
      await fetchNotifications();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri brisanju vseh obvestil';
      setError(errorMessage);
      console.error('Error deleting all notifications:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    createNotification,
    updateNotification,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
    unreadCount,
  };
};


import { useState, useEffect, useCallback } from 'react';
import { reminderApi } from '../services/notificationApi';
import type { Reminder, CreateReminderRequest, UpdateReminderRequest } from '../types';

interface UseRemindersReturn {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  fetchReminders: () => Promise<void>;
  createReminder: (data: CreateReminderRequest) => Promise<Reminder | null>;
  updateReminder: (id: number, data: UpdateReminderRequest) => Promise<Reminder | null>;
  deleteReminder: (id: number) => Promise<void>;
  processDueReminders: () => Promise<void>;
}

export const useReminders = (userId: string | null | undefined): UseRemindersReturn => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await reminderApi.getRemindersForUser(userId);
      setReminders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri pridobivanju opomnikov';
      setError(errorMessage);
      console.error('Error fetching reminders:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createReminder = useCallback(async (data: CreateReminderRequest) => {
    if (!userId) return null;

    setLoading(true);
    setError(null);
    try {
      const result = await reminderApi.createReminder(data);
      await fetchReminders();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri ustvarjanju opomnika';
      setError(errorMessage);
      console.error('Error creating reminder:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchReminders]);

  const updateReminder = useCallback(async (id: number, data: UpdateReminderRequest) => {
    if (!userId) return null;

    setLoading(true);
    setError(null);
    try {
      const result = await reminderApi.updateReminder(id, data);
      await fetchReminders();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri posodabljanju opomnika';
      setError(errorMessage);
      console.error('Error updating reminder:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchReminders]);

  const deleteReminder = useCallback(async (id: number) => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      await reminderApi.deleteReminder(id);
      await fetchReminders();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri brisanju opomnika';
      setError(errorMessage);
      console.error('Error deleting reminder:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchReminders]);

  const processDueReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await reminderApi.processDueReminders();
      await fetchReminders();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Napaka pri procesiranju zapadlih opomnikov';
      setError(errorMessage);
      console.error('Error processing due reminders:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchReminders]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return {
    reminders,
    loading,
    error,
    fetchReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    processDueReminders,
  };
};


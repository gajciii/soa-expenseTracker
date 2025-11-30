import { useState } from 'react';
import { useReminders } from '../hooks/useReminders';
import { useNotifications } from '../hooks/useNotifications';
import { ReminderForm } from '../components/notifications/ReminderForm';
import { ReminderList } from '../components/notifications/ReminderList';
import { NotificationList } from '../components/notifications/NotificationList';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { pageStyles, pageClasses } from '../styles/pageStyles';
import type { CreateReminderRequest, UpdateReminderRequest } from '../types';

type TabType = 'reminders' | 'notifications';

export const NotificationsPage = () => {
  const { user } = useAuth();
  const userId = user?.user_id || null;
  const [activeTab, setActiveTab] = useState<TabType>('reminders');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const { showNotification } = useNotification();

  const {
    reminders,
    loading: remindersLoading,
    error: remindersError,
    createReminder,
    updateReminder,
    deleteReminder,
    processDueReminders,
  } = useReminders(userId);

  const {
    notifications,
    loading: notificationsLoading,
    error: notificationsError,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
    unreadCount,
  } = useNotifications(userId);

  const handleCreateReminder = async (data: CreateReminderRequest): Promise<void> => {
    try {
      await createReminder(data);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create reminder:', error);
    }
  };

  const handleUpdateReminder = async (id: number, data: UpdateReminderRequest): Promise<void> => {
    try {
      await updateReminder(id, data);
    } catch (error) {
      console.error('Failed to update reminder:', error);
    }
  };

  const handleDeleteReminder = async (id: number): Promise<void> => {
    try {
      await deleteReminder(id);
      showNotification('Reminder deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      showNotification('Failed to delete reminder. Check console for details.', 'error');
    }
  };

  const handleProcessDueReminders = async (): Promise<void> => {
    try {
      await processDueReminders();
      showNotification('Due reminders processed successfully!', 'success');
    } catch (error) {
      console.error('Failed to process due reminders:', error);
      showNotification('Failed to process due reminders. Check console for details.', 'error');
    }
  };

  const handleMarkAsRead = async (id: number): Promise<void> => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDeleteNotification = async (id: number): Promise<void> => {
    try {
      await deleteNotification(id);
      showNotification('Notification deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      showNotification('Failed to delete notification. Check console for details.', 'error');
    }
  };

  const handleDeleteAllNotifications = async (): Promise<void> => {
    try {
      await deleteAllNotifications();
      showNotification('All notifications deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      showNotification('Failed to delete all notifications. Check console for details.', 'error');
    }
  };

  if (!userId) {
    return (
      <div className={pageClasses.container}>
        <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
          Please log in to view notifications and reminders.
        </div>
      </div>
    );
  }

  return (
    <div className={pageClasses.container}>
      <div className={pageClasses.header}>
        <h1 className={pageClasses.title} style={pageStyles.title}>
          Notifications & Reminders
        </h1>
        <p className={pageClasses.subtitle} style={pageStyles.subtitle}>
          Manage your reminders and view notifications
        </p>
      </div>

      <div className="flex gap-4 mb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'reminders'
              ? 'border-b-2'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'reminders' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            borderBottomColor: activeTab === 'reminders' ? 'var(--color-primary)' : 'transparent',
          }}
        >
          Reminders
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'notifications'
              ? 'border-b-2'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'notifications' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            borderBottomColor: activeTab === 'notifications' ? 'var(--color-primary)' : 'transparent',
          }}
        >
          Notifications
          {unreadCount > 0 && (
            <Badge variant="error" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </button>
      </div>

      {activeTab === 'reminders' && (
        <div>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              variant={showCreateForm ? 'primary' : 'outline'}
              size="md"
            >
              {showCreateForm ? 'Hide Form' : 'Create Reminder'}
            </Button>
            <Button
              onClick={handleProcessDueReminders}
              variant="success"
              size="md"
              disabled={remindersLoading}
            >
              Process Due Reminders
            </Button>
          </div>

          {showCreateForm && (
            <ReminderForm
              userId={userId}
              onSubmit={handleCreateReminder}
              loading={remindersLoading}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {remindersError && (
            <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'white' }}>
              {remindersError}
            </div>
          )}

          <ReminderList
            reminders={reminders}
            onUpdate={handleUpdateReminder}
            onDelete={handleDeleteReminder}
            loading={remindersLoading}
          />
        </div>
      )}

      {activeTab === 'notifications' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              {unreadCount > 0 && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {notifications.length > 0 && (
              <Button
                onClick={handleDeleteAllNotifications}
                variant="danger"
                size="md"
                disabled={notificationsLoading}
              >
                Delete All
              </Button>
            )}
          </div>

          {notificationsError && (
            <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'white' }}>
              {notificationsError}
            </div>
          )}

          <NotificationList
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            loading={notificationsLoading}
          />
        </div>
      )}
    </div>
  );
};


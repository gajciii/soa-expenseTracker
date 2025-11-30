import type { Notification } from '../../types';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  loading: boolean;
}

export const NotificationList = ({ notifications, onMarkAsRead, onDelete, loading }: NotificationListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
        Loading notifications...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
        No notifications found.
      </div>
    );
  }

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};


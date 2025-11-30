import { useState } from 'react';
import type { Notification } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useNotification } from '../../contexts/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  const { showNotification } = useNotification();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleMarkAsRead = async (): Promise<void> => {
    if (!notification.read) {
      try {
        await onMarkAsRead(notification.id);
        showNotification('Notification marked as read', 'success');
      } catch (error) {
      }
    }
  };

  const handleDelete = (): void => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    await onDelete(notification.id);
  };

  return (
    <Card className={`mb-4 ${!notification.read ? 'border-l-4' : ''}`} style={{
      borderLeftColor: !notification.read ? 'var(--color-primary)' : undefined,
    }}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {notification.title}
            </h3>
            {!notification.read && <Badge variant="info">New</Badge>}
            {notification.source && (
              <Badge variant="default">{notification.source}</Badge>
            )}
          </div>
          <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            {notification.body}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          {!notification.read && (
            <Button onClick={handleMarkAsRead} variant="success" size="sm">
              Mark as Read
            </Button>
          )}
          <Button onClick={handleDelete} variant="danger" size="sm">
            Delete
          </Button>
        </div>
      </div>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Notification"
        message="Are you sure you want to delete this notification?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  );
};


import { useState } from 'react';
import type { Reminder, UpdateReminderRequest } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useNotification } from '../../contexts/NotificationContext';

interface ReminderItemProps {
  reminder: Reminder;
  onUpdate: (id: number, data: UpdateReminderRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const ReminderItem = ({ reminder, onUpdate, onDelete }: ReminderItemProps) => {
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingMessage, setEditingMessage] = useState<string>(reminder.message);
  const [editingRemindAt, setEditingRemindAt] = useState<string>(
    new Date(reminder.remindAt).toISOString().slice(0, 16)
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleSave = async (): Promise<void> => {
    if (!editingMessage.trim()) {
      showNotification('Message cannot be empty', 'warning');
      return;
    }

    const remindAtDate = new Date(editingRemindAt);
    if (remindAtDate < new Date() && !reminder.processed) {
      showNotification('Reminder date must be in the future', 'warning');
      return;
    }

    try {
      await onUpdate(reminder.id, {
        message: editingMessage.trim(),
        remindAt: remindAtDate.toISOString(),
      });
      setIsEditing(false);
      showNotification('Reminder updated successfully', 'success');
    } catch (error) {
    }
  };

  const handleCancel = (): void => {
    setEditingMessage(reminder.message);
    setEditingRemindAt(new Date(reminder.remindAt).toISOString().slice(0, 16));
    setIsEditing(false);
  };

  const handleDelete = (): void => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    await onDelete(reminder.id);
  };

  const isOverdue = new Date(reminder.remindAt) < new Date() && !reminder.processed;
  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <Card className="mb-4">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Message
            </label>
            <Input
              type="text"
              value={editingMessage}
              onChange={(e) => setEditingMessage(e.target.value)}
              className="mb-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Remind At
            </label>
            <Input
              type="datetime-local"
              value={editingRemindAt}
              onChange={(e) => setEditingRemindAt(e.target.value)}
              min={minDate}
              className="mb-0"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="success" size="sm">
              Save
            </Button>
            <Button onClick={handleCancel} variant="secondary" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {reminder.message}
                </h3>
                {reminder.processed && <Badge variant="success">Processed</Badge>}
                {isOverdue && <Badge variant="error">Overdue</Badge>}
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Remind at: {new Date(reminder.remindAt).toLocaleString()}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                Created: {new Date(reminder.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(true)} variant="primary" size="sm">
                Edit
              </Button>
              <Button onClick={handleDelete} variant="danger" size="sm">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Reminder"
        message="Are you sure you want to delete this reminder?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  );
};


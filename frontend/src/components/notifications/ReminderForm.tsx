import { useState } from 'react';
import type { CreateReminderRequest } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNotification } from '../../contexts/NotificationContext';

interface ReminderFormProps {
  userId: string;
  onSubmit: (reminder: CreateReminderRequest) => Promise<void>;
  loading: boolean;
  onCancel?: () => void;
}

export const ReminderForm = ({ userId, onSubmit, loading, onCancel }: ReminderFormProps) => {
  const { showNotification } = useNotification();
  const [message, setMessage] = useState<string>('');
  const [remindAt, setRemindAt] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!message.trim()) {
      showNotification('Message is required', 'warning');
      return;
    }

    if (!remindAt) {
      showNotification('Reminder date is required', 'warning');
      return;
    }

    const remindAtDate = new Date(remindAt);
    if (remindAtDate < new Date()) {
      showNotification('Reminder date must be in the future', 'warning');
      return;
    }

    try {
      await onSubmit({
        userId,
        message: message.trim(),
        remindAt: remindAtDate.toISOString(),
      });
      setMessage('');
      setRemindAt('');
      if (onCancel) onCancel();
      showNotification('Reminder created successfully', 'success');
    } catch (error) {
    }
  };

  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <Card className="mb-6">
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
        Create New Reminder
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Message
          </label>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., Pay Netflix subscription"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Remind At
          </label>
          <Input
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
            min={minDate}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Reminder'}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};


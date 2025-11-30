import type { Reminder, UpdateReminderRequest } from '../../types';
import { ReminderItem } from './ReminderItem';

interface ReminderListProps {
  reminders: Reminder[];
  onUpdate: (id: number, data: UpdateReminderRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  loading: boolean;
}

export const ReminderList = ({ reminders, onUpdate, onDelete, loading }: ReminderListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
        Loading reminders...
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
        No reminders found. Create your first reminder!
      </div>
    );
  }

  return (
    <div>
      {reminders.map((reminder) => (
        <ReminderItem
          key={reminder.id}
          reminder={reminder}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};


import { useState, Fragment } from 'react';
import type { Subscription, UpdateSubscriptionRequest } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { Input } from '../ui/Input';

interface SubscriptionItemProps {
  subscription: Subscription;
  onUpdate: (data: UpdateSubscriptionRequest) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const SubscriptionItem = ({
  subscription,
  onUpdate,
  onDelete,
}: SubscriptionItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState<UpdateSubscriptionRequest>({
    name: subscription.name,
    amount: subscription.amount,
    currency: subscription.currency,
    interval: subscription.interval,
    startDate: subscription.startDate.includes('T') ? subscription.startDate.split('T')[0] : subscription.startDate,
    notificationOffsetDays: subscription.notificationOffsetDays,
  });

  const handleUpdate = async () => {
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const handleDelete = async () => {
    await onDelete();
    setShowDeleteModal(false);
  };

  return (
    <Fragment>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {isEditing ? (
            <div className="space-y-4 flex-1">
              <Input
                label="Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mb-0"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="mb-0"
                />
                <Input
                  label="Currency"
                  value={formData.currency || ''}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="mb-0"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Interval</label>
                <select
                  value={formData.interval || ''}
                  onChange={(e) => setFormData({ ...formData, interval: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'rgba(28, 15, 19, 0.1)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleUpdate}>
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Fragment>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  {subscription.name}
                </h3>
                <div className="text-sm mb-2" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
                  {subscription.amount} {subscription.currency} / {subscription.interval}
                </div>
                <div className="space-y-1 text-sm" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
                  <div>Next Run: {new Date(subscription.nextRunAt).toLocaleDateString()}</div>
                  {subscription.lastRunAt && (
                    <div>Last Run: {new Date(subscription.lastRunAt).toLocaleDateString()}</div>
                  )}
                  <div>Status: {subscription.isActive ? 'Active' : 'Inactive'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                  Delete
                </Button>
              </div>
            </Fragment>
          )}
        </div>
      </Card>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Subscription"
        message={`Are you sure you want to delete subscription "${subscription.name}"?`}
      />
    </Fragment>
  );
};


import { useState } from 'react';
import type { CreateSubscriptionRequest } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SubscriptionFormProps {
  onSubmit: (data: CreateSubscriptionRequest) => Promise<void>;
  loading: boolean;
  userId: string;
}

export const SubscriptionForm = ({ onSubmit, loading, userId }: SubscriptionFormProps) => {
  const [formData, setFormData] = useState<CreateSubscriptionRequest>({
    userId,
    name: '',
    amount: 0,
    currency: 'EUR',
    interval: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    notificationOffsetDays: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.amount <= 0) return;
    
    await onSubmit(formData);
    
    setFormData({
      userId,
      name: '',
      amount: 0,
      currency: 'EUR',
      interval: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      notificationOffsetDays: 3,
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Create New Subscription
          </h3>
        </div>

        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            required
          />

          <Input
            label="Currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Interval
          </label>
          <select
            value={formData.interval}
            onChange={(e) => setFormData({ ...formData, interval: e.target.value as any })}
            className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
            required
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          required
        />

        <Input
          label="Notification Offset Days"
          type="number"
          value={formData.notificationOffsetDays || 3}
          onChange={(e) => setFormData({ ...formData, notificationOffsetDays: parseInt(e.target.value) || 3 })}
        />

        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <Button 
            type="submit"
            variant="primary" 
            size="md" 
            disabled={!formData.name.trim() || formData.amount <= 0 || loading}
          >
            {loading ? 'Creating...' : 'Create Subscription'}
          </Button>
        </div>
      </form>
    </Card>
  );
};


import type { Subscription, UpdateSubscriptionRequest } from '../../types';
import { Card } from '../ui/Card';
import { SubscriptionItem } from './SubscriptionItem';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  onUpdate: (id: string, data: UpdateSubscriptionRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const SubscriptionList = ({
  subscriptions,
  loading,
  error,
  onUpdate,
  onDelete,
}: SubscriptionListProps) => {
  if (error) {
    return (
      <Card>
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-dark)', color: 'var(--color-text-primary)' }}>
          Error: {error}
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <div className="text-center py-12" style={{ color: 'var(--color-text-primary)' }}>Loading subscriptions...</div>
      </Card>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <div className="text-center py-12 italic" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
          No subscriptions found
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <SubscriptionItem
          key={subscription.id}
          subscription={subscription}
          onUpdate={(data) => onUpdate(subscription.id, data)}
          onDelete={() => onDelete(subscription.id)}
        />
      ))}
    </div>
  );
};


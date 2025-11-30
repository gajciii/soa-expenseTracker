import { useState } from 'react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { SubscriptionList } from '../components/subscriptions/SubscriptionList';
import { SubscriptionForm } from '../components/subscriptions/SubscriptionForm';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { pageStyles, pageClasses } from '../styles/pageStyles';
import type { CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../types';

export const SubscriptionsPage = () => {
  const { user } = useAuth();
  const userId = user?.user_id || '';
  const { showNotification } = useNotification();
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const {
    subscriptions,
    loading,
    error,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions(userId);

  const handleCreate = async (data: CreateSubscriptionRequest) => {
    try {
      await createSubscription(data);
      showNotification('Subscription created successfully!', 'success');
      setShowCreateForm(false);
    } catch (error) {
      showNotification('Failed to create subscription', 'error');
    }
  };

  const handleUpdate = async (id: string, data: UpdateSubscriptionRequest) => {
    try {
      await updateSubscription(id, data);
      showNotification('Subscription updated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to update subscription', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscription(id);
      showNotification('Subscription deleted successfully!', 'success');
    } catch (error) {
      showNotification('Failed to delete subscription', 'error');
    }
  };

  return (
    <div className={pageClasses.container}>
      <div className={pageClasses.header}>
        <h1 className={pageClasses.title} style={pageStyles.title}>
          Subscriptions
        </h1>
        <p className={pageClasses.subtitle} style={pageStyles.subtitle}>
          Manage your recurring subscriptions
        </p>
      </div>

      <div className={pageClasses.toggleContainer}>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? 'primary' : 'outline'}
          size="md"
        >
          {showCreateForm ? 'Hide Create Form' : 'Create New Subscription'}
        </Button>
      </div>

      {showCreateForm && (
        <div className={pageClasses.formContainer}>
          <SubscriptionForm onSubmit={handleCreate} loading={loading} userId={userId} />
        </div>
      )}

      <SubscriptionList
        subscriptions={subscriptions}
        loading={loading}
        error={error}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};


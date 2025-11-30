import { useState } from 'react';
import type { WeeklyAnalyticsResponse } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';

interface WeeklyAnalyticsProps {
  analytics: WeeklyAnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  onRecompute: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export const WeeklyAnalytics = ({
  analytics,
  loading,
  error,
  onRecompute,
  onDelete,
}: WeeklyAnalyticsProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recomputing, setRecomputing] = useState(false);

  const handleRecompute = async () => {
    setRecomputing(true);
    try {
      await onRecompute();
    } finally {
      setRecomputing(false);
    }
  };

  const handleDelete = async () => {
    await onDelete();
    setShowDeleteModal(false);
  };

  const totalSpent = analytics?.days.reduce((sum, day) => sum + day.spent, 0) || 0;

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Weekly Analytics (Last 7 Days)
        </h2>
        {analytics && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecompute}
              disabled={recomputing}
            >
              {recomputing ? 'Recomputing...' : 'Recompute'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-dark)', color: 'var(--color-text-primary)' }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--color-text-primary)' }}>Loading analytics...</div>
      ) : analytics ? (
        <div>
          <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(28, 15, 19, 0.1)', border: '1px solid var(--color-border)', backdropFilter: 'blur(10px)' }}>
            <div className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Total Spent: {totalSpent.toFixed(2)}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
              Created: {new Date(analytics.created_at).toLocaleDateString()}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
              Updated: {new Date(analytics.updated_at).toLocaleDateString()}
            </div>
          </div>
          <div className="space-y-2">
            {analytics.days.map((day, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(28, 15, 19, 0.1)', border: '1px solid var(--color-border)', backdropFilter: 'blur(10px)' }}
              >
                <div style={{ color: 'var(--color-text-primary)' }}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {day.spent.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 italic" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
          No weekly analytics data. Generate analytics first.
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Weekly Analytics"
        message="Are you sure you want to delete weekly analytics data?"
      />
    </Card>
  );
};


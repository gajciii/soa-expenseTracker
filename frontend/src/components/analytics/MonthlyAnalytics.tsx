import { useState } from 'react';
import type { MonthlyAnalyticsResponse } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';

interface MonthlyAnalyticsProps {
  analytics: MonthlyAnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  month: string;
  onMonthChange: (month: string) => void;
  onRecompute: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export const MonthlyAnalytics = ({
  analytics,
  loading,
  error,
  month,
  onMonthChange,
  onRecompute,
  onDelete,
}: MonthlyAnalyticsProps) => {
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

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Monthly Analytics
        </h2>
        <div className="flex gap-2">
          <input
            type="month"
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'rgba(28, 15, 19, 0.1)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              backdropFilter: 'blur(10px)',
            }}
          />
          {analytics && (
            <>
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
            </>
          )}
        </div>
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
            <div className="text-sm" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
              Created: {new Date(analytics.created_at).toLocaleDateString()}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
              Updated: {new Date(analytics.updated_at).toLocaleDateString()}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th className="text-left py-3 px-4" style={{ color: 'var(--color-text-primary)' }}>Category</th>
                  <th className="text-right py-3 px-4" style={{ color: 'var(--color-text-primary)' }}>Budget</th>
                  <th className="text-right py-3 px-4" style={{ color: 'var(--color-text-primary)' }}>Spent</th>
                  <th className="text-right py-3 px-4" style={{ color: 'var(--color-text-primary)' }}>Remaining</th>
                </tr>
              </thead>
              <tbody>
                {analytics.rows.map((row, index) => {
                  const remaining = row.budget - row.spent;
                  const isOverBudget = remaining < 0;
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="py-3 px-4" style={{ color: 'var(--color-text-primary)' }}>{row.category_name}</td>
                      <td className="text-right py-3 px-4" style={{ color: 'var(--color-text-primary)' }}>
                        {row.budget.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4" style={{ color: 'var(--color-text-primary)' }}>
                        {row.spent.toFixed(2)}
                      </td>
                      <td className={`text-right py-3 px-4 ${isOverBudget ? 'font-bold' : ''}`} style={{ color: 'var(--color-text-primary)' }}>
                        {remaining.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 italic" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
          No analytics data for this month. Generate analytics first.
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Monthly Analytics"
        message={`Are you sure you want to delete analytics for ${month}?`}
      />
    </Card>
  );
};


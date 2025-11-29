import { useState } from 'react';
import type { ExpenseParams } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useNotification } from '../../contexts/NotificationContext';

interface ReportFormProps {
  onSubmit: (params: ExpenseParams) => Promise<void>;
  loading: boolean;
  onDeleteAll: () => Promise<void>;
}

export const ReportForm = ({ onSubmit, loading, onDeleteAll }: ReportFormProps) => {
  const { showNotification } = useNotification();
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (dateFrom && dateTo && dateFrom > dateTo) {
      showNotification('Date From must be before or equal to Date To', 'warning');
      return;
    }
    
    const params: ExpenseParams = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    
    await onSubmit(params);
  };

  const handleDeleteAll = (): void => {
    setShowDeleteAllConfirm(true);
  };

  const handleConfirmDeleteAll = async (): Promise<void> => {
    await onDeleteAll();
  };

  return (
    <Card className="mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Create Report</h2>
        <Button
          onClick={handleDeleteAll}
          disabled={loading}
          variant="danger"
          size="sm"
        >
          Delete All Reports
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
          <div className="w-full sm:flex-1 sm:min-w-[200px]">
            <Input
              label="Date From"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mb-0"
            />
          </div>
          <div className="w-full sm:flex-1 sm:min-w-[200px]">
            <Input
              label="Date To"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mb-0"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            variant="success"
            size="lg"
            className="w-full sm:w-auto"
          >
            {loading ? 'Creating...' : 'Create Report'}
          </Button>
        </div>
      </form>
      <ConfirmModal
        isOpen={showDeleteAllConfirm}
        onClose={() => setShowDeleteAllConfirm(false)}
        onConfirm={handleConfirmDeleteAll}
        title="Delete All Reports"
        message="Are you sure you want to delete ALL reports? This cannot be undone!"
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  );
};

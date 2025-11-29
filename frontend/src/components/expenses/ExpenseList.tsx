import { useState } from 'react';
import type { ExpenseResponse, ExpenseParams, Item } from '../../types';
import { ExpenseItem } from './ExpenseItem';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useNotification } from '../../contexts/NotificationContext';

interface ExpenseListProps {
  expenses: ExpenseResponse[];
  loading: boolean;
  error: string | null;
  onFilter: (params: ExpenseParams) => void;
  onUpdateDescription: (expenseId: string, description: string) => Promise<void>;
  onUpdateItem: (expenseId: string, itemId: string, item: Item) => Promise<void>;
  onDelete: (expenseId: string) => Promise<void>;
  onDeleteAll: () => Promise<void>;
}

export const ExpenseList = ({
  expenses,
  loading,
  error,
  onFilter,
  onUpdateDescription,
  onUpdateItem,
  onDelete,
  onDeleteAll,
}: ExpenseListProps) => {
  const { showNotification } = useNotification();
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState<boolean>(false);

  const handleFilter = (): void => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      showNotification('Date From must be before or equal to Date To', 'warning');
      return;
    }
    
    const params: ExpenseParams = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    onFilter(params);
  };

  const handleDeleteAll = (): void => {
    setShowDeleteAllConfirm(true);
  };

  const handleConfirmDeleteAll = async (): Promise<void> => {
    await onDeleteAll();
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Expenses</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleFilter}
            disabled={loading}
            variant="primary"
            size="sm"
          >
            Filter
          </Button>
          <Button
            onClick={handleDeleteAll}
            disabled={loading}
            variant="danger"
            size="sm"
          >
            Delete All
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-dark)', color: 'var(--color-text-primary)' }}>
          Error: {error}
        </div>
      )}
      
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4 items-end">
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
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--color-text-primary)' }}>Loading expenses...</div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Expenses ({expenses.length})
          </h3>
          {expenses.length === 0 ? (
            <div className="text-center py-12 italic" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
              No expenses found
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <ExpenseItem
                  key={expense.expense_id || index}
                  expense={expense}
                  onUpdateDescription={onUpdateDescription}
                  onUpdateItem={onUpdateItem}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <ConfirmModal
        isOpen={showDeleteAllConfirm}
        onClose={() => setShowDeleteAllConfirm(false)}
        onConfirm={handleConfirmDeleteAll}
        title="Delete All Expenses"
        message="Are you sure you want to delete ALL expenses? This cannot be undone!"
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  );
};

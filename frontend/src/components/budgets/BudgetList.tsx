import { useState } from 'react';
import type { BudgetResponse, BudgetRequest, CategoryResponse } from '../../types';
import { BudgetItem } from './BudgetItem';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface BudgetListProps {
  budgets: BudgetResponse[];
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
  onFilter: (month?: string) => void;
  onUpdate: (budgetId: string, budgetData: BudgetRequest) => Promise<void>;
  onDelete: (budgetId: string) => Promise<void>;
}

export const BudgetList = ({
  budgets,
  categories,
  loading,
  error,
  onFilter,
  onUpdate,
  onDelete,
}: BudgetListProps) => {
  const [month, setMonth] = useState<string>('');

  const handleFilter = (): void => {
    onFilter(month || undefined);
  };

  const handleClearFilter = (): void => {
    setMonth('');
    onFilter(undefined);
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Budgets</h2>
      </div>
      
      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-dark)', color: 'var(--color-text-primary)' }}>
          Error: {error}
        </div>
      )}
      
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4 items-end">
        <div className="w-full sm:flex-1 sm:min-w-[200px]">
          <Input
            label="Filter by Month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mb-0"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleFilter}
            disabled={loading}
            variant="primary"
            size="sm"
          >
            Filter
          </Button>
          {month && (
            <Button
              onClick={handleClearFilter}
              disabled={loading}
              variant="secondary"
              size="sm"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--color-text-primary)' }}>Loading budgets...</div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Budgets ({budgets.length})
          </h3>
          {budgets.length === 0 ? (
            <div className="text-center py-12 italic" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
              No budgets found
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => (
                <BudgetItem
                  key={budget.budget_id}
                  budget={budget}
                  categories={categories}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};


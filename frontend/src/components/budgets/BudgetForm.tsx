import { useState } from 'react';
import type { BudgetRequest, CategoryResponse } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNotification } from '../../contexts/NotificationContext';

interface BudgetFormProps {
  onSubmit: (budget: BudgetRequest) => Promise<void>;
  loading: boolean;
  categories: CategoryResponse[];
}

export const BudgetForm = ({ onSubmit, loading, categories }: BudgetFormProps) => {
  const { showNotification } = useNotification();
  const [month, setMonth] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [limit, setLimit] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!month.trim()) {
      showNotification('Month is required', 'warning');
      return;
    }
    
    if (!categoryId) {
      showNotification('Category is required', 'warning');
      return;
    }
    
    if (!limit || parseFloat(limit) <= 0) {
      showNotification('Limit must be greater than 0', 'warning');
      return;
    }
    
    const budgetData: BudgetRequest = {
      month: month.trim(),
      category_id: categoryId,
      limit: parseFloat(limit),
    };
    
    await onSubmit(budgetData);
    
    setMonth('');
    setCategoryId('');
    setLimit('');
  };

  return (
    <Card>
      <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Create/Update Budget</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />

        <div className="w-full">
          <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Category
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 focus:ring-palette-blue-grey"
            style={{
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
            }}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />

        <Button
          type="submit"
          disabled={loading}
          variant="success"
          size="lg"
          className="w-full sm:w-auto"
        >
          {loading ? 'Saving...' : 'Save Budget'}
        </Button>
      </form>
    </Card>
  );
};


import { useState, Fragment } from 'react';
import type { BudgetResponse, BudgetRequest, CategoryResponse } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useNotification } from '../../contexts/NotificationContext';

interface BudgetItemProps {
  budget: BudgetResponse;
  categories: CategoryResponse[];
  onUpdate: (budgetId: string, budgetData: BudgetRequest) => Promise<void>;
  onDelete: (budgetId: string) => Promise<void>;
}

export const BudgetItem = ({ budget, categories, onUpdate, onDelete }: BudgetItemProps) => {
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingMonth, setEditingMonth] = useState<string>(budget.month);
  const [editingCategoryId, setEditingCategoryId] = useState<string>(budget.category_id);
  const [editingLimit, setEditingLimit] = useState<string>(budget.limit);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleSave = async (): Promise<void> => {
    if (!editingMonth.trim()) {
      showNotification('Month is required', 'warning');
      return;
    }
    if (!editingCategoryId) {
      showNotification('Category is required', 'warning');
      return;
    }
    if (!editingLimit || parseFloat(editingLimit) <= 0) {
      showNotification('Limit must be greater than 0', 'warning');
      return;
    }
    await onUpdate(budget.budget_id, {
      month: editingMonth.trim(),
      category_id: editingCategoryId,
      limit: parseFloat(editingLimit),
    });
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setEditingMonth(budget.month);
    setEditingCategoryId(budget.category_id);
    setEditingLimit(budget.limit);
    setIsEditing(false);
  };

  const handleDelete = (): void => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    await onDelete(budget.budget_id);
  };

  const categoryName = categories.find(c => c.category_id === budget.category_id)?.name || 'Unknown';

  return (
    <Fragment>
      <Card>
        <div className="flex flex-col gap-4">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                type="month"
                label="Month"
                value={editingMonth}
                onChange={(e) => setEditingMonth(e.target.value)}
                className="mb-0"
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
                  value={editingCategoryId}
                  onChange={(e) => setEditingCategoryId(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                type="number"
                label="Limit"
                value={editingLimit}
                onChange={(e) => setEditingLimit(e.target.value)}
                min="0"
                step="0.01"
                className="mb-0"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} variant="success" size="sm">
                  Save
                </Button>
                <Button onClick={handleCancel} variant="secondary" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Fragment>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    {categoryName} - {budget.month}
                  </h3>
                  <div className="text-sm" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
                    <p>Limit: ${parseFloat(budget.limit).toFixed(2)}</p>
                    <p>Created: {budget.created_at}</p>
                    <p>Updated: {budget.updated_at}</p>
                    <p className="text-xs mt-1">ID: {budget.budget_id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(true)} variant="primary" size="sm">
                    Edit
                  </Button>
                  <Button onClick={handleDelete} variant="danger" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </Card>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Budget"
        message="Are you sure you want to delete this budget?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Fragment>
  );
};


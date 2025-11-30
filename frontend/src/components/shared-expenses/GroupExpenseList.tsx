import type { GroupExpenseResponse, GroupExpenseRequest } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useState } from 'react';

interface GroupExpenseListProps {
  expenses: GroupExpenseResponse[];
  loading: boolean;
  error: string | null;
  onUpdate: (expenseId: string, data: GroupExpenseRequest) => Promise<void>;
  onDelete: (expenseId: string) => Promise<void>;
}

export const GroupExpenseList = ({
  expenses,
  loading,
  error,
  onUpdate,
  onDelete,
}: GroupExpenseListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GroupExpenseRequest>({
    description: '',
    payments: {},
  });

  const startEdit = (expense: GroupExpenseResponse) => {
    setEditingId(expense.id);
    setFormData({
      description: expense.description,
      payments: expense.payments,
    });
  };

  const handleUpdate = async (expenseId: string) => {
    try {
      await onUpdate(expenseId, formData);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <Card>
      <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
        Group Expenses
      </h2>

      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-dark)', color: 'var(--color-text-primary)' }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--color-text-primary)' }}>Loading expenses...</div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12 italic" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
          No expenses found
        </div>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 rounded-lg border"
              style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              {editingId === expense.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2" style={{ color: 'var(--color-text-primary)' }}>Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => handleUpdate(expense.id)}>
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {expense.description}
                      </h3>
                      <div className="text-sm mt-1" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
                        Total: {expense.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(expense)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteId(expense.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {Object.entries(expense.payments).map(([userId, amount]) => (
                      <div key={userId} className="text-sm" style={{ color: 'var(--color-text-primary)', opacity: 0.8 }}>
                        {userId}: {amount.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
      />
    </Card>
  );
};


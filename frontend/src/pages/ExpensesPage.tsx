import { useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useSharedExpenses } from '../hooks/useSharedExpenses';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import type { ExpenseRequest, ExpenseParams, Item, ExpenseResponse, GroupExpenseRequest } from '../types';

export const ExpensesPage = () => {
  const { user } = useAuth();
  const userId = user?.user_id || '';
  const { showNotification } = useNotification();
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [currentFilterParams, setCurrentFilterParams] = useState<ExpenseParams>({});
  const {
    expenses,
    loading,
    error,
    createExpense,
    deleteExpense,
    deleteAllExpenses,
    updateItem,
    updateDescription,
    fetchExpenses,
  } = useExpenses(userId);
  
  const { groups, addGroupExpense, fetchUserGroups } = useSharedExpenses(userId);

  useEffect(() => {
    if (userId) {
      fetchExpenses();
    }
  }, [userId, fetchExpenses]);

  const handleCreateExpense = async (expenseData: ExpenseRequest): Promise<void> => {
    try {
      await createExpense(expenseData);
      await fetchExpenses(currentFilterParams);
      showNotification('Expense created successfully!', 'success');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create expense:', error);
      showNotification('Failed to create expense', 'error');
    }
  };

  const handleUpdateDescription = async (expenseId: string, description: string): Promise<void> => {
    try {
      await updateDescription(expenseId, description);
      alert('Description updated successfully!');
    } catch (error) {
      console.error('Failed to update description:', error);
      alert('Failed to update description. Check console for details.');
    }
  };

  const handleUpdateItem = async (expenseId: string, itemId: string, item: Item): Promise<void> => {
    try {
      await updateItem(expenseId, itemId, item);
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Failed to update item:', error);
      alert('Failed to update item. Check console for details.');
    }
  };

  const handleDelete = async (expenseId: string): Promise<void> => {
    try {
      await deleteExpense(expenseId);
      alert('Expense deleted successfully!');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      alert('Failed to delete expense. Check console for details.');
    }
  };

  const handleDeleteAll = async (): Promise<void> => {
    try {
      await deleteAllExpenses();
      alert('All expenses deleted successfully!');
    } catch (error) {
      console.error('Failed to delete all expenses:', error);
      alert('Failed to delete all expenses. Check console for details.');
    }
  };

  const handleFilter = (params: ExpenseParams): void => {
    setCurrentFilterParams(params);
    fetchExpenses(params);
  };

  const handleAddToSharedExpense = async (expense: ExpenseResponse, groupId: string): Promise<void> => {
    try {
      const payments: Record<string, number> = {};
      
      payments[userId] = expense.total_price;
      
      const groupExpenseData: GroupExpenseRequest = {
        description: expense.description,
        payments: payments,
      };
      
      await addGroupExpense(groupId, groupExpenseData);
      await fetchUserGroups();
      showNotification('Expense added to shared group successfully!', 'success');
    } catch (error) {
      console.error('Failed to add expense to shared group:', error);
      showNotification('Failed to add expense to shared group', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Your Ultimate Expense Management Solution
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-primary)' }}>
          Track and manage all your expenses in one unified platform
        </p>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? 'primary' : 'outline'}
          size="md"
        >
          {showCreateForm ? 'Hide Create Form' : 'Create New Expense'}
        </Button>
      </div>
      {showCreateForm && (
        <div className="mb-8">
          <ExpenseForm onSubmit={handleCreateExpense} loading={loading} />
        </div>
      )}
      <ExpenseList
        expenses={expenses}
        loading={loading}
        error={error}
        onFilter={handleFilter}
        onUpdateDescription={handleUpdateDescription}
        onUpdateItem={handleUpdateItem}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}
        onAddToSharedExpense={handleAddToSharedExpense}
        groups={groups}
      />
    </div>
  );
};

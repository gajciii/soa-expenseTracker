import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { Button } from '../components/ui/Button';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { pageStyles, pageClasses } from '../styles/pageStyles';
import type { ExpenseRequest, ExpenseParams, Item } from '../types';

export const ExpensesPage = () => {
  const { user } = useAuth();
  const userId = user?.user_id || '';
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const { showNotification } = useNotification();
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

  const handleCreateExpense = async (expenseData: ExpenseRequest): Promise<void> => {
    try {
      await createExpense(expenseData);
      showNotification('Expense created successfully!', 'success');
    } catch (error) {
      console.error('Failed to create expense:', error);
      showNotification('Failed to create expense. Check console for details.', 'error');
    }
  };

  const handleUpdateDescription = async (expenseId: string, description: string): Promise<void> => {
    try {
      await updateDescription(expenseId, description);
      showNotification('Description updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update description:', error);
      showNotification('Failed to update description. Check console for details.', 'error');
    }
  };

  const handleUpdateItem = async (expenseId: string, itemId: string, item: Item): Promise<void> => {
    try {
      await updateItem(expenseId, itemId, item);
      showNotification('Item updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update item:', error);
      showNotification('Failed to update item. Check console for details.', 'error');
    }
  };

  const handleDelete = async (expenseId: string): Promise<void> => {
    try {
      await deleteExpense(expenseId);
      showNotification('Expense deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      showNotification('Failed to delete expense. Check console for details.', 'error');
    }
  };

  const handleDeleteAll = async (): Promise<void> => {
    try {
      await deleteAllExpenses();
      showNotification('All expenses deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete all expenses:', error);
      showNotification('Failed to delete all expenses. Check console for details.', 'error');
    }
  };

  const handleFilter = (params: ExpenseParams): void => {
    fetchExpenses(params);
  };

  return (
    <div className={pageClasses.container}>
      <div className={pageClasses.header}>
        <h1 className={pageClasses.title} style={pageStyles.title}>
          Your Ultimate Expense Management Solution
        </h1>
        <p className={pageClasses.subtitle} style={pageStyles.subtitle}>
          Track and manage all your expenses in one unified platform
        </p>
      </div>
      <div className={pageClasses.toggleContainer}>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? 'primary' : 'outline'}
          size="md"
        >
          {showCreateForm ? 'Hide Create Form' : 'Create New Expense'}
        </Button>
      </div>
      {showCreateForm && (
        <div className={pageClasses.formContainer}>
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
      />
    </div>
  );
};

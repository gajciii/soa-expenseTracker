import { useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useSharedExpenses } from '../hooks/useSharedExpenses';
import { useCategories } from '../hooks/useCategories';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { CategoryForm } from '../components/categories/CategoryForm';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import type { ExpenseRequest, ExpenseParams, Item, ExpenseResponse, GroupExpenseRequest, CategoryRequest } from '../types';

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
  const { categories, createCategory, fetchCategories, loading: categoriesLoading } = useCategories(userId);

  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      fetchExpenses();
      fetchCategories();
    }
  }, [userId, fetchExpenses, fetchCategories]);

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
      showNotification('Description updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update description:', error);
      showNotification('Failed to update description', 'error');
    }
  };

  const handleUpdateItem = async (expenseId: string, itemId: string, item: Item): Promise<void> => {
    try {
      await updateItem(expenseId, itemId, item);
      showNotification('Item updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update item:', error);
      showNotification('Failed to update item', 'error');
    }
  };

  const handleDelete = async (expenseId: string): Promise<void> => {
    try {
      await deleteExpense(expenseId);
      showNotification('Expense deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      showNotification('Failed to delete expense', 'error');
    }
  };

  const handleDeleteAll = async (): Promise<void> => {
    try {
      await deleteAllExpenses();
      showNotification('All expenses deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete all expenses:', error);
      showNotification('Failed to delete all expenses', 'error');
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

  const handleCreateCategory = async (categoryData: CategoryRequest): Promise<void> => {
    try {
      await createCategory(categoryData);
      showNotification('Category created successfully!', 'success');
      setShowCreateCategoryForm(false);
    } catch (error) {
      console.error('Failed to create category:', error);
      showNotification('Failed to create category', 'error');
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
        <Button
          onClick={() => setShowCreateCategoryForm(!showCreateCategoryForm)}
          variant={showCreateCategoryForm ? 'primary' : 'outline'}
          size="md"
        >
          {showCreateCategoryForm ? 'Hide Create Category' : 'Create New Category'}
        </Button>
      </div>
      {showCreateCategoryForm && (
        <div className="mb-8">
          <CategoryForm onSubmit={handleCreateCategory} loading={categoriesLoading} />
        </div>
      )}
      {showCreateForm && (
        <div className="mb-8">
          <ExpenseForm onSubmit={handleCreateExpense} loading={loading} categories={categories} />
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

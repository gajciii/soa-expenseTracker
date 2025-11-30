import { useState } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';
import { BudgetForm } from '../components/budgets/BudgetForm';
import { BudgetList } from '../components/budgets/BudgetList';
import { Button } from '../components/ui/Button';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { pageStyles, pageClasses } from '../styles/pageStyles';
import type { BudgetRequest } from '../types';

export const BudgetsPage = () => {
  const { user } = useAuth();
  const userId = user?.user_id || '';
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const { showNotification } = useNotification();
  const {
    budgets,
    loading,
    error,
    fetchBudgets,
    upsertBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets(userId);
  const { categories } = useCategories(userId);

  const handleCreateBudget = async (budgetData: BudgetRequest): Promise<void> => {
    try {
      await upsertBudget(budgetData);
      showNotification('Budget created/updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to create/update budget:', error);
      showNotification('Failed to create/update budget. Check console for details.', 'error');
    }
  };

  const handleUpdateBudget = async (budgetId: string, budgetData: BudgetRequest): Promise<void> => {
    try {
      await updateBudget(budgetId, budgetData);
      showNotification('Budget updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update budget:', error);
      showNotification('Failed to update budget. Check console for details.', 'error');
    }
  };

  const handleDelete = async (budgetId: string): Promise<void> => {
    try {
      await deleteBudget(budgetId);
      showNotification('Budget deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete budget:', error);
      showNotification('Failed to delete budget. Check console for details.', 'error');
    }
  };

  const handleFilter = (month?: string): void => {
    fetchBudgets(month);
  };

  return (
    <div className={pageClasses.container}>
      <div className={pageClasses.header}>
        <h1 className={pageClasses.title} style={pageStyles.title}>
          Budget Management
        </h1>
        <p className={pageClasses.subtitle} style={pageStyles.subtitle}>
          Set and manage your monthly budgets by category
        </p>
      </div>
      <div className={pageClasses.toggleContainer}>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? 'primary' : 'outline'}
          size="md"
        >
          {showCreateForm ? 'Hide Create Form' : 'Create/Update Budget'}
        </Button>
      </div>
      {showCreateForm && (
        <div className={pageClasses.formContainer}>
          <BudgetForm onSubmit={handleCreateBudget} loading={loading} categories={categories} />
        </div>
      )}
      <BudgetList
        budgets={budgets}
        categories={categories}
        loading={loading}
        error={error}
        onFilter={handleFilter}
        onUpdate={handleUpdateBudget}
        onDelete={handleDelete}
      />
    </div>
  );
};


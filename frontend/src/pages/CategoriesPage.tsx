import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { CategoryForm } from '../components/categories/CategoryForm';
import { CategoryList } from '../components/categories/CategoryList';
import { Button } from '../components/ui/Button';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { pageStyles, pageClasses } from '../styles/pageStyles';
import type { CategoryRequest } from '../types';

export const CategoriesPage = () => {
  const { user } = useAuth();
  const userId = user?.user_id || '';
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const { showNotification } = useNotification();
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories(userId);

  const handleCreateCategory = async (categoryData: CategoryRequest): Promise<void> => {
    try {
      await createCategory(categoryData);
      showNotification('Category created successfully!', 'success');
    } catch (error) {
      console.error('Failed to create category:', error);
      showNotification('Failed to create category. Check console for details.', 'error');
    }
  };

  const handleUpdateCategory = async (categoryId: string, categoryData: CategoryRequest): Promise<void> => {
    try {
      await updateCategory(categoryId, categoryData);
      showNotification('Category updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update category:', error);
      showNotification('Failed to update category. Check console for details.', 'error');
    }
  };

  const handleDelete = async (categoryId: string): Promise<void> => {
    try {
      await deleteCategory(categoryId);
      showNotification('Category deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete category:', error);
      showNotification('Failed to delete category. Check console for details.', 'error');
    }
  };

  return (
    <div className={pageClasses.container}>
      <div className={pageClasses.header}>
        <h1 className={pageClasses.title} style={pageStyles.title}>
          Category Management
        </h1>
        <p className={pageClasses.subtitle} style={pageStyles.subtitle}>
          Create and manage your expense categories
        </p>
      </div>
      <div className={pageClasses.toggleContainer}>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? 'primary' : 'outline'}
          size="md"
        >
          {showCreateForm ? 'Hide Create Form' : 'Create New Category'}
        </Button>
      </div>
      {showCreateForm && (
        <div className={pageClasses.formContainer}>
          <CategoryForm onSubmit={handleCreateCategory} loading={loading} />
        </div>
      )}
      <CategoryList
        categories={categories}
        loading={loading}
        error={error}
        onUpdate={handleUpdateCategory}
        onDelete={handleDelete}
      />
    </div>
  );
};


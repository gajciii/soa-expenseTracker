import { useState } from 'react';
import type { CategoryRequest } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNotification } from '../../contexts/NotificationContext';

interface CategoryFormProps {
  onSubmit: (category: CategoryRequest) => Promise<void>;
  loading: boolean;
}

export const CategoryForm = ({ onSubmit, loading }: CategoryFormProps) => {
  const { showNotification } = useNotification();
  const [name, setName] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!name.trim()) {
      showNotification('Category name is required', 'warning');
      return;
    }
    
    const categoryData: CategoryRequest = {
      name: name.trim(),
    };
    
    await onSubmit(categoryData);
    
    setName('');
  };

  return (
    <Card>
      <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Create New Category</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Category Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
        />

        <Button
          type="submit"
          disabled={loading}
          variant="success"
          size="lg"
          className="w-full sm:w-auto"
        >
          {loading ? 'Creating...' : 'Create Category'}
        </Button>
      </form>
    </Card>
  );
};


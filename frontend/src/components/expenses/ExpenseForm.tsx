import { useState } from 'react';
import type { Item, ExpenseRequest, CategoryResponse } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNotification } from '../../contexts/NotificationContext';

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseRequest) => Promise<void>;
  loading: boolean;
  categories?: CategoryResponse[];
}

export const ExpenseForm = ({ onSubmit, loading, categories = [] }: ExpenseFormProps) => {
  const { showNotification } = useNotification();
  const [description, setDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [items, setItems] = useState<Item[]>([
    { item_id: '', item_name: '', item_price: 0, item_quantity: 1 }
  ]);

  const addItem = (): void => {
    setItems([...items, { item_id: '', item_name: '', item_price: 0, item_quantity: 1 }]);
  };

  const removeItem = (index: number): void => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Item, value: string | number): void => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!description.trim()) {
      showNotification('Description is required', 'warning');
      return;
    }
    
    if (items.length === 0) {
      showNotification('At least one item is required', 'warning');
      return;
    }
    
    for (const item of items) {
      if (!item.item_name.trim()) {
        showNotification('Item name is required', 'warning');
        return;
      }
      if (item.item_price <= 0) {
        showNotification('Item price must be greater than 0', 'warning');
        return;
      }
      if (item.item_quantity <= 0) {
        showNotification('Item quantity must be greater than 0', 'warning');
        return;
      }
    }
    
    const expenseData: ExpenseRequest = {
      description,
      items: items.map(item => ({
        item_id: '',
        item_name: item.item_name,
        item_price: item.item_price,
        item_quantity: item.item_quantity,
      })),
      category_id: categoryId || undefined,
    };
    
    await onSubmit(expenseData);
    
    setDescription('');
    setCategoryId('');
    setItems([{ item_id: '', item_name: '', item_price: 0, item_quantity: 1 }]);
  };

  return (
    <Card>
      <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Create New Expense</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter expense description"
          required
        />

        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Category (Optional)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              autoComplete="off"
              data-lpignore="true"
              style={{
                backgroundColor: 'rgba(28, 15, 19, 0.1)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <option value="">-- No category --</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Items:</label>
            <Button
              type="button"
              onClick={addItem}
              variant="success"
              size="sm"
            >
              + Add Item
            </Button>
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="rounded-lg p-4" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-center">
                  <Input
                    type="text"
                    placeholder="Item name"
                    value={item.item_name}
                    onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                    className="mb-0"
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.item_price || ''}
                    onChange={(e) => updateItem(index, 'item_price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="mb-0"
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={item.item_quantity || ''}
                    onChange={(e) => updateItem(index, 'item_quantity', parseInt(e.target.value) || 1)}
                    min="1"
                    className="mb-0"
                    required
                  />
                  <div className="font-bold text-right" style={{ color: 'var(--color-text-primary)' }}>
                    {`$${((item.item_price || 0) * (item.item_quantity || 1)).toFixed(2)}`}
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      variant="danger"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="success"
          size="lg"
          className="w-full sm:w-auto"
        >
          {loading ? 'Creating...' : 'Create Expense'}
        </Button>
      </form>
    </Card>
  );
};

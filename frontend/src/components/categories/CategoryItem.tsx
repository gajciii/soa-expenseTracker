import { useState, Fragment } from 'react';
import type { CategoryResponse, CategoryRequest } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useNotification } from '../../contexts/NotificationContext';

interface CategoryItemProps {
  category: CategoryResponse;
  onUpdate: (categoryId: string, categoryData: CategoryRequest) => Promise<void>;
  onDelete: (categoryId: string) => Promise<void>;
}

export const CategoryItem = ({ category, onUpdate, onDelete }: CategoryItemProps) => {
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<string>(category.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleSave = async (): Promise<void> => {
    if (!editingName.trim()) {
      showNotification('Category name cannot be empty', 'warning');
      return;
    }
    await onUpdate(category.category_id, { name: editingName.trim() });
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setEditingName(category.name);
    setIsEditing(false);
  };

  const handleDelete = (): void => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    await onDelete(category.category_id);
  };

  return (
    <Fragment>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {isEditing ? (
            <div className="flex gap-2 items-center flex-1">
              <Input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="mb-0 flex-1"
              />
              <Button onClick={handleSave} variant="success" size="sm">
                Save
              </Button>
              <Button onClick={handleCancel} variant="secondary" size="sm">
                Cancel
              </Button>
            </div>
          ) : (
            <Fragment>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  {category.name}
                </h3>
                <div className="text-sm" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
                  <p>Created: {category.created_at}</p>
                  <p>Updated: {category.updated_at}</p>
                  <p className="text-xs mt-1">ID: {category.category_id}</p>
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
            </Fragment>
          )}
        </div>
      </Card>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Fragment>
  );
};


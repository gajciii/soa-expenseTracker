import type { CategoryResponse, CategoryRequest } from '../../types';
import { CategoryItem } from './CategoryItem';
import { Card } from '../ui/Card';

interface CategoryListProps {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
  onUpdate: (categoryId: string, categoryData: CategoryRequest) => Promise<void>;
  onDelete: (categoryId: string) => Promise<void>;
}

export const CategoryList = ({
  categories,
  loading,
  error,
  onUpdate,
  onDelete,
}: CategoryListProps) => {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Categories</h2>
      </div>
      
      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-dark)', color: 'var(--color-text-primary)' }}>
          Error: {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--color-text-primary)' }}>Loading categories...</div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Categories ({categories.length})
          </h3>
          {categories.length === 0 ? (
            <div className="text-center py-12 italic" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
              No categories found
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <CategoryItem
                  key={category.category_id}
                  category={category}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};


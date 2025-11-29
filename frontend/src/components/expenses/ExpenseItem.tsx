import { useState, Fragment } from 'react';
import type { ExpenseResponse, Item } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useNotification } from '../../contexts/NotificationContext';
import { expenseItemStyles, expenseItemClasses } from '../../styles/expenseItemStyles';

interface ExpenseItemProps {
  expense: ExpenseResponse;
  onUpdateDescription: (expenseId: string, description: string) => Promise<void>;
  onUpdateItem: (expenseId: string, itemId: string, item: Item) => Promise<void>;
  onDelete: (expenseId: string) => Promise<void>;
}

export const ExpenseItem = ({ expense, onUpdateDescription, onUpdateItem, onDelete }: ExpenseItemProps) => {
  const { showNotification } = useNotification();
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState<string>('');
  const [editingItem, setEditingItem] = useState<{ expenseId: string; itemId: string; item: Item } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const startEditingDescription = (): void => {
    if (!expense.expense_id) return;
    setEditingExpenseId(expense.expense_id);
    setEditingDescription(expense.description);
  };

  const handleSaveDescription = async (): Promise<void> => {
    if (!expense.expense_id) return;
    if (!editingDescription.trim()) {
      showNotification('Description cannot be empty', 'warning');
      return;
    }
    await onUpdateDescription(expense.expense_id, editingDescription);
    setEditingExpenseId(null);
    setEditingDescription('');
  };

  const startEditingItem = (item: Item): void => {
    if (!expense.expense_id || !item.item_id) return;
    setEditingItem({ expenseId: expense.expense_id, itemId: item.item_id, item: { ...item } });
  };

  const handleSaveItem = async (): Promise<void> => {
    if (!editingItem) return;
    
    if (!editingItem.item.item_name.trim()) {
      showNotification('Item name is required', 'warning');
      return;
    }
    if (editingItem.item.item_price <= 0) {
      showNotification('Item price must be greater than 0', 'warning');
      return;
    }
    if (editingItem.item.item_quantity <= 0) {
      showNotification('Item quantity must be greater than 0', 'warning');
      return;
    }
    
    await onUpdateItem(editingItem.expenseId, editingItem.itemId, editingItem.item);
    setEditingItem(null);
  };

  const handleDelete = async (): Promise<void> => {
    if (!expense.expense_id) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!expense.expense_id) return;
    await onDelete(expense.expense_id);
  };

  return (
    <Card className={expenseItemClasses.container}>
      <div className={expenseItemClasses.headerContainer}>
        {editingExpenseId === expense.expense_id ? (
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              className="mb-0 flex-1"
            />
            <Button onClick={handleSaveDescription} variant="success" size="sm">
              Save
            </Button>
            <Button 
              onClick={() => { setEditingExpenseId(null); setEditingDescription(''); }} 
              variant="secondary" 
              size="sm"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div>
            <div className={expenseItemClasses.headerRow}>
              <h3 className={expenseItemClasses.title} style={expenseItemStyles.header}>{expense.description}</h3>
              <div className={expenseItemClasses.buttonsContainer}>
                {expense.expense_id && (
                  <>
                    <Button onClick={startEditingDescription} variant="primary" size="sm">
                      Edit
                    </Button>
                    <Button onClick={handleDelete} variant="danger" size="sm">
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className={expenseItemClasses.metadataContainer} style={expenseItemStyles.metadata}>
              <p>Created: {expense.created_at}</p>
              {expense.expense_id && (
                <p className="text-xs" style={expenseItemStyles.id}>ID: {expense.expense_id}</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className={expenseItemClasses.itemsContainer}>
        <h4 className={expenseItemClasses.itemsTitle} style={expenseItemStyles.itemsTitle}>
          Items ({expense.items.length}):
        </h4>
        <Table>
          <TableHead>
            <TableHeader>Name</TableHeader>
            <TableHeader className="text-right">Price</TableHeader>
            <TableHeader className="text-right">Quantity</TableHeader>
            <TableHeader className="text-right">Total</TableHeader>
            <TableHeader className="text-center">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {expense.items.map((item, itemIndex) => (
              <TableRow key={item.item_id || itemIndex}>
                {editingItem && editingItem.expenseId === expense.expense_id && editingItem.itemId === item.item_id ? (
                  <Fragment>
                    <TableCell>
                      <Input
                        type="text"
                        value={editingItem.item.item_name}
                        onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, item_name: e.target.value } })}
                        className="mb-0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={editingItem.item.item_price}
                        onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, item_price: parseFloat(e.target.value) || 0 } })}
                        min="0"
                        step="0.01"
                        className="mb-0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={editingItem.item.item_quantity}
                        onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, item_quantity: parseInt(e.target.value) || 1 } })}
                        min="1"
                        className="mb-0"
                      />
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {`$${(editingItem.item.item_price * editingItem.item.item_quantity).toFixed(2)}`}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button onClick={handleSaveItem} variant="success" size="sm">
                          Save
                        </Button>
                        <Button onClick={() => setEditingItem(null)} variant="secondary" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </Fragment>
                ) : (
                  <Fragment>
                    <TableCell className="font-medium">{item.item_name}</TableCell>
                    <TableCell className="text-right">{`$${item.item_price.toFixed(2)}`}</TableCell>
                    <TableCell className="text-right">{item.item_quantity}</TableCell>
                    <TableCell className="text-right font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {`$${(item.item_price * item.item_quantity).toFixed(2)}`}
                    </TableCell>
                    <TableCell className="text-center">
                      {expense.expense_id && item.item_id && (
                        <Button onClick={() => startEditingItem(item)} variant="primary" size="sm">
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </Fragment>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className={expenseItemClasses.totalContainer} style={expenseItemStyles.borderTop}>
          <div className={expenseItemClasses.totalRow}>
            <div className={expenseItemClasses.totalContent}>
              <span className="text-sm mr-4" style={expenseItemStyles.totalLabel}>Total:</span>
              <span className="text-xl font-bold" style={expenseItemStyles.totalValue}>{`$${expense.total_price.toFixed(2)}`}</span>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Card>
  );
};

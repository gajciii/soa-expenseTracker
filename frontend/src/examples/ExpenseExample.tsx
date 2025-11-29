import { useState, Fragment } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useReports } from '../hooks/useReports';
import type { ExpenseParams, Item, ExpenseRequest } from '../types';

interface ExpenseExampleProps {
  userId?: string;
}

type View = 'expenses' | 'reports';

export const ExpenseExample = ({ userId = 'test-user' }: ExpenseExampleProps) => {
  const [currentView, setCurrentView] = useState<View>('expenses');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
  const [newExpenseDescription, setNewExpenseDescription] = useState<string>('');
  const [newExpenseItems, setNewExpenseItems] = useState<Item[]>([
    { item_id: '', item_name: '', item_price: 0, item_quantity: 1 }
  ]);
  
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState<string>('');
  const [editingItem, setEditingItem] = useState<{ expenseId: string; itemId: string; item: Item } | null>(null);
  
  const {
    expenses,
    loading: expensesLoading,
    error: expensesError,
    createExpense,
    deleteExpense,
    deleteAllExpenses,
    updateItem,
    updateDescription,
    fetchExpenses,
  } = useExpenses(userId);

  const {
    reports,
    currentReport,
    loading: reportsLoading,
    error: reportsError,
    createReport,
    fetchReport,
    deleteReport,
    deleteAllReports,
    fetchReportIds,
  } = useReports(userId);

  const addItemToForm = (): void => {
    setNewExpenseItems([...newExpenseItems, { item_id: '', item_name: '', item_price: 0, item_quantity: 1 }]);
  };

  const removeItemFromForm = (index: number): void => {
    setNewExpenseItems(newExpenseItems.filter((_, i) => i !== index));
  };

  const updateItemInForm = (index: number, field: keyof Item, value: string | number): void => {
    const updated = [...newExpenseItems];
    updated[index] = { ...updated[index], [field]: value };
    setNewExpenseItems(updated);
  };

  const handleCreateExpense = async (): Promise<void> => {
    try {
      if (!newExpenseDescription.trim()) {
        alert('Description is required');
        return;
      }
      
      if (newExpenseItems.length === 0) {
        alert('At least one item is required');
        return;
      }
      
      for (const item of newExpenseItems) {
        if (!item.item_name.trim()) {
          alert('Item name is required');
          return;
        }
        if (item.item_price <= 0) {
          alert('Item price must be greater than 0');
          return;
        }
        if (item.item_quantity <= 0) {
          alert('Item quantity must be greater than 0');
          return;
        }
      }
      
      const expenseData: ExpenseRequest = {
        description: newExpenseDescription,
        items: newExpenseItems.map(item => ({
            item_id: '',
          item_name: item.item_name,
          item_price: item.item_price,
          item_quantity: item.item_quantity,
        })),
      };
      
      await createExpense(expenseData);
      
      setNewExpenseDescription('');
      setNewExpenseItems([{ item_id: '', item_name: '', item_price: 0, item_quantity: 1 }]);
      alert('Expense created successfully!');
    } catch (error) {
      console.error('Failed to create expense:', error);
      alert('Failed to create expense. Check console for details.');
    }
  };

  const startEditingDescription = (expenseId: string, currentDescription: string): void => {
    setEditingExpenseId(expenseId);
    setEditingDescription(currentDescription);
  };

  const handleSaveDescription = async (expenseId: string): Promise<void> => {
    try {
      if (!editingDescription.trim()) {
        alert('Description cannot be empty');
        return;
      }
      await updateDescription(expenseId, editingDescription);
      setEditingExpenseId(null);
      setEditingDescription('');
      alert('Description updated successfully!');
    } catch (error) {
      console.error('Failed to update description:', error);
      alert('Failed to update description. Check console for details.');
    }
  };

  const startEditingItem = (expenseId: string, item: Item): void => {
    setEditingItem({ expenseId, itemId: item.item_id, item: { ...item } });
  };

  const handleSaveItem = async (): Promise<void> => {
    if (!editingItem) return;
    
    try {
      if (!editingItem.item.item_name.trim()) {
        alert('Item name is required');
        return;
      }
      if (editingItem.item.item_price <= 0) {
        alert('Item price must be greater than 0');
        return;
      }
      if (editingItem.item.item_quantity <= 0) {
        alert('Item quantity must be greater than 0');
        return;
      }
      
      await updateItem(editingItem.expenseId, editingItem.itemId, editingItem.item);
      setEditingItem(null);
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Failed to update item:', error);
      alert('Failed to update item. Check console for details.');
    }
  };

  const handleCreateReport = async (): Promise<void> => {
    try {
      if (dateFrom && dateTo && dateFrom > dateTo) {
        alert('Date From must be before or equal to Date To');
        return;
      }
      
      const params: ExpenseParams = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      
      const result = await createReport(params);
      console.log('Report created:', result);
      alert('Report created successfully!');
    } catch (error) {
      console.error('Failed to create report:', error);
      alert('Failed to create report. Check console for details.');
    }
  };

  const handleFilterExpenses = (): void => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      alert('Date From must be before or equal to Date To');
      return;
    }
    
    const params: ExpenseParams = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    fetchExpenses(params);
  };

  const handleDeleteExpense = async (expenseId: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await deleteExpense(expenseId);
      alert('Expense deleted successfully!');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      alert('Failed to delete expense. Check console for details.');
    }
  };

  const handleDeleteAllExpenses = async (): Promise<void> => {
    if (!confirm('Are you sure you want to delete ALL expenses? This cannot be undone!')) return;
    
    try {
      await deleteAllExpenses();
      alert('All expenses deleted successfully!');
    } catch (error) {
      console.error('Failed to delete all expenses:', error);
      alert('Failed to delete all expenses. Check console for details.');
    }
  };

  const handleDeleteReport = async (reportId: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await deleteReport(reportId);
      alert('Report deleted successfully!');
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete report. Check console for details.');
    }
  };

  const handleDeleteAllReports = async (): Promise<void> => {
    if (!confirm('Are you sure you want to delete ALL reports? This cannot be undone!')) return;
    
    try {
      await deleteAllReports();
      alert('All reports deleted successfully!');
    } catch (error) {
      console.error('Failed to delete all reports:', error);
      alert('Failed to delete all reports. Check console for details.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Expense Tracker</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => {
                setCurrentView('expenses');
                fetchExpenses();
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentView === 'expenses' ? '#1976D2' : 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: currentView === 'expenses' ? 'bold' : 'normal'
              }}
            >
              Expenses
            </button>
            <button
              onClick={() => {
                setCurrentView('reports');
                fetchReportIds();
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentView === 'reports' ? '#1976D2' : 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: currentView === 'reports' ? 'bold' : 'normal'
              }}
            >
              Reports
            </button>
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>User: {userId}</div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 2rem' }}>
        {currentView === 'expenses' ? (
          <Fragment>
            <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h2 style={{ marginTop: 0 }}>Create New Expense</h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Description:
                </label>
                <input
                  type="text"
                  value={newExpenseDescription}
                  onChange={(e) => setNewExpenseDescription(e.target.value)}
                  placeholder="Enter expense description"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Items:</label>
                  <button
                    onClick={addItemToForm}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Item
                  </button>
                </div>
                
                {newExpenseItems.map((item, index) => (
                  <div key={index} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '0.5rem', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Item name"
                        value={item.item_name}
                        onChange={(e) => updateItemInForm(index, 'item_name', e.target.value)}
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.item_price || ''}
                        onChange={(e) => updateItemInForm(index, 'item_price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.item_quantity || ''}
                        onChange={(e) => updateItemInForm(index, 'item_quantity', parseInt(e.target.value) || 1)}
                        min="1"
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <div style={{ fontWeight: 'bold', textAlign: 'right' }}>
                        {`$${((item.item_price || 0) * (item.item_quantity || 1)).toFixed(2)}`}
                      </div>
                      {newExpenseItems.length > 1 && (
                        <button
                          onClick={() => removeItemFromForm(index)}
                          style={{
                            padding: '0.5rem',
                            cursor: 'pointer',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCreateExpense}
                disabled={expensesLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  cursor: expensesLoading ? 'not-allowed' : 'pointer',
                  backgroundColor: expensesLoading ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                {expensesLoading ? 'Creating...' : 'Create Expense'}
              </button>
            </section>

            <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Expenses</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleFilterExpenses}
                    disabled={expensesLoading}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: expensesLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Filter
          </button>
                  <button
                    onClick={handleDeleteAllExpenses}
                    disabled={expensesLoading}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: expensesLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Delete All
          </button>
        </div>
              </div>
              
              {expensesError && <p style={{ color: 'red', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>Error: {expensesError}</p>}

              <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label>
            Date From:
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
                    style={{ marginLeft: '0.5rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </label>
                <label>
            Date To:
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
                    style={{ marginLeft: '0.5rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </label>
        </div>

        {expensesLoading ? (
          <p>Loading expenses...</p>
        ) : (
          <div>
            <h3>Expenses ({expenses.length})</h3>
                  {expenses.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No expenses found</p>
                  ) : (
                    expenses.map((expense, index) => (
                      <div key={expense.expense_id || index} style={{ border: '1px solid #ddd', padding: '1.5rem', margin: '1rem 0', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            {editingExpenseId === expense.expense_id ? (
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  value={editingDescription}
                                  onChange={(e) => setEditingDescription(e.target.value)}
                                  style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                <button
                                  onClick={() => handleSaveDescription(expense.expense_id!)}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => { setEditingExpenseId(null); setEditingDescription(''); }}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#999',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div>
                                <p style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                  {expense.description}
                                </p>
                                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                                  Created: {expense.created_at} | Updated: {expense.updated_at}
                                </p>
                                {expense.expense_id && (
                                  <p style={{ margin: '0.5rem 0', fontSize: '0.8rem', color: '#999' }}>
                                    ID: {expense.expense_id}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {editingExpenseId !== expense.expense_id && expense.expense_id && (
                              <button
                                onClick={() => startEditingDescription(expense.expense_id!, expense.description)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  backgroundColor: '#2196F3',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                Edit Description
                              </button>
                            )}
                            {expense.expense_id && (
                              <button
                                onClick={() => handleDeleteExpense(expense.expense_id!)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  backgroundColor: '#f44336',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                  Delete
                </button>
                            )}
                          </div>
              </div>
                        
                        <div style={{ marginTop: '1rem' }}>
                          <h4 style={{ marginBottom: '0.5rem' }}>Items ({expense.items.length}):</h4>
                          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>Price</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>Quantity</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>Total</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #ddd' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expense.items.map((item, itemIndex) => (
                                <tr key={item.item_id || itemIndex}>
                                  {editingItem && editingItem.expenseId === expense.expense_id && editingItem.itemId === item.item_id ? (
                                    <Fragment>
                                      <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                                        <input
                                          type="text"
                                          value={editingItem.item.item_name}
                                          onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, item_name: e.target.value } })}
                                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                      </td>
                                      <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                                        <input
                                          type="number"
                                          value={editingItem.item.item_price}
                                          onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, item_price: parseFloat(e.target.value) || 0 } })}
                                          min="0"
                                          step="0.01"
                                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                      </td>
                                      <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                                        <input
                                          type="number"
                                          value={editingItem.item.item_quantity}
                                          onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, item_quantity: parseInt(e.target.value) || 1 } })}
                                          min="1"
                                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                      </td>
                                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                                        {`$${(editingItem.item.item_price * editingItem.item.item_quantity).toFixed(2)}`}
                                      </td>
                                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>
                                        <button
                                          onClick={handleSaveItem}
                                          style={{
                                            padding: '0.5rem 1rem',
                                            marginRight: '0.5rem',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingItem(null)}
                                          style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#999',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </td>
                                    </Fragment>
                                  ) : (
                                    <Fragment>
                                      <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.item_name}</td>
                                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'right' }}>{`$${item.item_price.toFixed(2)}`}</td>
                                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'right' }}>{item.item_quantity}</td>
                                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                                        {`$${(item.item_price * item.item_quantity).toFixed(2)}`}
                                      </td>
                                      <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'center' }}>
                                        {expense.expense_id && item.item_id && (
                                          <button
                                            onClick={() => startEditingItem(expense.expense_id!, item)}
                                            style={{
                                              padding: '0.5rem 1rem',
                                              backgroundColor: '#2196F3',
                                              color: 'white',
                                              border: 'none',
                                              borderRadius: '4px',
                                              cursor: 'pointer'
                                            }}
                                          >
                                            Edit
                                          </button>
                                        )}
                                      </td>
                                    </Fragment>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
                                <td colSpan={3} style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'right'}}>Total:</td>
                                <td style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'right'}}>{`$${expense.total_price.toFixed(2)}`}</td>
                                <td style={{ padding: '0.75rem', border: '1px solid #ddd'}}></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    ))
                  )}
          </div>
        )}
      </section>
          </Fragment>
        ) : (
          <Fragment>
            <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Create Report</h2>
                <button
                  onClick={handleDeleteAllReports}
                  disabled={reportsLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: reportsLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  Delete All Reports
          </button>
        </div>
              
              {reportsError && <p style={{ color: 'red', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px', marginBottom: '1rem' }}>Error: {reportsError}</p>}
              
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label>
                  Date From:
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    style={{ marginLeft: '0.5rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </label>
                <label>
                  Date To:
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    style={{ marginLeft: '0.5rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </label>
                <button
                  onClick={handleCreateReport}
                  disabled={reportsLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    cursor: reportsLoading ? 'not-allowed' : 'pointer',
                    backgroundColor: reportsLoading ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}
                >
                  {reportsLoading ? 'Creating...' : 'Create Report'}
                </button>
              </div>
            </section>

            <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h2 style={{ marginTop: 0 }}>Reports</h2>

        {reportsLoading ? (
          <p>Loading reports...</p>
        ) : (
          <div>
            <h3>Report IDs ({reports.length})</h3>
                  {reports.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No reports found</p>
                  ) : (
                    reports.map((reportId, index) => (
                      <div key={index} style={{ margin: '0.5rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{reportId}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => fetchReport(reportId)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#2196F3',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                  View
                </button>
                          <button
                            onClick={() => handleDeleteReport(reportId)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                  Delete
                </button>
              </div>
                      </div>
                    ))
                  )}
          </div>
        )}

        {currentReport && (
                <div style={{ border: '1px solid #ddd', padding: '1.5rem', marginTop: '2rem', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            <h3>Current Report</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                      <p><strong>Date From:</strong> {currentReport.date_from || 'N/A'}</p>
                      <p><strong>Date To:</strong> {currentReport.date_to || 'N/A'}</p>
                      <p><strong>Total Price:</strong> {`$${currentReport.total_price.toFixed(2)}`}</p>
                    </div>
                    <div>
            <p><strong>Expenses Count:</strong> {currentReport.expenses?.length || 0}</p>
                      <p><strong>Most Expensive Items:</strong> {currentReport.most_expensive_items?.length || 0}</p>
            <p><strong>Created:</strong> {currentReport.created_at}</p>
          </div>
                  </div>
                  
                  {currentReport.most_expensive_items && currentReport.most_expensive_items.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h4>Most Expensive Items:</h4>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {currentReport.most_expensive_items.map((item, idx) => (
                          <li key={idx} style={{ padding: '0.5rem', margin: '0.25rem 0', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #eee' }}>
                            {`${item.item_name} - $${item.item_price.toFixed(2)} (Qty: ${item.item_quantity})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
      </section>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ExpenseExample;

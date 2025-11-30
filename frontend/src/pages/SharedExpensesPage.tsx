import { useState, useEffect } from 'react';
import { useSharedExpenses } from '../hooks/useSharedExpenses';
import { GroupList } from '../components/shared-expenses/GroupList';
import { GroupExpenseList } from '../components/shared-expenses/GroupExpenseList';
import { GroupForm } from '../components/shared-expenses/GroupForm';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { pageStyles, pageClasses } from '../styles/pageStyles';
import type { GroupExpenseRequest, GroupRequest } from '../types';

export const SharedExpensesPage = () => {
  const { user } = useAuth();
  const userId = user?.user_id || '';
  const { showNotification } = useNotification();
  const {
    groupExpenses,
    groups,
    selectedGroup,
    groupMembers,
    loading,
    error,
    createGroup,
    fetchGroupExpenses,
    fetchGroup,
    fetchGroupMembers,
    updateGroupExpense,
    deleteGroupExpense,
    updateGroupTitle,
    deleteGroup,
  } = useSharedExpenses(userId);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  useEffect(() => {
    if (selectedGroupId) {
      fetchGroupExpenses(selectedGroupId);
      fetchGroup(selectedGroupId);
      fetchGroupMembers(selectedGroupId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId]);

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleUpdateExpense = async (expenseId: string, data: GroupExpenseRequest) => {
    if (!selectedGroupId) return;
    try {
      await updateGroupExpense(selectedGroupId, expenseId, data);
      showNotification('Expense updated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to update expense', 'error');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!selectedGroupId) return;
    try {
      await deleteGroupExpense(selectedGroupId, expenseId);
      showNotification('Expense deleted successfully!', 'success');
    } catch (error) {
      showNotification('Failed to delete expense', 'error');
    }
  };

  const handleUpdateTitle = async (groupId: string, title: string) => {
    try {
      await updateGroupTitle(groupId, title);
      showNotification('Group title updated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to update group title', 'error');
    }
  };

  const handleCreateGroup = async (data: GroupRequest) => {
    try {
      await createGroup(data);
      showNotification('Group created successfully!', 'success');
      setShowCreateForm(false);
    } catch (error) {
      showNotification('Failed to create group', 'error');
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
      showNotification('Group deleted successfully!', 'success');
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
      }
    } catch (error) {
      showNotification('Failed to delete group', 'error');
    }
  };

  return (
    <div className={pageClasses.container}>
      <div className={pageClasses.header}>
        <h1 className={pageClasses.title} style={pageStyles.title}>
          Shared Expenses
        </h1>
        <p className={pageClasses.subtitle} style={pageStyles.subtitle}>
          Manage group expenses and split costs
        </p>
      </div>

      <div className={pageClasses.toggleContainer}>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? 'primary' : 'outline'}
          size="md"
        >
          {showCreateForm ? 'Hide Create Form' : 'Create New Group'}
        </Button>
      </div>

      {showCreateForm && (
        <div className={pageClasses.formContainer}>
          <GroupForm onSubmit={handleCreateGroup} loading={loading} />
        </div>
      )}

      <div className="space-y-8">
        <GroupList
          groups={groups}
          loading={loading}
          error={error}
          onSelect={handleSelectGroup}
          onUpdateTitle={handleUpdateTitle}
          onDelete={handleDeleteGroup}
        />

        {selectedGroupId && (
          <div>
            {selectedGroup && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    {selectedGroup.groupTitle}
                  </h2>
                  <div className="text-sm" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
                    Members: {groupMembers.join(', ')}
                  </div>
                </div>
              </Card>
            )}

            <GroupExpenseList
              expenses={groupExpenses}
              loading={loading}
              error={error}
              onUpdate={handleUpdateExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}

        {!selectedGroupId && (
          <Card>
            <div className="text-center py-12 italic" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
              Select a group to view expenses
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};


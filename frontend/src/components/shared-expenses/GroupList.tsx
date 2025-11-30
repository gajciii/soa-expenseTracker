import type { GroupResponse } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useState } from 'react';

interface GroupListProps {
  groups: GroupResponse[];
  loading: boolean;
  error: string | null;
  onSelect: (groupId: string) => void;
  onUpdateTitle: (groupId: string, title: string) => Promise<void>;
  onDelete: (groupId: string) => Promise<void>;
}

export const GroupList = ({
  groups,
  loading,
  error,
  onSelect,
  onUpdateTitle,
  onDelete,
}: GroupListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const startEdit = (group: GroupResponse) => {
    setEditingId(group.id);
    setNewTitle(group.groupTitle);
  };

  const handleUpdate = async (groupId: string) => {
    try {
      await onUpdateTitle(groupId, newTitle);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update group title:', error);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <Card>
      <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
        Your Groups
      </h2>

      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary-dark)', color: 'var(--color-text-primary)' }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--color-text-primary)' }}>Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-12 italic" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
          No groups found
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="p-4 rounded-lg border"
              style={{ backgroundColor: 'rgba(28, 15, 19, 0.1)', borderColor: 'var(--color-border)', backdropFilter: 'blur(10px)' }}
            >
              {editingId === group.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'rgba(28, 15, 19, 0.1)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => handleUpdate(group.id)}>
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {group.groupTitle}
                      </h3>
                      <div className="text-sm mt-1" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
                        Members: {group.groupMembers.length}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => onSelect(group.id)}>
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => startEdit(group)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteId(group.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Group"
        message="Are you sure you want to delete this group? All expenses will be deleted."
      />
    </Card>
  );
};


import { useState, useEffect, useMemo, useRef } from 'react';
import type { GroupRequest, User } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { authService } from '../../services/authApi';

interface GroupFormProps {
  onSubmit: (data: GroupRequest) => Promise<void>;
  loading: boolean;
}

export const GroupForm = ({ onSubmit, loading }: GroupFormProps) => {
  const [groupTitle, setGroupTitle] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const allUsers = await authService.getAllUsers(0, 200);
      setUsers(allUsers.filter(u => u.is_active));
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.first_name && user.first_name.toLowerCase().includes(query)) ||
      (user.last_name && user.last_name.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  const handleAddMember = (userId: string) => {
    if (!selectedMembers.includes(userId)) {
      setSelectedMembers([...selectedMembers, userId]);
    }
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleRemoveMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter(id => id !== userId));
  };

  const getMemberDisplayName = (userId: string): string => {
    const user = users.find(u => u.user_id === userId);
    if (!user) return userId;
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name} (@${user.username})`;
    }
    return `@${user.username}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupTitle.trim() || selectedMembers.length === 0) return;
    
    await onSubmit({
      groupTitle: groupTitle.trim(),
      groupMembers: selectedMembers,
    });
    
    setGroupTitle('');
    setSelectedMembers([]);
    setSearchQuery('');
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Create New Group
          </h3>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Group Title
          </label>
          <input
            type="text"
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
            placeholder="e.g., Weekend Trip, House Expenses"
            required
          />
        </div>

        <div className="relative">
          <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Add Members
          </label>
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              placeholder="Search by username, name, or email..."
            />
            {isSearchOpen && (
              <div 
                className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-2xl"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {loadingUsers ? (
                  <div className="p-4 text-center" style={{ color: 'var(--color-text-primary)' }}>
                    Loading users...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-4 text-center" style={{ color: 'var(--color-text-primary)', opacity: 0.7 }}>
                    No users found
                  </div>
                ) : (
                  filteredUsers
                    .filter(user => !selectedMembers.includes(user.user_id))
                    .map((user) => (
                      <button
                        key={user.user_id}
                        type="button"
                        onClick={() => handleAddMember(user.user_id)}
                        className="w-full px-4 py-3 text-left hover:bg-opacity-50 transition-colors border-b last:border-b-0"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div className="font-medium">@{user.username}</div>
                        {(user.first_name || user.last_name) && (
                          <div className="text-sm opacity-70">
                            {user.first_name} {user.last_name}
                          </div>
                        )}
                        <div className="text-xs opacity-60">{user.email}</div>
                      </button>
                    ))
                )}
              </div>
            )}
          </div>
        </div>

        {selectedMembers.length > 0 && (
          <div>
            <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Selected Members ({selectedMembers.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map((userId) => (
                <div
                  key={userId}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-primary-dark)',
                    color: 'var(--color-text-white)',
                  }}
                >
                  <span className="text-sm">{getMemberDisplayName(userId)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(userId)}
                    className="ml-1 hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-text-white)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <Button 
            type="submit"
            variant="primary" 
            size="md" 
            disabled={!groupTitle.trim() || selectedMembers.length === 0 || loading}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </Button>
        </div>
      </form>
    </Card>
  );
};


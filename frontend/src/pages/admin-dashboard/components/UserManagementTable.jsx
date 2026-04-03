import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../../utils/apiClient';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const UserManagementTable = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [toggleError, setToggleError] = useState(null);

  const fetchUsers = useCallback(async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search) params.search = search;
      const response = await apiClient?.get('/admin/users', { params });
      setUsers(response?.data?.data || []);
    } catch (err) {
      setError('Failed to load users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    const val = e?.target?.value;
    setSearchTerm(val);
  };

  const handleSearchSubmit = (e) => {
    if (e?.key === 'Enter') fetchUsers(searchTerm);
  };

  const isActive = (user) => !user?.is_deleted;

  const handleActivate = async (userId) => {
    try {
      setTogglingId(userId);
      setToggleError(null);
      const response = await apiClient?.patch(`/admin/users/${userId}/activate`, {});
      setUsers(prev =>
        prev?.map(u =>
          u?.id === userId
            ? { ...u, is_deleted: false, deleted_at: null }
            : u
        )
      );
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to activate user.';
      setToggleError(msg);
      setTimeout(() => setToggleError(null), 4000);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      setTogglingId(userId);
      setToggleError(null);
      const response = await apiClient?.patch(`/admin/users/${userId}/deactivate`, {});
      setUsers(prev =>
        prev?.map(u =>
          u?.id === userId
            ? { ...u, is_deleted: true }
            : u
        )
      );
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to deactivate user.';
      setToggleError(msg);
      setTimeout(() => setToggleError(null), 4000);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">User Management</h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="w-full md:w-64">
              <Input
                type="search"
                placeholder="Search users... (press Enter)"
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleSearchSubmit}
              />
            </div>
            <Button variant="outline" size="sm" iconName="RefreshCw" onClick={() => fetchUsers(searchTerm)}>
              Refresh
            </Button>
          </div>
        </div>
        {toggleError && (
          <div className="mt-3 px-4 py-2 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
            {toggleError}
          </div>
        )}
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading users...</div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive mb-3">{error}</p>
            <button
              type="button"
              onClick={() => fetchUsers(searchTerm)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : users?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No users found.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">User ID</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">Role</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">{t('status')}</th>
                <th className="px-4 md:px-6 py-3 text-right text-xs md:text-sm font-medium text-muted-foreground">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => {
                const active = isActive(user);
                return (
                  <tr key={user?.id} className="table-row">
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-xs md:text-sm font-medium text-foreground data-text">#{user?.id}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-xs md:text-sm font-medium text-foreground">
                        {user?.full_name || user?.name || user?.username || '—'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-xs md:text-sm text-muted-foreground">{user?.email}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-xs md:text-sm text-foreground">
                        {user?.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs font-medium border ${
                        active
                          ? 'bg-success/10 text-success border-success/20' :'bg-error/10 text-error border-error/20'
                      }`}>
                        {active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {active ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            iconName="UserX"
                            className="text-xs"
                            loading={togglingId === user?.id}
                            onClick={() => handleDeactivate(user?.id)}
                            type="button"
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            iconName="UserCheck"
                            className="text-xs"
                            loading={togglingId === user?.id}
                            onClick={() => handleActivate(user?.id)}
                            type="button"
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagementTable;
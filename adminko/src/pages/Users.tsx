import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import type { User } from '../types/index';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  useEffect(() => {
    // Инициализация Preline после рендера
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [showCreateModal, editingUser]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getAll(currentPage, 20);
      setUsers(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка загрузки пользователей');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этого пользователя?')) return;

    try {
      await usersAPI.delete(id);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка удаления');
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      if (user.is_active) {
        await usersAPI.deactivate(user.id);
      } else {
        await usersAPI.activate(user.id);
      }
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка изменения статуса');
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedUsers(newSet);
  };

  const toggleAllUsers = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[85rem] px-2 sm:px-5 lg:px-8 mx-auto py-5 space-y-5">
      {/* Page Header */}
      <div className="flex justify-between items-center gap-x-5">
        <h2 className="block font-medium text-lg sm:text-xl text-gray-800">
          Пользователи
        </h2>

        <div className="flex justify-end items-center gap-x-2">
          {/* Search Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => document.getElementById('user-search-input')?.focus()}
              className="size-8.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            >
              <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>

          {/* New User Button */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="py-1.5 px-2.5 inline-flex items-center gap-x-1.5 text-sm rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Новый пользователь
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
          <svg className="shrink-0 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          id="user-search-input"
          type="text"
          className="py-2.5 sm:py-3 px-4 ps-10 block w-full sm:text-sm input-border"
          placeholder="Поиск по email или никнейму..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="border-t border-gray-200 divide-x divide-gray-200">
                <th scope="col" className="px-3 py-2.5 text-start">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-blue-600 checked:border-blue-600 focus:ring-blue-500"
                    checked={selectedUsers.size === users.length && users.length > 0}
                    onChange={toggleAllUsers}
                  />
                </th>

                <th scope="col" className="min-w-60">
                  <div className="ps-4 pe-2 flex items-center gap-x-3">
                    <span className="py-2.5 text-start text-sm font-normal text-gray-500 flex items-center gap-x-1.5">
                      <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                      </svg>
                      Email
                    </span>
                  </div>
                </th>

                <th scope="col">
                  <div className="ps-4 pe-2 flex items-center gap-x-3">
                    <span className="py-2.5 text-start text-sm font-normal text-gray-500 flex items-center gap-x-1.5">
                      <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Никнейм
                    </span>
                  </div>
                </th>

                <th scope="col">
                  <div className="ps-4 pe-2 flex items-center gap-x-3">
                    <span className="py-2.5 text-start text-sm font-normal text-gray-500">Роль</span>
                  </div>
                </th>

                <th scope="col">
                  <div className="ps-4 pe-2 flex items-center gap-x-3">
                    <span className="py-2.5 text-start text-sm font-normal text-gray-500">Статус</span>
                  </div>
                </th>

                <th scope="col">
                  <div className="ps-4 pe-2 flex items-center gap-x-3">
                    <span className="py-2.5 text-start text-sm font-normal text-gray-500">Создан</span>
                  </div>
                </th>

                <th scope="col" className="px-3 py-2.5 text-end">
                  <span className="text-sm font-normal text-gray-500">Действия</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    Загрузка...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    Пользователи не найдены
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="divide-x divide-gray-200">
                    <td className="size-px whitespace-nowrap px-3 py-4">
                      <input
                        type="checkbox"
                        className="shrink-0 border-gray-300 rounded-sm text-blue-600 checked:border-blue-600 focus:ring-blue-500"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                      />
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <div className="w-full flex items-center gap-x-3">
                        <div className="shrink-0 size-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div className="grow">
                          <span className="font-medium text-sm text-gray-800">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {user.nickname || '-'}
                      </span>
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'coach'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? '👑 Admin' : user.role === 'coach' ? '🏆 Coach' : '👤 User'}
                      </span>
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_active ? '✓ Активен' : '✗ Неактивен'}
                      </span>
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <div className="flex justify-end items-center gap-x-1">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>

                        {/* Toggle Active Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleActive(user)}
                          className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          {user.is_active ? (
                            <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          ) : (
                            <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-red-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-x-2">
          <button
            type="button"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="py-1.5 px-2.5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
          >
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Назад
          </button>

          <span className="text-sm text-gray-600">
            Страница {currentPage} из {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="py-1.5 px-2.5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
          >
            Далее
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingUser) && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowCreateModal(false);
            setEditingUser(null);
          }}
          onSave={() => {
            setShowCreateModal(false);
            setEditingUser(null);
            loadUsers();
          }}
        />
      )}
    </div>
  );
};

// Modal Component with Preline Overlay
interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    nickname: user?.nickname || '',
    password: '',
    role: (user?.role || 'user') as 'user' | 'admin' | 'coach',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Показать модалку через Preline overlay
    const modal = document.getElementById('user-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('open');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (user) {
        const updateData: any = {
          nickname: formData.nickname,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await usersAPI.update(user.id, updateData);
      } else {
        await usersAPI.create(formData);
      }
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    const modal = document.getElementById('user-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('open');
    }
    onClose();
  };

  return (
    <div
      id="user-modal"
      className="hs-overlay size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="user-modal-label"
    >
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
          <h3 id="user-modal-label" className="font-semibold text-gray-800">
            {user ? 'Редактировать пользователя' : 'Создать пользователя'}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
          >
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!!user || isLoading}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-800 mb-2">
                Никнейм
              </label>
              <input
                id="nickname"
                type="text"
                className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                disabled={isLoading}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                Пароль {user && <span className="text-gray-500">(оставьте пустым, чтобы не менять)</span>}
              </label>
              <input
                id="password"
                type="password"
                className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                required={!user}
                minLength={6}
                autoComplete={user ? "current-password" : "new-password"}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-800 mb-2">
                Роль
              </label>
              <select
                id="role"
                className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' | 'coach' })}
                disabled={isLoading}
              >
                <option value="user">User</option>
                <option value="coach">Coach</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

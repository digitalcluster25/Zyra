import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    nickname: user?.nickname || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    // TODO: API для обновления профиля
    setTimeout(() => {
      setIsLoading(false);
      setSuccess('Настройки сохранены');
    }, 1000);
  };

  return (
    <div className="w-full max-w-[85rem] px-2 sm:px-5 lg:px-8 mx-auto py-5">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">Настройки</h1>
        <p className="text-sm text-gray-500">Управление профилем и параметрами админки</p>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-4 sm:p-7">
              <div className="text-center mb-5">
                <div className="inline-flex justify-center items-center size-20 bg-blue-600 text-white rounded-full text-3xl font-bold mb-3">
                  {user?.email?.[0].toUpperCase() || 'A'}
                </div>
                <h3 className="font-semibold text-gray-800">{user?.nickname || 'Admin'}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                  👑 Администратор
                </span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Профиль
                </button>

                <button
                  type="button"
                  className="w-full py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Безопасность
                </button>

                <button
                  type="button"
                  className="w-full py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  Уведомления
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-4 sm:p-7">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Информация профиля</h3>
                  
                  <div className="space-y-4">
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
                        disabled
                        autoComplete="email"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email не может быть изменен</p>
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
                        placeholder="Ваше имя"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Безопасность</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-800 mb-2">
                        Текущий пароль
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        autoComplete="current-password"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-800 mb-2">
                        Новый пароль
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-2">
                        Подтвердите пароль
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>

                {/* System Info Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Информация о системе</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">API URL</p>
                      <p className="text-sm font-medium text-gray-800">http://localhost:3001</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Database</p>
                      <p className="text-sm font-medium text-gray-800">PostgreSQL</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Версия</p>
                      <p className="text-sm font-medium text-gray-800">Zyra 3.0</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Окружение</p>
                      <p className="text-sm font-medium text-gray-800">Development</p>
                    </div>
                  </div>
                </div>

                {success && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg border border-green-200 text-sm">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-x-2 pt-4">
                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    Отменить
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


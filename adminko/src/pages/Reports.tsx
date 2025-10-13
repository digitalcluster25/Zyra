import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

interface ReportStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  totalCheckins: number;
}

export const Reports: React.FC = () => {
  const [stats, setStats] = useState<ReportStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisWeek: 0,
    totalCheckins: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    loadReports();
  }, [period]);

  useEffect(() => {
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const usersResponse = await usersAPI.getAll(1, 100);
      const users = usersResponse.data.data;

      // Подсчет новых пользователей за неделю
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const newUsers = users.filter((u: any) => new Date(u.created_at) > weekAgo);

      setStats({
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.is_active).length,
        newUsersThisWeek: newUsers.length,
        totalCheckins: 0, // TODO: API для чекинов
      });
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[85rem] px-2 sm:px-5 lg:px-8 mx-auto py-5 space-y-5">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Отчеты и аналитика</h1>
          <p className="text-sm text-gray-500">Статистика использования системы</p>
        </div>

        {/* Period Selector */}
        <div className="inline-flex rounded-lg border border-gray-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setPeriod('week')}
            className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-s-lg focus:outline-none ${
              period === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            Неделя
          </button>
          <button
            type="button"
            onClick={() => setPeriod('month')}
            className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium border-x border-gray-200 focus:outline-none ${
              period === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            Месяц
          </button>
          <button
            type="button"
            onClick={() => setPeriod('year')}
            className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-e-lg focus:outline-none ${
              period === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            Год
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">Всего пользователей</h3>
            <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="size-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {isLoading ? '...' : stats.totalUsers}
          </p>
          <p className="text-xs text-gray-500 mt-1">Зарегистрировано в системе</p>
        </div>

        {/* Active Users */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">Активных</h3>
            <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="size-5 text-green-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {isLoading ? '...' : stats.activeUsers}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isLoading ? '' : `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(0)}% от общего числа`}
          </p>
        </div>

        {/* New Users This Week */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">Новых за неделю</h3>
            <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="size-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {isLoading ? '...' : stats.newUsersThisWeek}
          </p>
          <p className="text-xs text-green-600 mt-1">↗ Регистрации</p>
        </div>

        {/* Total Check-ins */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">Чекинов</h3>
            <div className="size-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="size-5 text-orange-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {isLoading ? '...' : stats.totalCheckins}
          </p>
          <p className="text-xs text-gray-500 mt-1">В процессе разработки</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* User Growth Chart Placeholder */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Рост пользователей</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <svg className="mx-auto size-12 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="2" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <p className="text-sm text-gray-500">График в разработке</p>
              <p className="text-xs text-gray-400 mt-1">Будет добавлен в следующей версии</p>
            </div>
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Активность</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <svg className="mx-auto size-12 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              <p className="text-sm text-gray-500">График в разработке</p>
              <p className="text-xs text-gray-400 mt-1">Будет добавлен в следующей версии</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Быстрые действия</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <button
            type="button"
            className="p-4 text-start border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-sm focus:outline-none focus:border-blue-600 transition"
          >
            <div className="flex items-center gap-x-3">
              <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="size-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">Экспорт данных</p>
                <p className="text-xs text-gray-500">CSV, JSON</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="p-4 text-start border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-sm focus:outline-none focus:border-blue-600 transition"
          >
            <div className="flex items-center gap-x-3">
              <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="size-5 text-green-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">Резервная копия</p>
                <p className="text-xs text-gray-500">Backup БД</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="p-4 text-start border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-sm focus:outline-none focus:border-blue-600 transition"
          >
            <div className="flex items-center gap-x-3">
              <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="size-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">Логи системы</p>
                <p className="text-xs text-gray-500">Просмотр</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Detailed Reports Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Детальные отчеты</h3>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">Метрика</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">Значение</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">Изменение</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">Тренд</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">Пользователи</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{stats.totalUsers}</td>
                  <td className="px-4 py-3 text-sm text-green-600">+{stats.newUsersThisWeek} за неделю</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                      <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                      Рост
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">Активность</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{stats.activeUsers}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {((stats.activeUsers / stats.totalUsers) * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                      <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" x2="12" y1="2" y2="22" />
                        <line x1="17" x2="7" y1="12" y2="12" />
                      </svg>
                      Стабильно
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">Чекины</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{stats.totalCheckins}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">В разработке</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                      <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" x2="12" y1="2" y2="22" />
                        <line x1="17" x2="7" y1="12" y2="12" />
                      </svg>
                      -
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


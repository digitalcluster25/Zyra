import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCheckins: number;
  totalFactors: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalCheckins: 0,
    totalFactors: 14, // Статическое число факторов
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Загружаем статистику пользователей
      const usersResponse = await usersAPI.getAll(1, 100);
      const users = usersResponse.data.data;
      
      setStats({
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.role === 'user').length,
        totalCheckins: 0, // TODO: добавить API для получения чекинов
        totalFactors: 14,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[85rem] px-2 sm:px-5 lg:px-8 mx-auto py-5 space-y-5">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Обзор системы мониторинга спортсменов</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Users Card */}
        <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-3">
              <div className="shrink-0">
                <div className="inline-flex justify-center items-center size-12 bg-blue-100 rounded-lg">
                  <svg className="shrink-0 size-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>
              <div className="grow">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Всего пользователей
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-2xl font-medium text-gray-800">
                    {isLoading ? '...' : stats.totalUsers}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-3">
              <div className="shrink-0">
                <div className="inline-flex justify-center items-center size-12 bg-green-100 rounded-lg">
                  <svg className="shrink-0 size-6 text-green-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
              </div>
              <div className="grow">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Активных спортсменов
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-2xl font-medium text-gray-800">
                    {isLoading ? '...' : stats.activeUsers}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Check-ins Card */}
        <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-3">
              <div className="shrink-0">
                <div className="inline-flex justify-center items-center size-12 bg-purple-100 rounded-lg">
                  <svg className="shrink-0 size-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                    <line x1="10" x2="8" y1="9" y2="9" />
                  </svg>
                </div>
              </div>
              <div className="grow">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Чекинов
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-2xl font-medium text-gray-800">
                    {isLoading ? '...' : stats.totalCheckins}
                  </h3>
                  <span className="text-xs text-gray-500">скоро</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Factors Card */}
        <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-3">
              <div className="shrink-0">
                <div className="inline-flex justify-center items-center size-12 bg-orange-100 rounded-lg">
                  <svg className="shrink-0 size-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M8 7v7" />
                    <path d="M12 7v4" />
                    <path d="M16 7v9" />
                  </svg>
                </div>
              </div>
              <div className="grow">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Активных факторов
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-2xl font-medium text-gray-800">
                    {stats.totalFactors}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-4 md:p-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Добро пожаловать в панель управления Zyra
          </h2>
          <p className="text-gray-600 mb-4">
            Система мониторинга состояния спортсменов на основе научных методик.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">📊 Hooper Index</h3>
              <p className="text-sm text-gray-600">
                Субъективная оценка состояния спортсмена
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">💪 Banister Model</h3>
              <p className="text-sm text-gray-600">
                Расчет фитнес-усталость и тренировочного баланса
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">🎯 Факторы</h3>
              <p className="text-sm text-gray-600">
                Анализ влияния внешних факторов на состояние
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


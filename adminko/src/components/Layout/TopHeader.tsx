import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const TopHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Инициализация Preline после рендера
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, []);

  return (
    <div className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-[85rem] flex justify-between lg:grid lg:grid-cols-3 basis-full items-center w-full mx-auto py-2.5 px-2 sm:px-6 lg:px-8">
        {/* Логотип */}
        <div className="flex items-center">
          <a className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-none focus:opacity-80" href="/users" aria-label="Zyra Admin">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-white font-bold text-lg">Zyra Admin</span>
            </div>
          </a>
        </div>

        {/* Поиск (десктоп) */}
        <div className="hidden lg:block lg:w-full lg:mx-0">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
              <svg className="shrink-0 size-4 text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              className="py-2 px-3 ps-10 pe-4 block w-full bg-white/10 border-transparent text-white rounded-lg text-sm focus:z-10 focus:border-white/10 focus:ring-white/10 placeholder:text-white/60 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Поиск пользователей, факторов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Правая часть: Иконки и дропдаун пользователя */}
        <div className="flex justify-end items-center gap-x-2">
          {/* Поиск (мобильная версия) */}
          <div className="lg:hidden">
            <button type="button" className="inline-flex shrink-0 justify-center items-center gap-x-2 size-9 rounded-full text-white hover:bg-white/10 disabled:opacity-50 focus:outline-none focus:bg-white/10">
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>

          {/* Help Dropdown */}
          <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
            <button id="hs-pro-dnhd" type="button" className="inline-flex shrink-0 justify-center items-center gap-x-2 size-9 rounded-full text-white hover:bg-white/10 disabled:opacity-50 focus:outline-none focus:bg-white/10" aria-haspopup="menu" aria-expanded="false" aria-label="Помощь">
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </button>

            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-xl" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dnhd">
              <div className="p-1">
                <a className="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
                  <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  Документация
                </a>
                <a className="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="https://github.com/your-repo/issues" target="_blank" rel="noopener noreferrer">
                  <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  Поддержка
                </a>
              </div>
            </div>
          </div>

          {/* Notifications Dropdown */}
          <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
            <button id="hs-pro-dnnd" type="button" className="relative inline-flex shrink-0 justify-center items-center gap-x-2 size-9 rounded-full text-white hover:bg-white/10 disabled:opacity-50 focus:outline-none focus:bg-white/10" aria-haspopup="menu" aria-expanded="false" aria-label="Уведомления">
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {/* Индикатор новых уведомлений */}
              <span className="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white">3</span>
            </button>

            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-80 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-xl" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dnnd">
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800">Уведомления</h4>
              </div>
              <div className="p-2">
                <p className="text-sm text-gray-500 text-center py-4">Нет новых уведомлений</p>
              </div>
            </div>
          </div>

          {/* Account Dropdown - вынесем в отдельный компонент */}
          <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
            <button id="hs-pro-dnad" type="button" className="size-9 inline-flex justify-center items-center gap-x-2 rounded-full bg-white/10 border border-white/10 text-sm text-white hover:bg-white/20 focus:outline-none focus:bg-white/20" aria-haspopup="menu" aria-expanded="false" aria-label="Меню пользователя">
              <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center font-semibold">
                {user?.email?.[0].toUpperCase() || 'A'}
              </div>
            </button>

            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-xl" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dnad">
              <div className="p-1">
                <div className="py-2 px-3 mb-1">
                  <p className="text-xs text-gray-500">Вошли как</p>
                  <p className="text-sm font-medium text-gray-800">{user?.email}</p>
                </div>

                <div className="my-1 border-t border-gray-200"></div>

                <button 
                  className="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-start"
                  onClick={() => navigate('/settings')}
                >
                  <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Настройки
                </button>

                <div className="my-1 border-t border-gray-200"></div>

                <button 
                  className="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-start" 
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


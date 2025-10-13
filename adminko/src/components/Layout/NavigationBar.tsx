import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const NavigationBar: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Инициализация Preline после рендера
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navLinkClass = (path: string) => `
    py-1.5 px-2.5 xl:px-2 flex items-center gap-x-2 text-[13px] text-start text-nowrap 
    rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none
    ${
      isActive(path)
        ? 'bg-gray-100 text-gray-800 focus:bg-gray-200'
        : 'text-gray-800 hover:bg-gray-100 focus:bg-gray-100'
    }
  `;

  return (
    <nav className="relative bg-white border-b border-gray-200">
      <div className="max-w-[85rem] flex flex-wrap basis-full items-center w-full mx-auto lg:py-2.5 px-4 sm:px-6 lg:px-8">
        {/* Nav Links */}
        <div className="basis-full grow lg:basis-auto lg:grow-0 lg:w-full">
          <div className="lg:flex lg:flex-wrap lg:items-center lg:gap-x-1 py-1.5 lg:py-0 space-y-0.5 lg:space-y-0">
            
            {/* Dashboard */}
            <Link to="/" className={navLinkClass('/')}>
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16v5" />
                <path d="M16 14v7" />
                <path d="M20 10v11" />
                <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
                <path d="M4 18v3" />
                <path d="M8 14v7" />
              </svg>
              Dashboard
            </Link>

            {/* Users (заменяем Customers) */}
            <Link to="/users" className={navLinkClass('/users')}>
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Пользователи
            </Link>

            {/* Factors */}
            <Link to="/factors" className={navLinkClass('/factors')}>
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M8 7v7" />
                <path d="M12 7v4" />
                <path d="M16 7v9" />
              </svg>
              Факторы
            </Link>

            {/* Reports */}
            <Link to="/reports" className={navLinkClass('/reports')}>
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              Отчеты
            </Link>

            {/* Settings */}
            <Link to="/settings" className={navLinkClass('/settings')}>
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Настройки
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};


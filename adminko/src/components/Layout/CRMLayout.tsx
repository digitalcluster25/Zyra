import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { NavigationBar } from './NavigationBar';

export const CRMLayout: React.FC = () => {
  return (
    <div className="h-dvh flex flex-col bg-gray-50">
      {/* Header (темный + светлый) */}
      <header className="flex flex-col z-50">
        <TopHeader />
        <NavigationBar />
      </header>

      {/* Main Content */}
      <main id="content" className="relative h-dvh flex flex-col justify-end overflow-hidden">
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};


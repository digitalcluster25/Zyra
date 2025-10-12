import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from './src/hooks/useAuth';
import { useCheckIns } from './src/hooks/useCheckIns';
import { useFactors } from './src/hooks/useFactors';
import Dashboard from './components/Dashboard';
import CheckInFlow from './components/CheckInFlow';
import Insights from './components/Insights';
import Profile from './components/Profile';
import Login from './components/Login';
import Terms from './components/Terms';
import Contact from './components/Contact';
import Footer from './components/Footer';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from './components/ui/navigation-menu';
import { Button } from './components/ui/button';
import { View, CheckInRecord } from './types';

const App: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [view, setView] = useState<View>(View.Dashboard);
  const { checkIns, addCheckIn, importCheckIns, isLoading: checkInsLoading } = useCheckIns();
  const { factors, isLoading: factorsLoading } = useFactors();
  const [showImportBanner, setShowImportBanner] = useState(false);

  // Проверяем наличие старых данных в localStorage при загрузке
  useEffect(() => {
    if (isAuthenticated && !checkInsLoading) {
      const oldCheckIns = localStorage.getItem('checkInHistory');
      if (oldCheckIns) {
        try {
          const parsed = JSON.parse(oldCheckIns);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setShowImportBanner(true);
          }
        } catch (e) {
          console.error('Failed to parse old check-ins:', e);
        }
      }
    }
  }, [isAuthenticated, checkInsLoading]);

  const handleImportOldData = async () => {
    const oldCheckIns = localStorage.getItem('checkInHistory');
    if (oldCheckIns) {
      try {
        const parsed = JSON.parse(oldCheckIns);
        await importCheckIns(parsed);
        localStorage.removeItem('checkInHistory'); // Удаляем старые данные
        setShowImportBanner(false);
        alert('Данные успешно импортированы!');
      } catch (e) {
        console.error('Failed to import old check-ins:', e);
        alert('Ошибка импорта данных');
      }
    }
  };

  const handleAddCheckIn = useCallback(async (data: any) => {
    try {
      await addCheckIn(data);
      setView(View.Dashboard);
    } catch (error) {
      console.error('Failed to add check-in:', error);
      alert('Ошибка сохранения чекина');
    }
  }, [addCheckIn]);

  // Показываем loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-xl font-semibold text-slate-700 mb-2">Загрузка...</div>
          <div className="text-sm text-slate-500">Инициализация приложения</div>
        </div>
      </div>
    );
  }

  // Если не авторизован, показываем логин
  if (!isAuthenticated) {
    return <Login />;
  }

  const renderView = () => {
    switch (view) {
      case View.Dashboard:
        return <Dashboard 
          checkInHistory={checkIns} 
          factors={factors}
          onStartCheckIn={() => setView(View.CheckIn)} 
        />;
      case View.CheckIn:
        return <CheckInFlow 
          onCheckInComplete={handleAddCheckIn} 
          factors={factors}
          previousRecord={checkIns[0]}
        />;
      case View.Insights:
        return <Insights checkInHistory={checkIns} factors={factors} />;
      case View.Profile:
        return <Profile />;
      case View.Terms:
        return <Terms />;
      case View.Contact:
        return <Contact />;
      default:
        return <Dashboard 
          checkInHistory={checkIns} 
          factors={factors}
          onStartCheckIn={() => setView(View.CheckIn)} 
        />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto p-4 md:p-8 max-w-[1382px]">
          {/* Import Banner */}
          {showImportBanner && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-900">Найдены старые данные</p>
                <p className="text-sm text-blue-700">
                  Хотите импортировать чекины из локального хранилища?
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowImportBanner(false)}
                >
                  Отмена
                </Button>
                <Button
                  size="sm"
                  onClick={handleImportOldData}
                >
                  Импортировать
                </Button>
              </div>
            </div>
          )}

          <header className="flex justify-between items-center mb-8">
            <div 
              onClick={() => setView(View.Dashboard)}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <h1 className="text-3xl font-bold text-slate-700 font-ubuntu">ZYRA</h1>
            </div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => setView(View.Dashboard)}
                    className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                      view === View.Dashboard 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                    }`}
                  >
                    Панель
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => setView(View.Insights)}
                    className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                      view === View.Insights 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                    }`}
                  >
                    Аналитика
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => setView(View.Profile)}
                    className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                      view === View.Profile 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                    }`}
                  >
                    Профиль
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </header>
          <main>
            {renderView()}
          </main>
        </div>
      </div>
      <Footer onNavigate={(viewName) => setView(viewName as View)} />
    </div>
  );
};

export default App;
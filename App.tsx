import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
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
import { View, CheckInRecord, Factor } from './types';
import { INITIAL_FACTORS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [checkInHistory, setCheckInHistory] = useLocalStorage<CheckInRecord[]>('checkInHistory', []);
  const [factors, setFactors] = useLocalStorage<Factor[]>('factors', INITIAL_FACTORS);

  const handleAddCheckIn = useCallback((newRecord: CheckInRecord) => {
    setCheckInHistory(prev => [newRecord, ...prev]);
    setView(View.Dashboard);
  }, [setCheckInHistory]);

  const renderView = () => {
    switch (view) {
      case View.Dashboard:
        return <Dashboard 
          checkInHistory={checkInHistory} 
          factors={factors}
          onStartCheckIn={() => setView(View.CheckIn)} 
        />;
      case View.CheckIn:
        return <CheckInFlow 
          onCheckInComplete={handleAddCheckIn} 
          factors={factors}
        />;
      case View.Insights:
        return <Insights checkInHistory={checkInHistory} factors={factors} />;
      case View.Profile:
        return <Profile />;
      case View.Login:
        return <Login />;
      case View.Terms:
        return <Terms />;
      case View.Contact:
        return <Contact />;
      default:
        return <Dashboard 
          checkInHistory={checkInHistory} 
          factors={factors}
          onStartCheckIn={() => setView(View.CheckIn)} 
        />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto p-4 md:p-8 max-w-screen-2xl">
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
                        ? 'text-emerald-600 bg-emerald-100' 
                        : 'text-slate-500 hover:bg-slate-100'
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
                        ? 'text-emerald-600 bg-emerald-100' 
                        : 'text-slate-500 hover:bg-slate-100'
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
                        ? 'text-emerald-600 bg-emerald-100' 
                        : 'text-slate-500 hover:bg-slate-100'
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
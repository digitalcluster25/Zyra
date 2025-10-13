import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Обёртка для инициализации Preline
function AppWithPreline() {
  useEffect(() => {
    // Динамический импорт Preline для корректной инициализации
    import('preline/preline').then(() => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    });
  }, []);

  useEffect(() => {
    // Переинициализация при изменении роута
    const handleRouteChange = () => {
      setTimeout(() => {
        if (window.HSStaticMethods) {
          window.HSStaticMethods.autoInit();
        }
      }, 100);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithPreline />
  </StrictMode>,
)

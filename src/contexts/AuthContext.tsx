import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface User {
  id: string;
  email: string;
  nickname?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tempSessionId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  linkTempSession: (userId: string, tempSessionId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tempSessionId, setTempSessionId] = useState<string | null>(null);

  // Генерация уникального ID для временной сессии
  const generateTempSessionId = () => {
    return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Инициализация при загрузке
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem('zyra_access_token');
        const savedUser = localStorage.getItem('zyra_user');
        const savedTempSession = localStorage.getItem('zyra_temp_session');
        
        if (accessToken && savedUser) {
          // Проверяем валидность токена через API
          try {
            const response = await axios.get(`${API_URL}/api/auth/me`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            setUser(response.data.data.user);
          } catch (error) {
            // Токен невалиден, очищаем
            localStorage.removeItem('zyra_access_token');
            localStorage.removeItem('zyra_refresh_token');
            localStorage.removeItem('zyra_user');
            
            // Создаем временную сессию
            const newTempSession = generateTempSessionId();
            setTempSessionId(newTempSession);
            localStorage.setItem('zyra_temp_session', newTempSession);
          }
        } else if (savedTempSession) {
          setTempSessionId(savedTempSession);
        } else {
          // Создаем новую временную сессию
          const newTempSession = generateTempSessionId();
          setTempSessionId(newTempSession);
          localStorage.setItem('zyra_temp_session', newTempSession);
        }
      } catch (error) {
        console.error('Ошибка инициализации авторизации:', error);
        // Создаем новую временную сессию при ошибке
        const newTempSession = generateTempSessionId();
        setTempSessionId(newTempSession);
        localStorage.setItem('zyra_temp_session', newTempSession);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      const { user, accessToken, refreshToken } = response.data.data;

      setUser(user);
      localStorage.setItem('zyra_user', JSON.stringify(user));
      localStorage.setItem('zyra_access_token', accessToken);
      localStorage.setItem('zyra_refresh_token', refreshToken);
      localStorage.removeItem('zyra_temp_session');
      setTempSessionId(null);
      
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, nickname: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        nickname
      });

      const { user, accessToken, refreshToken } = response.data.data;

      setUser(user);
      localStorage.setItem('zyra_user', JSON.stringify(user));
      localStorage.setItem('zyra_access_token', accessToken);
      localStorage.setItem('zyra_refresh_token', refreshToken);
      localStorage.removeItem('zyra_temp_session');
      setTempSessionId(null);
      
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const linkTempSession = async (userId: string, tempSessionId: string) => {
    try {
      // TODO: Реализовать API вызов для связывания данных
      console.log('Link temp session:', { userId, tempSessionId });
      
      // Имитация связывания данных
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // После связывания удаляем временную сессию
      localStorage.removeItem('zyra_temp_session');
      setTempSessionId(null);
      
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка связывания данных');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zyra_user');
    localStorage.removeItem('zyra_access_token');
    localStorage.removeItem('zyra_refresh_token');
    
    // Создаем новую временную сессию после выхода
    const newTempSession = generateTempSessionId();
    setTempSessionId(newTempSession);
    localStorage.setItem('zyra_temp_session', newTempSession);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    tempSessionId,
    login,
    register,
    logout,
    linkTempSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


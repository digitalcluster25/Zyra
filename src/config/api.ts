/**
 * API Configuration
 * 
 * Централизованная конфигурация для API endpoints.
 * Легко изменяется через переменные окружения.
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      ME: '/api/auth/me',
    },
    CHECKINS: {
      BASE: '/api/checkins',
      STATS: '/api/checkins/stats',
      IMPORT: '/api/checkins/import',
    },
    FACTORS: {
      BASE: '/api/factors',
    },
    ADMIN: {
      USERS: '/api/admin/users',
      FACTORS: '/api/admin/factors',
    },
  },
  TIMEOUT: 30000, // 30 секунд
} as const;

/**
 * Получить полный URL для endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};


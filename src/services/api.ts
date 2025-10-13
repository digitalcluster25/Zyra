import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://backend-api-production-0649.up.railway.app' 
    : 'http://localhost:3001');

// Создаём axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor для обработки ошибок и refresh токена
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Если 401 и есть refresh token
    if (error.response?.status === 401 && originalRequest) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken,
          });

          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);

          // Повторить оригинальный запрос
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email: string, password: string, nickname: string) =>
    api.post('/api/auth/register', { email, password, nickname }),
  
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  logout: () => api.post('/api/auth/logout'),
  
  me: () => api.get('/api/auth/me'),
};

// Check-ins API
export const checkInsAPI = {
  getAll: () => api.get('/api/checkins'),
  
  getById: (id: string) => api.get(`/api/checkins/${id}`),
  
  create: (data: any) => api.post('/api/checkins', data),
  
  update: (id: string, data: any) => api.put(`/api/checkins/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/checkins/${id}`),
  
  import: (checkIns: any[]) => api.post('/api/checkins/import', { checkIns }),
  
  getStats: () => api.get('/api/checkins/stats'),
};

// Factors API
export const factorsAPI = {
  getAll: () => api.get('/api/factors'),
};

// Goals API
export const goalsAPI = {
  getAll: () => api.get('/api/goals'),
  
  create: (data: any) => api.post('/api/goals', data),
  
  update: (id: string, data: any) => api.put(`/api/goals/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/goals/${id}`),
};


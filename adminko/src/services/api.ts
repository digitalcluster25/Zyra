import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://zyra-back-production.up.railway.app' 
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

// Response interceptor для обработки ошибок
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
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  logout: () => api.post('/api/auth/logout'),
  
  me: () => api.get('/api/auth/me'),
};

// Users API (Admin)
export const usersAPI = {
  getAll: (page = 1, limit = 20) =>
    api.get(`/api/admin/users?page=${page}&limit=${limit}`),
  
  getById: (id: string) => api.get(`/api/admin/users/${id}`),
  
  create: (data: { email: string; password: string; nickname: string; role?: string }) =>
    api.post('/api/admin/users', data),
  
  update: (id: string, data: any) => api.put(`/api/admin/users/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/admin/users/${id}`),
  
  activate: (id: string) => api.patch(`/api/admin/users/${id}/activate`),
  
  deactivate: (id: string) => api.patch(`/api/admin/users/${id}/deactivate`),
};

// Factors API (Admin)
export const factorsAPI = {
  getAll: () => api.get('/api/admin/factors'),
  
  create: (data: { key: string; name: string; weight: number; tau: number }) =>
    api.post('/api/admin/factors', data),
  
  update: (id: string, data: any) => api.put(`/api/admin/factors/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/admin/factors/${id}`),
};


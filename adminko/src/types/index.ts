export interface User {
  id: string;
  email: string;
  nickname: string;
  role: 'user' | 'admin' | 'coach';
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
  metadata: Record<string, any>;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Factor {
  id: string;
  key: string;
  name: string;
  weight: number;
  tau: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


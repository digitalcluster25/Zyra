import { Request } from 'express';

// ==================== User Types ====================

export interface User {
  id: string;
  email: string;
  password_hash: string;
  nickname: string;
  role: 'user' | 'admin' | 'coach';
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
  is_active: boolean;
  metadata: Record<string, any>;
}

export interface UserCreateInput {
  email: string;
  password: string;
  nickname: string;
  role?: 'user' | 'admin' | 'coach';
}

export interface UserUpdateInput {
  email?: string;
  nickname?: string;
  role?: 'user' | 'admin' | 'coach';
  is_active?: boolean;
}

export type UserPublic = Omit<User, 'password_hash'>;

// ==================== CheckIn Types ====================

export interface CheckIn {
  id: string;
  user_id: string;
  checkin_date: Date;
  
  // Индекс Хупера
  sleep_quality: number;
  fatigue: number;
  muscle_soreness: number;
  stress: number;
  mood: number;
  
  // Дополнительные метрики
  focus: number | null;
  motivation: number | null;
  
  // sRPE
  had_training: boolean;
  training_duration: number | null;
  rpe: number | null;
  
  // Расчетные показатели
  hooper_index: number;
  daily_load: number;
  ctl: number;
  atl: number;
  tsb: number;
  
  created_at: Date;
  updated_at: Date;
}

export interface CheckInCreateInput {
  sleep_quality: number;
  fatigue: number;
  muscle_soreness: number;
  stress: number;
  mood: number;
  focus?: number;
  motivation?: number;
  had_training: boolean;
  training_duration?: number;
  rpe?: number;
  factors?: string[]; // factor keys
}

export interface CheckInWithFactors extends CheckIn {
  factors: Factor[];
}

// ==================== Factor Types ====================

export interface Factor {
  id: string;
  key: string;
  name: string;
  weight: number;
  tau: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface FactorCreateInput {
  key: string;
  name: string;
  weight: number;
  tau: number;
}

export interface FactorUpdateInput {
  name?: string;
  weight?: number;
  tau?: number;
  is_active?: boolean;
}

// ==================== Auth Types ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'coach';
}

// ==================== Request Types ====================

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

// ==================== Response Types ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== Stats Types ====================

export interface CheckInStats {
  totalCheckins: number;
  avgHooperIndex: number;
  avgDailyLoad: number;
  currentCTL: number;
  currentATL: number;
  currentTSB: number;
  streak: number;
}


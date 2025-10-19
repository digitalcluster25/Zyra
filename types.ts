import React from 'react';

export enum View {
  Dashboard = 'DASHBOARD',
  CheckIn = 'CHECKIN',
  Insights = 'INSIGHTS',
  Profile = 'PROFILE',
  Login = 'LOGIN',
  Auth = 'AUTH',
  SetPassword = 'SET_PASSWORD',
  Terms = 'TERMS',
  Contact = 'CONTACT',
}

// FIX: Add Goal interface for use in Goals and LogGoalFlow components.
export interface Goal {
  id: string;
  title: string;
  description: string;
  active: boolean;
  isCustom: boolean;
}

// Индекс Хупера (Hooper Index) - 5 основных метрик
export interface CheckInData {
  // Основные метрики Хупера (1-7, где 1=отлично, 7=ужасно)
  sleepQuality: number;      // Качество сна
  fatigue: number;           // Уровень усталости (заменяет energyLevel)
  muscleSoreness: number;    // Боль в мышцах
  stress: number;            // Уровень стресса (заменяет stressLevel)
  mood: number;              // Настроение
  
  // Дополнительные метрики (опционально)
  motivation?: number;       // 1-7
  focus?: number;            // 1-7
  
  // Метод sRPE (session Rating of Perceived Exertion)
  hadTraining: boolean;      // Была ли тренировка
  trainingDuration?: number; // Длительность в минутах
  rpe?: number;              // Воспринимаемая нагрузка (0-10, шкала Борга)
  trainingLoad?: number;     // Вычисляется: duration × RPE
  
  // Факторы (существующая система)
  factors: string[];
  
  // LEGACY FIELDS (для обратной совместимости, помечены как deprecated)
  /** @deprecated Используйте fatigue (инвертированное значение) */
  energyLevel?: number;
  /** @deprecated Используйте stress */
  stressLevel?: number;
  /** @deprecated Используйте trainingLoad */
  tss?: number;
}

export interface CheckInRecord {
  id: string; // ISO timestamp
  data: CheckInData;
  
  // Расчетные показатели
  hooperIndex?: number;      // Индекс Хупера (5-35)
  dailyLoad?: number;        // Тренировочная нагрузка за день
  
  // Модель Фитнес-Усталость (Banister Model)
  ctl?: number;              // Chronic Training Load (долгосрочная адаптация)
  atl?: number;              // Acute Training Load (краткосрочная усталость)
  tsb?: number;              // Training Stress Balance (форма/готовность)
  
  // LEGACY FIELD (для обратной совместимости)
  /** @deprecated Используйте hooperIndex */
  recoveryScore?: number;
}

export interface Factor {
  id: string; // factor_key
  key?: string;
  name: string;
  weight: number;
  tau: number;
  active?: boolean;
  factor_type?: 'lifestyle_positive' | 'lifestyle_negative' | 'dual_nature';
  requires_quantity?: boolean;
  requires_duration?: boolean;
  requires_intensity?: boolean;
  default_k_positive?: number;
  default_tau_positive?: number;
  default_k_negative?: number;
  default_tau_negative?: number;
}

export interface QuantifiedFactorValue {
  quantity?: number;
  duration?: number;
  intensity?: number;
}
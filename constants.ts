import React from 'react';
import { Factor } from './types';

export const EMOJI_SCALE = [
  { emoji: '😔', label: 'Очень низкое' },
  { emoji: '😟', label: 'Низкое' },
  { emoji: '😐', label: 'Нейтральное' },
  { emoji: '🙂', label: 'Хорошее' },
  { emoji: '😄', label: 'Отличное' },
];

// FIX: Add GOAL_ICONS to fix import errors in Goals.tsx and LogGoalFlow.tsx.
export const GOAL_ICONS: { [key: string]: React.ReactNode } = {
  'custom-goal': '🎯',
  // Other predefined goal IDs and their icons could be added here.
};

export const INITIAL_FACTORS: Factor[] = [
    { id: 'lack_sleep', name: 'Недосып', weight: -0.30, tau: 24 },
    { id: 'alcohol', name: 'Алкоголь (последние 24-48h)', weight: -0.20, tau: 12 },
    { id: 'caffeine_late', name: 'Кофеин поздний', weight: -0.08, tau: 8 },
    { id: 'travel_jetlag', name: 'Джетлаг / перелёт', weight: -0.25, tau: 36 },
    { id: 'illness', name: 'Болезнь / симптомы', weight: -0.40, tau: 72 },
    { id: 'high_work_stress', name: 'Рабочий/личный стресс', weight: -0.18, tau: 24 },
    { id: 'heavy_training', name: 'Недавняя очень тяжёлая тренировка', weight: -0.25, tau: 36 },
    { id: 'light_activity', name: 'Лёгкая прогулка / recovery', weight: 0.12, tau: 8 },
    { id: 'meditation', name: 'Медитация / дыхание', weight: 0.10, tau: 6 },
    { id: 'outdoor_time', name: 'Время на природе', weight: 0.12, tau: 12 },
    { id: 'poor_nutrition', name: 'Плохое питание', weight: -0.12, tau: 24 },
    { id: 'hydration_low', name: 'Обезвоживание', weight: -0.10, tau: 12 },
    { id: 'menstrual_phase', name: 'Менструальный фактор', weight: -0.18, tau: 48 },
    { id: 'sleep_environment', name: 'Плохие условия сна (шум, свет)', weight: -0.15, tau: 12 },
];
import { Factor } from './types';

export const INITIAL_FACTORS: Factor[] = [
    { id: 'lack_sleep', name: 'Недосып', weight: -0.30, tau: 24, active: true },
    { id: 'alcohol', name: 'Алкоголь (последние 24-48h)', weight: -0.20, tau: 12, active: true },
    { id: 'caffeine_late', name: 'Кофеин поздний', weight: -0.08, tau: 8, active: true },
    { id: 'travel_jetlag', name: 'Джетлаг / перелёт', weight: -0.25, tau: 36, active: true },
    { id: 'illness', name: 'Болезнь / симптомы', weight: -0.40, tau: 72, active: true },
    { id: 'high_work_stress', name: 'Рабочий/личный стресс', weight: -0.18, tau: 24, active: true },
    { id: 'heavy_training', name: 'Недавняя очень тяжёлая тренировка', weight: -0.25, tau: 36, active: true },
    { id: 'light_activity', name: 'Лёгкая прогулка / recovery', weight: 0.12, tau: 8, active: true },
    { id: 'meditation', name: 'Медитация / дыхание', weight: 0.10, tau: 6, active: true },
    { id: 'outdoor_time', name: 'Время на природе', weight: 0.12, tau: 12, active: true },
    { id: 'poor_nutrition', name: 'Плохое питание', weight: -0.12, tau: 24, active: true },
    { id: 'hydration_low', name: 'Обезвоживание', weight: -0.10, tau: 12, active: true },
    { id: 'menstrual_phase', name: 'Менструальный фактор', weight: -0.18, tau: 48, active: true },
    { id: 'sleep_environment', name: 'Плохие условия сна (шум, свет)', weight: -0.15, tau: 12, active: true },
];
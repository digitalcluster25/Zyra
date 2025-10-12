import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getDetailedAnalytics,
  getForecast,
  getTrainingRecommendation,
  getCurrentBreakdown,
} from '../controllers/analyticsController';

const router = Router();

// Все analytics endpoints требуют аутентификации
router.use(authenticate);

/**
 * GET /api/analytics/detailed
 * Получить детальную временную линию wellness с декомпозицией по факторам
 */
router.get('/detailed', getDetailedAnalytics);

/**
 * GET /api/analytics/current-breakdown
 * Получить текущую (сегодня) декомпозицию wellness
 */
router.get('/current-breakdown', getCurrentBreakdown);

/**
 * GET /api/analytics/forecast?days=7
 * Прогноз wellness на N дней вперед
 */
router.get('/forecast', getForecast);

/**
 * GET /api/analytics/training-recommendation
 * Рекомендация по оптимальному времени для следующей тренировки
 */
router.get('/training-recommendation', getTrainingRecommendation);

export default router;


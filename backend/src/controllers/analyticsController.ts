import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CheckIn } from '../models/CheckIn';
import { Factor } from '../models/Factor';
import { 
  calculateDynamicWellness, 
  convertLegacyCheckInToImpulses,
  forecastWellness,
  recommendNextTraining,
  Impulse
} from '../services/impulseResponseModel';

/**
 * GET /api/analytics/detailed
 * Детальная аналитика с декомпозицией wellness по факторам
 */
export const getDetailedAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Получаем все чекины пользователя
    const checkIns = await CheckIn.findByUserId(userId);
    const factors = await Factor.findAll();
    
    if (checkIns.length === 0) {
      return res.json({
        success: true,
        data: {
          timeline: [],
          totalImpulses: 0,
          message: 'No check-ins found. Start tracking to see analytics.',
        },
      });
    }
    
    // Конвертируем все чекины в импульсы
    const allImpulses: Impulse[] = [];
    for (const checkIn of checkIns) {
      const impulses = convertLegacyCheckInToImpulses(checkIn, factors);
      allImpulses.push(...impulses);
    }
    
    // Рассчитываем wellness для каждого дня от первого чекина до сегодня
    const timeline = [];
    const startDate = new Date(checkIns[checkIns.length - 1].created_at);
    const endDate = new Date();
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const result = calculateDynamicWellness(allImpulses, new Date(d));
      timeline.push({
        date: new Date(d).toISOString().split('T')[0],
        ...result,
      });
    }
    
    res.json({
      success: true,
      data: {
        timeline,
        totalImpulses: allImpulses.length,
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
        },
      },
    });
  } catch (error: any) {
    console.error('Error in getDetailedAnalytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate detailed analytics',
    });
  }
};

/**
 * GET /api/analytics/forecast?days=7
 * Прогноз wellness на N дней вперед
 */
export const getForecast = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const days = parseInt(req.query.days as string) || 7;
    
    if (days < 1 || days > 30) {
      return res.status(400).json({
        success: false,
        error: 'Days must be between 1 and 30',
      });
    }
    
    const checkIns = await CheckIn.findByUserId(userId);
    const factors = await Factor.findAll();
    
    if (checkIns.length === 0) {
      return res.json({
        success: true,
        data: {
          forecast: [],
          message: 'No check-ins found for forecasting',
        },
      });
    }
    
    // Собираем все импульсы
    const allImpulses: Impulse[] = [];
    for (const checkIn of checkIns) {
      const impulses = convertLegacyCheckInToImpulses(checkIn, factors);
      allImpulses.push(...impulses);
    }
    
    // Прогнозируем
    const forecast = forecastWellness(allImpulses, new Date(), days);
    
    res.json({
      success: true,
      data: {
        forecast: forecast.map(f => ({
          date: f.date.toISOString().split('T')[0],
          wellness: f.wellness,
          confidence: f.confidence,
        })),
        totalImpulses: allImpulses.length,
      },
    });
  } catch (error: any) {
    console.error('Error in getForecast:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate forecast',
    });
  }
};

/**
 * GET /api/analytics/training-recommendation
 * Рекомендация по следующей тренировке
 */
export const getTrainingRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const checkIns = await CheckIn.findByUserId(userId);
    const factors = await Factor.findAll();
    
    if (checkIns.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'Not enough data for recommendation. Track for at least a week.',
        },
      });
    }
    
    // Собираем импульсы
    const allImpulses: Impulse[] = [];
    for (const checkIn of checkIns) {
      const impulses = convertLegacyCheckInToImpulses(checkIn, factors);
      allImpulses.push(...impulses);
    }
    
    // Получаем рекомендацию
    const recommendation = recommendNextTraining(allImpulses, new Date());
    
    res.json({
      success: true,
      data: {
        recommendedDate: recommendation.recommendedDate.toISOString().split('T')[0],
        readinessScore: recommendation.readinessScore,
        reasoning: recommendation.reasoning,
        daysUntilOptimal: Math.ceil(
          (recommendation.recommendedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
    });
  } catch (error: any) {
    console.error('Error in getTrainingRecommendation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate training recommendation',
    });
  }
};

/**
 * GET /api/analytics/current-breakdown
 * Текущая декомпозиция wellness (для сегодня)
 */
export const getCurrentBreakdown = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const checkIns = await CheckIn.findByUserId(userId);
    const factors = await Factor.findAll();
    
    if (checkIns.length === 0) {
      return res.json({
        success: true,
        data: {
          wellness: 100,
          positiveEffects: 0,
          negativeEffects: 0,
          breakdown: [],
          message: 'No check-ins yet',
        },
      });
    }
    
    // Собираем импульсы
    const allImpulses: Impulse[] = [];
    for (const checkIn of checkIns) {
      const impulses = convertLegacyCheckInToImpulses(checkIn, factors);
      allImpulses.push(...impulses);
    }
    
    // Рассчитываем для сегодня
    const result = calculateDynamicWellness(allImpulses, new Date());
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error in getCurrentBreakdown:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate current breakdown',
    });
  }
};


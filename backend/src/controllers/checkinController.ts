import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { CheckInModel } from '../models/CheckIn';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

// Validation schema
const createCheckInSchema = z.object({
  sleep_quality: z.number().int().min(1).max(7),
  fatigue: z.number().int().min(1).max(7),
  muscle_soreness: z.number().int().min(1).max(7),
  stress: z.number().int().min(1).max(7),
  mood: z.number().int().min(1).max(7),
  focus: z.number().int().min(1).max(7).optional(),
  motivation: z.number().int().min(1).max(7).optional(),
  had_training: z.boolean(),
  training_duration: z.number().int().positive().optional(),
  rpe: z.number().int().min(0).max(10).optional(),
  factors: z.array(z.string()).optional(),
});

/**
 * GET /api/checkins
 * Получить чекины текущего пользователя
 */
export const getCheckIns = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await CheckInModel.findByUser(req.user.userId, page, limit);

    res.json({
      success: true,
      data: result.checkins,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/checkins
 * Создать новый чекин
 */
export const createCheckIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const input = createCheckInSchema.parse(req.body);
    const checkIn = await CheckInModel.create(req.user.userId, input);

    res.status(201).json({
      success: true,
      data: { checkIn },
      message: 'Check-in created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/checkins/:id
 * Получить чекин по ID
 */
export const getCheckIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const checkIn = await CheckInModel.findById(req.params.id, req.user.userId);
    if (!checkIn) {
      throw new AppError(404, 'Check-in not found');
    }

    res.json({
      success: true,
      data: { checkIn },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/checkins/:id
 * Удалить чекин
 */
export const deleteCheckIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const deleted = await CheckInModel.delete(req.params.id, req.user.userId);
    if (!deleted) {
      throw new AppError(404, 'Check-in not found');
    }

    res.json({
      success: true,
      message: 'Check-in deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/checkins/stats
 * Получить статистику чекинов
 */
export const getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const stats = await CheckInModel.getStats(req.user.userId);

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/checkins/import
 * Импорт чекинов из localStorage
 */
export const importCheckIns = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { checkins } = req.body;
    if (!Array.isArray(checkins)) {
      throw new AppError(400, 'Invalid checkins data');
    }

    const imported = [];
    for (const oldCheckIn of checkins) {
      try {
        const input = {
          sleep_quality: oldCheckIn.data.sleepQuality,
          fatigue: oldCheckIn.data.fatigue,
          muscle_soreness: oldCheckIn.data.muscleSoreness,
          stress: oldCheckIn.data.stress,
          mood: oldCheckIn.data.mood,
          focus: oldCheckIn.data.focus,
          motivation: oldCheckIn.data.motivation,
          had_training: oldCheckIn.data.hadTraining,
          training_duration: oldCheckIn.data.trainingDuration,
          rpe: oldCheckIn.data.rpe,
          factors: oldCheckIn.data.factors,
        };

        const checkIn = await CheckInModel.create(req.user.userId, input);
        imported.push(checkIn);
      } catch (error) {
        console.error('Failed to import check-in:', error);
      }
    }

    res.json({
      success: true,
      data: { imported: imported.length, total: checkins.length },
      message: `Imported ${imported.length} of ${checkins.length} check-ins`,
    });
  } catch (error) {
    next(error);
  }
};


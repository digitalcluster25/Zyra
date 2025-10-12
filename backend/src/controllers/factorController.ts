import { Response, NextFunction } from 'express';
import { FactorModel } from '../models/Factor';
import { AuthRequest } from '../types';

/**
 * GET /api/factors
 * Получить все активные факторы
 */
export const getFactors = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const factors = await FactorModel.findActive();

    res.json({
      success: true,
      data: { factors },
    });
  } catch (error) {
    next(error);
  }
};


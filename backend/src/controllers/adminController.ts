import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserModel } from '../models/User';
import { FactorModel } from '../models/Factor';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nickname: z.string().min(2).max(100),
  role: z.enum(['user', 'admin', 'coach']).optional(),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  nickname: z.string().min(2).max(100).optional(),
  role: z.enum(['user', 'admin', 'coach']).optional(),
  is_active: z.boolean().optional(),
});

const createFactorSchema = z.object({
  key: z.string().min(2).max(100),
  name: z.string().min(2).max(255),
  weight: z.number().min(-1).max(1),
  tau: z.number().int().positive(),
});

const updateFactorSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  weight: z.number().min(-1).max(1).optional(),
  tau: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
});

// ==================== Users ====================

/**
 * GET /api/admin/users
 * Получить всех пользователей
 */
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await UserModel.findAll(page, limit);

    res.json({
      success: true,
      data: result.users,
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
 * GET /api/admin/users/:id
 * Получить пользователя по ID
 */
export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/users
 * Создать пользователя
 */
export const createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = createUserSchema.parse(req.body);

    const existingUser = await UserModel.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const user = await UserModel.create(input);

    res.status(201).json({
      success: true,
      data: { user },
      message: 'User created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:id
 * Обновить пользователя
 */
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateUserSchema.parse(req.body);

    // Проверить email на уникальность
    if (input.email) {
      const existingUser = await UserModel.findByEmail(input.email);
      if (existingUser && existingUser.id !== req.params.id) {
        throw new AppError(400, 'Email already in use');
      }
    }

    const user = await UserModel.update(req.params.id, input);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      data: { user },
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/users/:id
 * Удалить пользователя
 */
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Запретить удаление самого себя
    if (req.user?.userId === req.params.id) {
      throw new AppError(400, 'Cannot delete yourself');
    }

    const deleted = await UserModel.delete(req.params.id);
    if (!deleted) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/users/:id/activate
 * Активировать пользователя
 */
export const activateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.update(req.params.id, { is_active: true });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      data: { user },
      message: 'User activated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/users/:id/deactivate
 * Деактивировать пользователя
 */
export const deactivateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Запретить деактивацию самого себя
    if (req.user?.userId === req.params.id) {
      throw new AppError(400, 'Cannot deactivate yourself');
    }

    const user = await UserModel.update(req.params.id, { is_active: false });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      data: { user },
      message: 'User deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== Factors ====================

/**
 * GET /api/admin/factors
 * Получить все факторы (включая неактивные)
 */
export const getFactors = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const factors = await FactorModel.findAll();

    res.json({
      success: true,
      data: { factors },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/factors
 * Создать фактор
 */
export const createFactor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = createFactorSchema.parse(req.body);

    const existing = await FactorModel.findByKey(input.key);
    if (existing) {
      throw new AppError(400, 'Factor with this key already exists');
    }

    const factor = await FactorModel.create(input);

    res.status(201).json({
      success: true,
      data: { factor },
      message: 'Factor created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/factors/:id
 * Обновить фактор
 */
export const updateFactor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateFactorSchema.parse(req.body);

    const factor = await FactorModel.update(req.params.id, input);
    if (!factor) {
      throw new AppError(404, 'Factor not found');
    }

    res.json({
      success: true,
      data: { factor },
      message: 'Factor updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/factors/:id
 * Удалить фактор
 */
export const deleteFactor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await FactorModel.delete(req.params.id);
    if (!deleted) {
      throw new AppError(404, 'Factor not found');
    }

    res.json({
      success: true,
      message: 'Factor deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


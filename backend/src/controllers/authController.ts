import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserModel } from '../models/User';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, TokenPayload } from '../types';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nickname: z.string().min(2).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * Генерация JWT токенов
 */
function generateTokens(payload: TokenPayload) {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
}

/**
 * POST /api/auth/register
 * Регистрация нового пользователя
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = registerSchema.parse(req.body);

    // Проверить существование пользователя
    const existingUser = await UserModel.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    // Создать пользователя
    const user = await UserModel.create(input);

    // Генерировать токены
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Вход пользователя
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = loginSchema.parse(req.body);

    // Найти пользователя
    const user = await UserModel.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Проверить активность
    if (!user.is_active) {
      throw new AppError(403, 'Account is inactive');
    }

    // Проверить пароль
    const isValidPassword = await UserModel.verifyPassword(user, input.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Обновить last_login
    await UserModel.updateLastLogin(user.id);

    // Генерировать токены
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Убрать password_hash из ответа
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Получить текущего пользователя
 */
export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const user = await UserModel.findById(req.user.userId);
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
 * POST /api/auth/refresh
 * Обновить access token
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(400, 'Refresh token required');
    }

    // Верифицировать refresh token
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as TokenPayload;

    // Проверить существование пользователя
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.is_active) {
      throw new AppError(401, 'Invalid refresh token');
    }

    // Генерировать новые токены
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid refresh token'));
    } else {
      next(error);
    }
  }
};

/**
 * POST /api/auth/logout
 * Выход (client-side)
 */
export const logout = async (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};


import { query } from '../config/database';

export interface FactorImpulseParams {
  id: string;
  factor_id: string;
  user_id: string;
  k_positive: number;
  tau_positive: number;
  k_negative: number;
  tau_negative: number;
  is_personalized: boolean;
  calibration_samples: number;
  calibration_mse?: number;
  last_calibrated_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export class FactorImpulseParamsModel {
  /**
   * Получить все параметры для пользователя
   */
  static async findByUserId(userId: string): Promise<FactorImpulseParams[]> {
    const result = await query(
      `SELECT fip.*, f.name as factor_name, f.key as factor_key
       FROM factor_impulse_params fip
       JOIN factors f ON f.id = fip.factor_id
       WHERE fip.user_id = $1
       ORDER BY f.name`,
      [userId]
    );
    return result.rows;
  }

  /**
   * Получить параметры для конкретного фактора и пользователя
   */
  static async findByUserAndFactor(
    userId: string,
    factorId: string
  ): Promise<FactorImpulseParams | null> {
    const result = await query(
      'SELECT * FROM factor_impulse_params WHERE user_id = $1 AND factor_id = $2',
      [userId, factorId]
    );
    return result.rows[0] || null;
  }

  /**
   * Создать или обновить параметры (upsert)
   */
  static async upsert(params: Partial<FactorImpulseParams>): Promise<FactorImpulseParams> {
    const result = await query(
      `INSERT INTO factor_impulse_params (
        factor_id, user_id, k_positive, tau_positive, k_negative, tau_negative,
        is_personalized, calibration_samples, calibration_mse, last_calibrated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (factor_id, user_id) 
      DO UPDATE SET
        k_positive = EXCLUDED.k_positive,
        tau_positive = EXCLUDED.tau_positive,
        k_negative = EXCLUDED.k_negative,
        tau_negative = EXCLUDED.tau_negative,
        is_personalized = EXCLUDED.is_personalized,
        calibration_samples = EXCLUDED.calibration_samples,
        calibration_mse = EXCLUDED.calibration_mse,
        last_calibrated_at = EXCLUDED.last_calibrated_at,
        updated_at = NOW()
      RETURNING *`,
      [
        params.factor_id,
        params.user_id,
        params.k_positive || 1.0,
        params.tau_positive || 42.0,
        params.k_negative || 1.0,
        params.tau_negative || 7.0,
        params.is_personalized || false,
        params.calibration_samples || 0,
        params.calibration_mse,
        params.last_calibrated_at,
      ]
    );
    return result.rows[0];
  }

  /**
   * Массовое создание/обновление параметров
   */
  static async bulkUpsert(paramsList: Partial<FactorImpulseParams>[]): Promise<number> {
    if (paramsList.length === 0) return 0;

    const values: any[] = [];
    const placeholders: string[] = [];
    let index = 1;

    for (const params of paramsList) {
      placeholders.push(
        `($${index}, $${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, $${index + 5}, $${index + 6}, $${index + 7}, $${index + 8}, $${index + 9})`
      );
      values.push(
        params.factor_id,
        params.user_id,
        params.k_positive || 1.0,
        params.tau_positive || 42.0,
        params.k_negative || 1.0,
        params.tau_negative || 7.0,
        params.is_personalized || false,
        params.calibration_samples || 0,
        params.calibration_mse,
        params.last_calibrated_at
      );
      index += 10;
    }

    const result = await query(
      `INSERT INTO factor_impulse_params (
        factor_id, user_id, k_positive, tau_positive, k_negative, tau_negative,
        is_personalized, calibration_samples, calibration_mse, last_calibrated_at
      ) VALUES ${placeholders.join(', ')}
      ON CONFLICT (factor_id, user_id) 
      DO UPDATE SET
        k_positive = EXCLUDED.k_positive,
        tau_positive = EXCLUDED.tau_positive,
        k_negative = EXCLUDED.k_negative,
        tau_negative = EXCLUDED.tau_negative,
        is_personalized = EXCLUDED.is_personalized,
        calibration_samples = EXCLUDED.calibration_samples,
        calibration_mse = EXCLUDED.calibration_mse,
        last_calibrated_at = EXCLUDED.last_calibrated_at,
        updated_at = NOW()`,
      values
    );
    
    return result.rowCount ?? 0;
  }

  /**
   * Инициализировать дефолтные параметры для пользователя на основе факторов
   */
  static async initializeDefaultsForUser(userId: string): Promise<number> {
    const result = await query(
      `INSERT INTO factor_impulse_params (
        factor_id, user_id, k_positive, tau_positive, k_negative, tau_negative, is_personalized
      )
      SELECT 
        id as factor_id,
        $1 as user_id,
        default_k_positive as k_positive,
        default_tau_positive as tau_positive,
        default_k_negative as k_negative,
        default_tau_negative as tau_negative,
        false as is_personalized
      FROM factors
      WHERE is_active = true
      ON CONFLICT (factor_id, user_id) DO NOTHING`,
      [userId]
    );
    
    return result.rowCount ?? 0;
  }

  /**
   * Удалить параметры
   */
  static async delete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM factor_impulse_params WHERE id = $1',
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}


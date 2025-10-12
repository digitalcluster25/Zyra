import { query, getClient } from '../config/database';
import { CheckIn, CheckInCreateInput, CheckInWithFactors, CheckInStats } from '../types';
import { AthleteMonitoringService } from '../services/athleteMonitoring';
import { FactorModel } from './Factor';

export class CheckInModel {
  /**
   * Создать чекин
   */
  static async create(userId: string, input: CheckInCreateInput): Promise<CheckIn> {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      // Получить предыдущий чекин для расчета CTL/ATL
      const prevResult = await client.query(
        'SELECT * FROM checkins WHERE user_id = $1 ORDER BY checkin_date DESC LIMIT 1',
        [userId]
      );
      const previousCheckIn = prevResult.rows[0] || null;

      // Расчеты
      const hooperIndex = AthleteMonitoringService.calculateHooperIndex(
        input.sleep_quality,
        input.fatigue,
        input.muscle_soreness,
        input.stress,
        input.mood
      );

      const dailyLoad = input.had_training && input.training_duration && input.rpe !== undefined
        ? AthleteMonitoringService.calculateTrainingLoad(input.training_duration, input.rpe)
        : 0;

      const previousCTL = previousCheckIn?.ctl || 0;
      const previousATL = previousCheckIn?.atl || 0;

      const ctl = AthleteMonitoringService.calculateCTL(previousCTL, dailyLoad);
      const atl = AthleteMonitoringService.calculateATL(previousATL, dailyLoad);
      const tsb = AthleteMonitoringService.calculateTSB(ctl, atl);

      // Создать чекин
      const checkInResult = await client.query(
        `INSERT INTO checkins (
          user_id, sleep_quality, fatigue, muscle_soreness, stress, mood,
          focus, motivation, had_training, training_duration, rpe,
          hooper_index, daily_load, ctl, atl, tsb
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *`,
        [
          userId, input.sleep_quality, input.fatigue, input.muscle_soreness,
          input.stress, input.mood, input.focus, input.motivation,
          input.had_training, input.training_duration, input.rpe,
          hooperIndex, dailyLoad, ctl, atl, tsb
        ]
      );

      const checkIn = checkInResult.rows[0];

      // Добавить факторы (legacy - бинарные)
      if (input.factors && input.factors.length > 0) {
        for (const factorKey of input.factors) {
          const factor = await FactorModel.findByKey(factorKey);
          if (factor) {
            await client.query(
              'INSERT INTO checkin_factors (checkin_id, factor_id) VALUES ($1, $2)',
              [checkIn.id, factor.id]
            );
          }
        }
      }

      // Добавить количественные факторы (Zyra 3.0 Фаза 5)
      if (input.quantified_factors) {
        for (const [factorId, quantData] of Object.entries(input.quantified_factors)) {
          await client.query(
            `INSERT INTO checkin_factors (checkin_id, factor_id, quantity, duration_minutes, intensity_rpe)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              checkIn.id,
              factorId,
              quantData.quantity || null,
              quantData.duration || null,
              quantData.intensity || null,
            ]
          );
        }
      }

      await client.query('COMMIT');
      return checkIn;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Получить чекины пользователя
   */
  static async findByUser(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<{ checkins: CheckInWithFactors[]; total: number }> {
    const offset = (page - 1) * limit;

    const [checkInsResult, countResult] = await Promise.all([
      query(
        `SELECT c.*, 
         COALESCE(
           json_agg(
             json_build_object(
               'id', f.id,
               'key', f.key,
               'name', f.name,
               'weight', f.weight,
               'tau', f.tau,
               'is_active', f.is_active
             )
           ) FILTER (WHERE f.id IS NOT NULL),
           '[]'
         ) as factors
         FROM checkins c
         LEFT JOIN checkin_factors cf ON c.id = cf.checkin_id
         LEFT JOIN factors f ON cf.factor_id = f.id
         WHERE c.user_id = $1
         GROUP BY c.id
         ORDER BY c.checkin_date DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      ),
      query('SELECT COUNT(*) FROM checkins WHERE user_id = $1', [userId])
    ]);

    return {
      checkins: checkInsResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  /**
   * Найти чекин по ID
   */
  static async findById(id: string, userId: string): Promise<CheckInWithFactors | null> {
    const result = await query(
      `SELECT c.*, 
       COALESCE(
         json_agg(
           json_build_object(
             'id', f.id,
             'key', f.key,
             'name', f.name,
             'weight', f.weight,
             'tau', f.tau,
             'is_active', f.is_active
           )
         ) FILTER (WHERE f.id IS NOT NULL),
         '[]'
       ) as factors
       FROM checkins c
       LEFT JOIN checkin_factors cf ON c.id = cf.checkin_id
       LEFT JOIN factors f ON cf.factor_id = f.id
       WHERE c.id = $1 AND c.user_id = $2
       GROUP BY c.id`,
      [id, userId]
    );

    return result.rows[0] || null;
  }

  /**
   * Получить статистику пользователя
   */
  static async getStats(userId: string): Promise<CheckInStats | null> {
    const result = await query(
      `SELECT 
        COUNT(*) as total_checkins,
        AVG(hooper_index) as avg_hooper_index,
        AVG(daily_load) as avg_daily_load,
        (SELECT ctl FROM checkins WHERE user_id = $1 ORDER BY checkin_date DESC LIMIT 1) as current_ctl,
        (SELECT atl FROM checkins WHERE user_id = $1 ORDER BY checkin_date DESC LIMIT 1) as current_atl,
        (SELECT tsb FROM checkins WHERE user_id = $1 ORDER BY checkin_date DESC LIMIT 1) as current_tsb
       FROM checkins
       WHERE user_id = $1`,
      [userId]
    );

    if (!result.rows[0] || result.rows[0].total_checkins === '0') {
      return null;
    }

    const row = result.rows[0];
    return {
      totalCheckins: parseInt(row.total_checkins),
      avgHooperIndex: parseFloat(row.avg_hooper_index) || 0,
      avgDailyLoad: parseFloat(row.avg_daily_load) || 0,
      currentCTL: parseFloat(row.current_ctl) || 0,
      currentATL: parseFloat(row.current_atl) || 0,
      currentTSB: parseFloat(row.current_tsb) || 0,
      streak: 0, // TODO: implement streak calculation
    };
  }

  /**
   * Удалить чекин
   */
  static async delete(id: string, userId: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM checkins WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return (result.rowCount ?? 0) > 0;
  }
}


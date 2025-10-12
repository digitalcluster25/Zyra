import { query } from '../config/database';
import { Factor, FactorCreateInput, FactorUpdateInput } from '../types';

export class FactorModel {
  /**
   * Получить все активные факторы
   */
  static async findActive(): Promise<Factor[]> {
    const result = await query(
      'SELECT * FROM factors WHERE is_active = true ORDER BY name'
    );
    return result.rows;
  }

  /**
   * Получить все факторы (для админа)
   */
  static async findAll(): Promise<Factor[]> {
    const result = await query('SELECT * FROM factors ORDER BY name');
    return result.rows;
  }

  /**
   * Найти фактор по ID
   */
  static async findById(id: string): Promise<Factor | null> {
    const result = await query('SELECT * FROM factors WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Найти фактор по ключу
   */
  static async findByKey(key: string): Promise<Factor | null> {
    const result = await query('SELECT * FROM factors WHERE key = $1', [key]);
    return result.rows[0] || null;
  }

  /**
   * Создать фактор
   */
  static async create(input: FactorCreateInput): Promise<Factor> {
    const result = await query(
      `INSERT INTO factors (key, name, weight, tau, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [input.key, input.name, input.weight, input.tau]
    );
    return result.rows[0];
  }

  /**
   * Обновить фактор
   */
  static async update(id: string, input: FactorUpdateInput): Promise<Factor | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(input.name);
    }
    if (input.weight !== undefined) {
      fields.push(`weight = $${paramIndex++}`);
      values.push(input.weight);
    }
    if (input.tau !== undefined) {
      fields.push(`tau = $${paramIndex++}`);
      values.push(input.tau);
    }
    if (input.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(input.is_active);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE factors
       SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Удалить фактор
   */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM factors WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}


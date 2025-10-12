import bcrypt from 'bcrypt';
import { query } from '../config/database';
import { User, UserCreateInput, UserUpdateInput, UserPublic } from '../types';

export class UserModel {
  /**
   * Создать пользователя
   */
  static async create(input: UserCreateInput): Promise<UserPublic> {
    const passwordHash = await bcrypt.hash(input.password, 10);
    
    const result = await query(
      `INSERT INTO users (email, password_hash, nickname, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, nickname, role, created_at, updated_at, last_login, is_active, metadata`,
      [input.email, passwordHash, input.nickname, input.role || 'user']
    );

    return result.rows[0];
  }

  /**
   * Найти пользователя по email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0] || null;
  }

  /**
   * Найти пользователя по ID
   */
  static async findById(id: string): Promise<UserPublic | null> {
    const result = await query(
      `SELECT id, email, nickname, role, created_at, updated_at, last_login, is_active, metadata
       FROM users WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Получить всех пользователей (для админа)
   */
  static async findAll(page = 1, limit = 20): Promise<{ users: UserPublic[]; total: number }> {
    const offset = (page - 1) * limit;

    const [usersResult, countResult] = await Promise.all([
      query(
        `SELECT id, email, nickname, role, created_at, updated_at, last_login, is_active, metadata
         FROM users
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query('SELECT COUNT(*) FROM users')
    ]);

    return {
      users: usersResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  /**
   * Обновить пользователя
   */
  static async update(id: string, input: UserUpdateInput): Promise<UserPublic | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(input.email);
    }
    if (input.nickname !== undefined) {
      fields.push(`nickname = $${paramIndex++}`);
      values.push(input.nickname);
    }
    if (input.role !== undefined) {
      fields.push(`role = $${paramIndex++}`);
      values.push(input.role);
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
      `UPDATE users
       SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING id, email, nickname, role, created_at, updated_at, last_login, is_active, metadata`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Удалить пользователя
   */
  static async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Проверить пароль
   */
  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  /**
   * Обновить last_login
   */
  static async updateLastLogin(id: string): Promise<void> {
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [id]);
  }

  /**
   * Сменить пароль
   */
  static async changePassword(id: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [passwordHash, id]);
  }
}


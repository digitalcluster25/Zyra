import { Pool, PoolClient, QueryResult } from 'pg';
import { env } from './env';

// Создаем пул соединений
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Обработка ошибок пула
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

/**
 * Выполнить SQL запрос
 */
export async function query(
  text: string,
  params?: any[]
): Promise<QueryResult> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Получить клиента для транзакций
 */
export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

/**
 * Проверить подключение к БД
 */
export async function testConnection(): Promise<boolean> {
  try {
    await query('SELECT NOW()');
    console.log('✅ Database connection established');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * Закрыть все соединения
 */
export async function closePool(): Promise<void> {
  await pool.end();
  console.log('Database pool closed');
}


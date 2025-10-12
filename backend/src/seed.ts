import bcrypt from 'bcrypt';
import { pool, closePool } from './config/database';
import { env } from './config/env';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...\n');

    // 1. Создать админа
    console.log('  Creating admin user...');
    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
    
    await pool.query(
      `INSERT INTO users (email, password_hash, nickname, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [env.ADMIN_EMAIL, passwordHash, 'Admin', 'admin']
    );
    console.log('  ✅ Admin user created\n');

    // 2. Создать факторы
    console.log('  Creating factors...');
    const factors = [
      { key: 'lack_sleep', name: 'Недосып', weight: -0.30, tau: 24 },
      { key: 'alcohol', name: 'Алкоголь (последние 24-48h)', weight: -0.20, tau: 12 },
      { key: 'caffeine_late', name: 'Кофеин поздний', weight: -0.08, tau: 8 },
      { key: 'travel_jetlag', name: 'Джетлаг / перелёт', weight: -0.25, tau: 36 },
      { key: 'illness', name: 'Болезнь / симптомы', weight: -0.40, tau: 72 },
      { key: 'high_work_stress', name: 'Рабочий/личный стресс', weight: -0.18, tau: 24 },
      { key: 'heavy_training', name: 'Недавняя очень тяжёлая тренировка', weight: -0.25, tau: 36 },
      { key: 'light_activity', name: 'Лёгкая прогулка / recovery', weight: 0.12, tau: 8 },
      { key: 'meditation', name: 'Медитация / дыхание', weight: 0.10, tau: 6 },
      { key: 'outdoor_time', name: 'Время на природе', weight: 0.12, tau: 12 },
      { key: 'poor_nutrition', name: 'Плохое питание', weight: -0.12, tau: 24 },
      { key: 'hydration_low', name: 'Обезвоживание', weight: -0.10, tau: 12 },
      { key: 'menstrual_phase', name: 'Менструальный фактор', weight: -0.18, tau: 48 },
      { key: 'sleep_environment', name: 'Плохие условия сна (шум, свет)', weight: -0.15, tau: 12 },
    ];

    for (const factor of factors) {
      await pool.query(
        `INSERT INTO factors (key, name, weight, tau, is_active)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (key) DO NOTHING`,
        [factor.key, factor.name, factor.weight, factor.tau, true]
      );
    }
    console.log(`  ✅ ${factors.length} factors created\n`);

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await closePool();
  }
}

seedDatabase();


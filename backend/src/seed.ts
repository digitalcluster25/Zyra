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

    // 2. Создать факторы с параметрами импульсно-откликовой модели
    console.log('  Creating factors with impulse-response parameters...');
    const factors = [
      // Негативные факторы
      { 
        key: 'lack_sleep', 
        name: 'Недосып', 
        factor_type: 'lifestyle_negative',
        requires_quantity: false, requires_duration: true, requires_intensity: false,
        k_pos: 0.0, tau_pos: 42.0, k_neg: 3.0, tau_neg: 12.0,
      },
      { 
        key: 'alcohol', 
        name: 'Алкоголь', 
        factor_type: 'lifestyle_negative',
        requires_quantity: true, requires_duration: false, requires_intensity: false,
        k_pos: 0.0, tau_pos: 42.0, k_neg: 2.5, tau_neg: 18.0,
      },
      { 
        key: 'caffeine_late', 
        name: 'Кофеин поздний', 
        factor_type: 'lifestyle_negative',
        requires_quantity: true, requires_duration: false, requires_intensity: false,
        k_pos: 0.0, tau_pos: 42.0, k_neg: 1.2, tau_neg: 8.0,
      },
      { 
        key: 'poor_nutrition', 
        name: 'Плохое питание', 
        factor_type: 'lifestyle_negative',
        requires_quantity: false, requires_duration: false, requires_intensity: false,
        k_pos: 0.0, tau_pos: 42.0, k_neg: 1.8, tau_neg: 14.0,
      },
      { 
        key: 'high_work_stress', 
        name: 'Высокий стресс', 
        factor_type: 'lifestyle_negative',
        requires_quantity: false, requires_duration: false, requires_intensity: true,
        k_pos: 0.0, tau_pos: 42.0, k_neg: 2.8, tau_neg: 10.0,
      },
      { 
        key: 'illness', 
        name: 'Болезнь/простуда', 
        factor_type: 'lifestyle_negative',
        requires_quantity: false, requires_duration: false, requires_intensity: true,
        k_pos: 0.0, tau_pos: 42.0, k_neg: 5.0, tau_neg: 48.0,
      },
      { 
        key: 'hydration_low', 
        name: 'Обезвоживание', 
        factor_type: 'lifestyle_negative',
        requires_quantity: false, requires_duration: false, requires_intensity: false,
        k_pos: 0.0, tau_pos: 42.0, k_neg: 1.5, tau_neg: 8.0,
      },
      
      // Позитивные факторы
      { 
        key: 'cold_exposure', 
        name: 'Холодовое воздействие', 
        factor_type: 'lifestyle_positive',
        requires_quantity: false, requires_duration: true, requires_intensity: false,
        k_pos: 2.0, tau_pos: 12.0, k_neg: 0.5, tau_neg: 4.0,
      },
      { 
        key: 'meditation', 
        name: 'Медитация/йога', 
        factor_type: 'lifestyle_positive',
        requires_quantity: false, requires_duration: true, requires_intensity: false,
        k_pos: 1.8, tau_pos: 16.0, k_neg: 0.0, tau_neg: 7.0,
      },
      { 
        key: 'massage', 
        name: 'Массаж', 
        factor_type: 'lifestyle_positive',
        requires_quantity: false, requires_duration: true, requires_intensity: false,
        k_pos: 2.5, tau_pos: 24.0, k_neg: 0.0, tau_neg: 7.0,
      },
      { 
        key: 'good_social', 
        name: 'Социальное взаимодействие', 
        factor_type: 'lifestyle_positive',
        requires_quantity: false, requires_duration: true, requires_intensity: false,
        k_pos: 1.2, tau_pos: 14.0, k_neg: 0.0, tau_neg: 7.0,
      },
      
      // Двойственные факторы
      { 
        key: 'outdoor_time', 
        name: 'Время на природе', 
        factor_type: 'dual_nature',
        requires_quantity: false, requires_duration: true, requires_intensity: true,
        k_pos: 1.5, tau_pos: 20.0, k_neg: 0.8, tau_neg: 6.0,
      },
      { 
        key: 'travel_jetlag', 
        name: 'Поездка/джетлаг', 
        factor_type: 'dual_nature',
        requires_quantity: false, requires_duration: true, requires_intensity: false,
        k_pos: 0.5, tau_pos: 14.0, k_neg: 2.2, tau_neg: 24.0,
      },
    ];

    for (const factor of factors) {
      // Legacy поля weight и tau (required в таблице)
      const legacyWeight = factor.k_neg > factor.k_pos ? -factor.k_neg : factor.k_pos;
      const legacyTau = Math.round((factor.tau_pos + factor.tau_neg) / 2 / 24); // Среднее в днях

      await pool.query(
        `INSERT INTO factors (
          key, name, weight, tau, factor_type, is_active,
          requires_quantity, requires_duration, requires_intensity,
          default_k_positive, default_tau_positive,
          default_k_negative, default_tau_negative
        )
        VALUES ($1, $2, $3, $4, $5, true, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (key) 
        DO UPDATE SET
          name = EXCLUDED.name,
          weight = EXCLUDED.weight,
          tau = EXCLUDED.tau,
          factor_type = EXCLUDED.factor_type,
          requires_quantity = EXCLUDED.requires_quantity,
          requires_duration = EXCLUDED.requires_duration,
          requires_intensity = EXCLUDED.requires_intensity,
          default_k_positive = EXCLUDED.default_k_positive,
          default_tau_positive = EXCLUDED.default_tau_positive,
          default_k_negative = EXCLUDED.default_k_negative,
          default_tau_negative = EXCLUDED.default_tau_negative`,
        [
          factor.key, factor.name, legacyWeight, legacyTau, factor.factor_type,
          factor.requires_quantity, factor.requires_duration, factor.requires_intensity,
          factor.k_pos, factor.tau_pos, factor.k_neg, factor.tau_neg
        ]
      );
    }
    console.log(`  ✅ ${factors.length} factors created with impulse-response parameters\n`);

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await closePool();
  }
}

seedDatabase();


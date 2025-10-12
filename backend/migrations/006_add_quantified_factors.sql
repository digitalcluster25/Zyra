-- Миграция 006: Добавление поддержки количественных факторов и импульсно-откликовой модели
-- Реализует научно обоснованную модель Банистера для всех факторов

-- 1. Расширяем таблицу checkin_factors для количественных данных
ALTER TABLE checkin_factors ADD COLUMN IF NOT EXISTS quantity FLOAT;
ALTER TABLE checkin_factors ADD COLUMN IF NOT EXISTS duration_minutes INT;
ALTER TABLE checkin_factors ADD COLUMN IF NOT EXISTS intensity_rpe FLOAT CHECK (intensity_rpe IS NULL OR (intensity_rpe >= 0 AND intensity_rpe <= 10));
ALTER TABLE checkin_factors ADD COLUMN IF NOT EXISTS notes TEXT;

COMMENT ON COLUMN checkin_factors.quantity IS 'Количество (например, порций алкоголя, чашек кофе)';
COMMENT ON COLUMN checkin_factors.duration_minutes IS 'Продолжительность в минутах';
COMMENT ON COLUMN checkin_factors.intensity_rpe IS 'Интенсивность по шкале RPE (0-10), где 0 = очень легко, 10 = максимум';

-- 2. Расширяем таблицу factors для поддержки количественного ввода
ALTER TABLE factors ADD COLUMN IF NOT EXISTS factor_type VARCHAR(50) DEFAULT 'lifestyle';
ALTER TABLE factors ADD COLUMN IF NOT EXISTS requires_quantity BOOLEAN DEFAULT FALSE;
ALTER TABLE factors ADD COLUMN IF NOT EXISTS requires_duration BOOLEAN DEFAULT FALSE;
ALTER TABLE factors ADD COLUMN IF NOT EXISTS requires_intensity BOOLEAN DEFAULT FALSE;

-- Дефолтные параметры импульсно-откликовой модели (популяционные значения)
ALTER TABLE factors ADD COLUMN IF NOT EXISTS default_k_positive FLOAT DEFAULT 0.0;
ALTER TABLE factors ADD COLUMN IF NOT EXISTS default_tau_positive FLOAT DEFAULT 42.0;
ALTER TABLE factors ADD COLUMN IF NOT EXISTS default_k_negative FLOAT DEFAULT 0.0;
ALTER TABLE factors ADD COLUMN IF NOT EXISTS default_tau_negative FLOAT DEFAULT 7.0;

COMMENT ON COLUMN factors.factor_type IS 'Тип фактора: training, lifestyle_positive, lifestyle_negative, dual_nature';
COMMENT ON COLUMN factors.default_k_positive IS 'Коэффициент усиления положительного эффекта (адаптация/восстановление)';
COMMENT ON COLUMN factors.default_tau_positive IS 'Временная константа положительного эффекта в днях (медленное затухание)';
COMMENT ON COLUMN factors.default_k_negative IS 'Коэффициент усиления отрицательного эффекта (усталость/стресс)';
COMMENT ON COLUMN factors.default_tau_negative IS 'Временная константа отрицательного эффекта в днях (быстрое затухание)';

-- 3. Создаем таблицу для персонализированных параметров модели
CREATE TABLE IF NOT EXISTS factor_impulse_params (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_id UUID NOT NULL REFERENCES factors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Параметры положительного эффекта (фитнес/восстановление)
  k_positive FLOAT NOT NULL DEFAULT 1.0,
  tau_positive FLOAT NOT NULL DEFAULT 42.0,
  
  -- Параметры отрицательного эффекта (усталость/стресс)
  k_negative FLOAT NOT NULL DEFAULT 1.0,
  tau_negative FLOAT NOT NULL DEFAULT 7.0,
  
  -- Метаданные персонализации
  is_personalized BOOLEAN DEFAULT FALSE,
  calibration_samples INT DEFAULT 0,
  calibration_mse FLOAT,
  last_calibrated_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(factor_id, user_id)
);

COMMENT ON TABLE factor_impulse_params IS 'Персонализированные параметры импульсно-откликовой модели для каждого пользователя';

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_factor_impulse_params_user ON factor_impulse_params(user_id);
CREATE INDEX IF NOT EXISTS idx_factor_impulse_params_factor ON factor_impulse_params(factor_id);
CREATE INDEX IF NOT EXISTS idx_factor_impulse_params_personalized ON factor_impulse_params(user_id, is_personalized);

-- 4. Создаем таблицу для хранения импульсов (оптимизация расчетов)
CREATE TABLE IF NOT EXISTS impulse_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checkin_id UUID NOT NULL REFERENCES checkins(id) ON DELETE CASCADE,
  factor_id UUID REFERENCES factors(id) ON DELETE SET NULL,
  
  -- Данные импульса
  impulse_timestamp TIMESTAMP NOT NULL,
  magnitude FLOAT NOT NULL,
  impulse_type VARCHAR(50) NOT NULL, -- 'training', 'lifestyle', etc.
  
  -- Кэшированные параметры на момент импульса
  k_positive FLOAT NOT NULL,
  tau_positive FLOAT NOT NULL,
  k_negative FLOAT NOT NULL,
  tau_negative FLOAT NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE impulse_cache IS 'Кэш рассчитанных импульсов для ускорения аналитики';

CREATE INDEX IF NOT EXISTS idx_impulse_cache_user_time ON impulse_cache(user_id, impulse_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_impulse_cache_checkin ON impulse_cache(checkin_id);

-- 5. Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Применяем триггер к factor_impulse_params (если еще не существует)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_factor_impulse_params_updated_at'
    ) THEN
        CREATE TRIGGER update_factor_impulse_params_updated_at
            BEFORE UPDATE ON factor_impulse_params
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END$$;

-- 6. Представление для удобного анализа
CREATE OR REPLACE VIEW v_user_wellness_components AS
SELECT 
    u.id as user_id,
    u.nickname,
    c.id as checkin_id,
    c.created_at as checkin_date,
    c.hooper_index,
    c.daily_load,
    c.ctl,
    c.atl,
    c.tsb,
    json_agg(
        json_build_object(
            'factor_name', f.name,
            'factor_type', f.factor_type,
            'quantity', cf.quantity,
            'duration_minutes', cf.duration_minutes,
            'intensity_rpe', cf.intensity_rpe
        )
    ) FILTER (WHERE f.id IS NOT NULL) as factors
FROM users u
JOIN checkins c ON c.user_id = u.id
LEFT JOIN checkin_factors cf ON cf.checkin_id = c.id
LEFT JOIN factors f ON f.id = cf.factor_id
GROUP BY u.id, u.nickname, c.id, c.created_at, c.hooper_index, c.daily_load, c.ctl, c.atl, c.tsb
ORDER BY c.created_at DESC;

COMMENT ON VIEW v_user_wellness_components IS 'Представление для анализа компонентов wellness по чекинам';


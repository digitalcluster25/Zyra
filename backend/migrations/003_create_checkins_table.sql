-- Create checkins table
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checkin_date TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Индекс Хупера (5 метрик)
  sleep_quality INTEGER NOT NULL CHECK (sleep_quality BETWEEN 1 AND 7),
  fatigue INTEGER NOT NULL CHECK (fatigue BETWEEN 1 AND 7),
  muscle_soreness INTEGER NOT NULL CHECK (muscle_soreness BETWEEN 1 AND 7),
  stress INTEGER NOT NULL CHECK (stress BETWEEN 1 AND 7),
  mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 7),
  
  -- Дополнительные метрики
  focus INTEGER CHECK (focus BETWEEN 1 AND 7),
  motivation INTEGER CHECK (motivation BETWEEN 1 AND 7),
  
  -- sRPE метрики
  had_training BOOLEAN DEFAULT false,
  training_duration INTEGER CHECK (training_duration > 0),
  rpe INTEGER CHECK (rpe BETWEEN 0 AND 10),
  
  -- Расчетные показатели
  hooper_index INTEGER NOT NULL,
  daily_load DECIMAL(10,2) DEFAULT 0,
  ctl DECIMAL(10,2) DEFAULT 0,
  atl DECIMAL(10,2) DEFAULT 0,
  tsb DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(checkin_date DESC);
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON checkins(user_id, checkin_date DESC);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_checkins_updated_at ON checkins;
CREATE TRIGGER update_checkins_updated_at BEFORE UPDATE ON checkins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


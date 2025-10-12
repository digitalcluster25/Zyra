-- Create checkin_factors junction table
CREATE TABLE IF NOT EXISTS checkin_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id UUID NOT NULL REFERENCES checkins(id) ON DELETE CASCADE,
  factor_id UUID NOT NULL REFERENCES factors(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(checkin_id, factor_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_checkin_factors_checkin ON checkin_factors(checkin_id);
CREATE INDEX IF NOT EXISTS idx_checkin_factors_factor ON checkin_factors(factor_id);


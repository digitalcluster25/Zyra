-- Create factors table
CREATE TABLE IF NOT EXISTS factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  weight DECIMAL(5,3) NOT NULL,
  tau INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_factors_active ON factors(is_active);
CREATE INDEX IF NOT EXISTS idx_factors_key ON factors(key);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_factors_updated_at ON factors;
CREATE TRIGGER update_factors_updated_at BEFORE UPDATE ON factors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


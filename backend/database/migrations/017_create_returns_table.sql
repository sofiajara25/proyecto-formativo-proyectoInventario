CREATE TABLE IF NOT EXISTS returns (
  id SERIAL PRIMARY KEY,
  material_type VARCHAR(50) NOT NULL,
  loan_id VARCHAR(50) NOT NULL,
  return_date DATE NOT NULL,
  description TEXT,
  quantity INT NOT NULL,
  is_available BOOLEAN DEFAULT FALSE,
  is_maintenance BOOLEAN DEFAULT TRUE,
  is_low BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

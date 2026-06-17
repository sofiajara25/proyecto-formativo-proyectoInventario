CREATE TABLE IF NOT EXISTS returnable_materials (
  id SERIAL PRIMARY KEY,
  tool_id VARCHAR(50) NOT NULL,
  sena_plate VARCHAR(50) NOT NULL,
  serial VARCHAR(50) UNIQUE,
  material_name VARCHAR(100) NOT NULL,
  model VARCHAR(100),
  unit_value NUMERIC(12,2) NOT NULL,
  custodian VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  status VARCHAR(20) NOT NULL,
  total_value NUMERIC(12,2) NOT NULL,
  dimensions VARCHAR(100),
  description TEXT,
  technical_sheet TEXT,
  location VARCHAR(150),
  photo_url TEXT
);

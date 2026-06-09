CREATE TABLE IF NOT EXISTS consumable_materials (
  id SERIAL PRIMARY KEY,
  accountant VARCHAR(100) NOT NULL,   -- cuentadante o responsable
  tool_id VARCHAR(50) NOT NULL,      -- ID herramienta
  sena_plate VARCHAR(50) NOT NULL,   -- placa SENA
  material_name VARCHAR(100) NOT NULL,        -- nombre del material
  entry_date DATE NOT NULL,          -- fecha de ingreso
  quantity INT NOT NULL,             -- cantidad
  location VARCHAR(150),             -- ubicación
  unit_value NUMERIC(12,2) NOT NULL, -- valor unitario
  total_value NUMERIC(12,2) NOT NULL,-- valor total
  status VARCHAR(20) NOT NULL,       -- estado (activo/inactivo)
  description TEXT,                  -- descripción
  photo_url TEXT    
);

-- Catálogo de cotizaciones: se sube el PDF una sola vez aquí, y luego se
-- enlaza a los materiales que apliquen (ver tablas de abajo). No lleva
-- "quotation_id" como FK en materiales porque una misma cotización puede
-- aplicar a varios materiales, y un material puede llevar de 1 a 3
-- cotizaciones (relación muchos a muchos).
CREATE TABLE IF NOT EXISTS quotations (
  quotation_id SERIAL PRIMARY KEY,
  quotation_name VARCHAR(100) NOT NULL,
  pdf_url TEXT NOT NULL,
  -- DEFAULT 'Activo': igual que categorys, el create no manda status desde
  -- el formulario, así que sin este default el INSERT fallaría por violar
  -- el NOT NULL.
  status VARCHAR(20) NOT NULL DEFAULT 'Activo'
);

-- Relación muchos a muchos entre cotizaciones y materiales de consumo.
CREATE TABLE IF NOT EXISTS consumable_material_quotations (
  id SERIAL PRIMARY KEY,
  consumable_material_id INT NOT NULL REFERENCES consumable_materials(id) ON DELETE CASCADE,
  quotation_id INT NOT NULL REFERENCES quotations(quotation_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (consumable_material_id, quotation_id)
);

-- Relación muchos a muchos entre cotizaciones y materiales devolutivos.
CREATE TABLE IF NOT EXISTS returnable_material_quotations (
  id SERIAL PRIMARY KEY,
  returnable_material_id INT NOT NULL REFERENCES returnable_materials(id) ON DELETE CASCADE,
  quotation_id INT NOT NULL REFERENCES quotations(quotation_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (returnable_material_id, quotation_id)
);

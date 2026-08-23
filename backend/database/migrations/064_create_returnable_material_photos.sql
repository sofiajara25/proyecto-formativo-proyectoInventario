-- Galería de fotos adicionales para materiales devolutivos.
-- La primera foto de cada material se sigue guardando en
-- returnable_materials.photo_url (para no romper listados/reportes que ya
-- la usan); esta tabla guarda las fotos EXTRA (2da, 3ra, ...).
CREATE TABLE IF NOT EXISTS returnable_material_photos (
  id SERIAL PRIMARY KEY,
  returnable_material_id INT NOT NULL REFERENCES returnable_materials(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

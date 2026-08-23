-- Galería de fotos adicionales para materiales de consumo.
-- La primera foto de cada material se sigue guardando en
-- consumable_materials.photo_url (para no romper listados/reportes que ya
-- la usan); esta tabla guarda las fotos EXTRA (2da, 3ra, ...).
CREATE TABLE IF NOT EXISTS consumable_material_photos (
  id SERIAL PRIMARY KEY,
  consumable_material_id INT NOT NULL REFERENCES consumable_materials(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

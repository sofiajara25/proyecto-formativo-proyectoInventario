-- Galería de fotos adicionales para préstamos.
-- La primera foto de cada préstamo se sigue guardando en loans.photo_url
-- (para no romper listados/reportes que ya la usan); esta tabla guarda las
-- fotos EXTRA (2da, 3ra, ...).
CREATE TABLE IF NOT EXISTS loan_photos (
  id SERIAL PRIMARY KEY,
  loan_id INT NOT NULL REFERENCES loans(loan_id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

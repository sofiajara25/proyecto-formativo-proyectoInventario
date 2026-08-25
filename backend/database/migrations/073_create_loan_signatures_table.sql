-- Firma electrónica de préstamos, sin exigir que quien recibe el material
-- tenga cuenta en el sistema. Se genera un token único por préstamo, se le
-- manda por correo un enlace público (sin login) con ese token, y al hacer
-- clic en "Acepto este préstamo" se marca como aceptado.
CREATE TABLE IF NOT EXISTS loan_signatures (
  id SERIAL PRIMARY KEY,
  loan_id INT NOT NULL REFERENCES loans(loan_id) ON DELETE CASCADE,
  signer_email VARCHAR(150) NOT NULL,
  token VARCHAR(64) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

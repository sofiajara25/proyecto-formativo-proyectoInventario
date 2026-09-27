-- database/migrations/079_create_activity_logs_table.sql
--
-- Bitácora general de actividad: registra automáticamente cada vez que
-- alguien crea, actualiza o elimina algo en cualquier módulo (usuarios,
-- materiales, préstamos, marcas, categorías, etc.). Se llena sola desde
-- un middleware genérico en app.js (ver activityLogger.middleware.js),
-- no hay que tocar cada controller para que algo quede registrado acá.
--
-- user_id se deja en NULL si el usuario que hizo la acción se borra
-- después: el registro del log se conserva igual (no tendría sentido
-- perder la bitácora solo porque el usuario ya no existe).
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(100),
  action VARCHAR(20) NOT NULL,
  module VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50),
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_module ON activity_logs (module);

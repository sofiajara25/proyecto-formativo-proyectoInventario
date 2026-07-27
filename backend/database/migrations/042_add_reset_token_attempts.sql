-- Agrega el contador de intentos fallidos al verificar el código
-- de recuperación de contraseña. Sirve para bloquear el código
-- después de varios intentos incorrectos y obligar a pedir uno nuevo.

ALTER TABLE users
ADD COLUMN IF NOT EXISTS reset_token_attempts INT DEFAULT 0;
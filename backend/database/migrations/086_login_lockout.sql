-- Bloqueo de la cuenta tras 3 intentos fallidos de inicio de sesión
-- (RNF11), para evitar que alguien pruebe contraseñas sin límite.
--
-- failed_login_attempts: intentos fallidos seguidos (vuelve a 0 al acertar,
--   al bloquearse o al recuperar la contraseña).
-- locked_until: hasta cuándo está bloqueada la cuenta (NULL = no bloqueada).
--   El bloqueo es temporal: pasado ese momento se puede volver a intentar.
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;

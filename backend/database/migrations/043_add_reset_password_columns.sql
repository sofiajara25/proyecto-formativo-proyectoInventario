-- Agrega las columnas necesarias para el flujo de "recuperar contraseña"
-- reset_token: guarda el hash (sha256) del token enviado por correo, no el token en texto plano
-- reset_token_expires: fecha/hora límite de validez del token (se recomienda 1 hora)


ALTER TABLE users
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;

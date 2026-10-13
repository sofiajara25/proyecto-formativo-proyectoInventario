-- Última "señal de vida" de la sesión activa de cada usuario.
--
-- El frontend consulta /api/auth/session cada pocos segundos mientras la
-- pestaña está abierta; cada consulta actualiza last_seen_at. Si la persona
-- cierra la pestaña o el navegador, apaga el equipo o pierde la conexión,
-- las consultas dejan de llegar. Pasados unos minutos sin señal, el login
-- ya no considera esa sesión como activa (antes quedaba "activa" hasta que
-- el token expiraba, 7 horas después).
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP;

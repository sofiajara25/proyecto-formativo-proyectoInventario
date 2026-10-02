-- Algunos usuarios creados con una versión anterior quedaron con el estado
-- en minúscula ("activo"). El login y el switch de estado esperan
-- exactamente "Activo" / "Inactivo", así que esos usuarios no podían
-- iniciar sesión ("Usuario inactivo") y se veían como inactivos.
UPDATE users SET user_status = 'Activo'   WHERE lower(trim(user_status)) = 'activo'   AND user_status <> 'Activo';
UPDATE users SET user_status = 'Inactivo' WHERE lower(trim(user_status)) = 'inactivo' AND user_status <> 'Inactivo';

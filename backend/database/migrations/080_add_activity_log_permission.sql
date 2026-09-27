-- database/migrations/080_add_activity_log_permission.sql
-- Convierte el acceso a Logs de actividad en un permiso otorgable desde
-- Grupos y Permisos (antes solo lo veía el Super Administrador). El
-- Super Administrador lo sigue viendo siempre porque requirePermission()
-- lo deja pasar de todas formas, pero ahora también se le puede dar
-- explícitamente a un grupo o a un usuario puntual (por ejemplo, un
-- Administrador).

-- 1) Registrar el módulo en content_type.
INSERT INTO content_type (app_label, model, display_name)
VALUES ('activity_logs', 'activity_log', 'Logs de actividad');

-- 2) Crear el permiso. Solo hace falta "listar": no hay crear, modificar
--    ni deshabilitar una entrada de la bitácora.
INSERT INTO permissions (permission_name, permission_codename)
VALUES ('Ver logs de actividad', 'list_activity_log');

-- 3) Enlazar el permiso con su módulo.
UPDATE permissions
SET content_type_id = (SELECT content_type_id FROM content_type WHERE app_label = 'activity_logs')
WHERE permission_codename = 'list_activity_log';

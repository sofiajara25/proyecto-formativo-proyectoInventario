-- database/migrations/088_add_quotation_state_permission.sql
-- Agrega el permiso "Habilitar/Deshabilitar cotizaciones". La migración
-- 077 dejó Cotizaciones con solo 4 acciones, pero el módulo sí tiene
-- estado activo/inactivo: la ruta PATCH /api/quotations/:id/status y el
-- switch del frontend (QuotationStatusSwitch) ya piden "state_quotation".
-- Como el permiso no existía, no aparecía en Grupos y Permisos y solo el
-- Super Administrador podía cambiar el estado.

-- 1) Crear el permiso (si no existe ya).
INSERT INTO permissions (permission_name, permission_codename)
SELECT 'Habilitar/Deshabilitar cotizaciones', 'state_quotation'
WHERE NOT EXISTS (
    SELECT 1 FROM permissions WHERE permission_codename = 'state_quotation'
);

-- 2) Enlazarlo con el módulo de Cotizaciones.
UPDATE permissions
SET content_type_id = (SELECT content_type_id FROM content_type WHERE app_label = 'quotations')
WHERE permission_codename = 'state_quotation';

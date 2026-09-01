-- database/migrations/077_add_missing_module_permissions.sql
-- Agrega los permisos que faltaban para poder restringir por grupo o
-- usuario los módulos de Tareas, Cotizaciones, Categorías y Nombre de
-- inventario (antes no tenían ningún permiso y por eso no aparecían en
-- la pantalla de Permisos).
--
-- Grupos y Permisos/Acceso quedan afuera a propósito: esos dos módulos
-- son exclusivos del Administrador, no se manejan con el sistema de
-- permisos por checkbox.

-- 1) Registrar en content_type los módulos que todavía no tenían fila.
--    "tasks" ya existe desde el seed original (024_seed_content_type.sql),
--    así que no se vuelve a insertar.
INSERT INTO content_type (app_label, model, display_name)
VALUES
    ('quotations', 'quotation', 'Cotizaciones'),
    ('categorys', 'category', 'Categorías'),
    ('inventory_names', 'inventory_name', 'Nombre de inventario');

-- 2) Crear los permisos de cada módulo.
--    Tareas y Cotizaciones: no tienen generación de reportes ni un
--    estado activo/inactivo, así que solo llevan 4 acciones.
INSERT INTO permissions (permission_name, permission_codename)
VALUES
    ('Crear tareas', 'create_task'),
    ('Listar tareas', 'list_task'),
    ('Visualizar tareas', 'view_task'),
    ('Modificar tareas', 'modify_task'),

    ('Crear cotizaciones', 'create_quotation'),
    ('Listar cotizaciones', 'list_quotation'),
    ('Visualizar cotizaciones', 'view_quotation'),
    ('Modificar cotizaciones', 'modify_quotation'),

    -- Categorías y Nombre de inventario sí tienen reportes y estado
    -- (habilitar/deshabilitar), así que llevan las 6 acciones estándar,
    -- igual que Marcas, Préstamos y Materiales.
    ('Crear categorías', 'create_category'),
    ('Listar categorías', 'list_category'),
    ('Reportar categorías', 'report_category'),
    ('Visualizar categorías', 'view_category'),
    ('Modificar categorías', 'modify_category'),
    ('Habilitar/Deshabilitar categorías', 'state_category'),

    ('Crear nombre de inventario', 'create_inventory_name'),
    ('Listar nombre de inventario', 'list_inventory_name'),
    ('Reportar nombre de inventario', 'report_inventory_name'),
    ('Visualizar nombre de inventario', 'view_inventory_name'),
    ('Modificar nombre de inventario', 'modify_inventory_name'),
    ('Habilitar/Deshabilitar nombre de inventario', 'state_inventory_name');

-- 3) Enlazar cada permiso nuevo con su módulo (content_type), igual que
--    se hizo en las migraciones 029 a 033 para los módulos existentes.
UPDATE permissions
SET content_type_id = (SELECT content_type_id FROM content_type WHERE app_label = 'tasks')
WHERE permission_codename IN ('create_task', 'list_task', 'view_task', 'modify_task');

UPDATE permissions
SET content_type_id = (SELECT content_type_id FROM content_type WHERE app_label = 'quotations')
WHERE permission_codename IN ('create_quotation', 'list_quotation', 'view_quotation', 'modify_quotation');

UPDATE permissions
SET content_type_id = (SELECT content_type_id FROM content_type WHERE app_label = 'categorys')
WHERE permission_codename IN (
    'create_category', 'list_category', 'report_category',
    'view_category', 'modify_category', 'state_category'
);

UPDATE permissions
SET content_type_id = (SELECT content_type_id FROM content_type WHERE app_label = 'inventory_names')
WHERE permission_codename IN (
    'create_inventory_name', 'list_inventory_name', 'report_inventory_name',
    'view_inventory_name', 'modify_inventory_name', 'state_inventory_name'
);

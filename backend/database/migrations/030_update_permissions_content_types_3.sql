-- database/migrations/update_permissions_content_type.sql
-- Correcion: asociar permisoso de usuarios a user.user

UPDATE permissions
SET content_type_id = 6
WHERE permission_codename IN (
    'list_consumable_material',
    'create_consumable_material',
    'report_consumable_material',
    'view_consumable_material',
    'modify_consumable_material',
    'state_consumable_material'
)
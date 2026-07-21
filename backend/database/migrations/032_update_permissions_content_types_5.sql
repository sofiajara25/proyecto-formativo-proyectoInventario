-- database/migrations/update_permissions_content_type.sql
-- Correcion: asociar permisoso de usuarios a user.user

UPDATE permissions
SET content_type_id = 8
WHERE permission_codename IN (
    'list_returnable_material',
    'create_returnable_material',
    'report_returnable_material',
    'view_returnable_material',
    'modify_returnable_material',
    'state_returnable_material'
)

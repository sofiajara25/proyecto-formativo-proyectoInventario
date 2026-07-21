-- database/migrations/update_permissions_content_type.sql
-- Correcion: asociar permisoso de usuarios a user.user

UPDATE permissions
SET content_type_id = 9
WHERE permission_codename IN (
    'list_return',
    'create_return',
    'report_return',
    'view_return',
    'modify_return',
    'state_return'
)
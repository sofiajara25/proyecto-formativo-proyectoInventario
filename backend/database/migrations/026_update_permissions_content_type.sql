-- database/migrations/update_permissions_content_type.sql
-- Correcion: asociar permisoso de usuarios a user.user

UPDATE permissions
SET content_type_id = 1
WHERE permission_codename IN (
    'list_user',
    'create_user',
    'report_user',
    'view_user',
    'modify_user',
    'state_user'
)
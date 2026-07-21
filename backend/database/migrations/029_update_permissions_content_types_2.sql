-- database/migrations/update_permissions_content_type.sql
-- Correcion: asociar permisoso de usuarios a user.user

UPDATE permissions
SET content_type_id = 5
WHERE permission_codename IN (
    'list_brand',
    'create_brand',
    'report_brand',
    'view_brand',
    'modify_brand',
    'state_brand'
)
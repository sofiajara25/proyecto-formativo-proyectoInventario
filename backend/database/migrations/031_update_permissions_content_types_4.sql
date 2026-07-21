-- database/migrations/update_permissions_content_type.sql
-- Correcion: asociar permisoso de usuarios a user.user

UPDATE permissions
SET content_type_id = 7
WHERE permission_codename IN (
    'list_loan',
    'create_loan',
    'report_loan',
    'view_loan',
    'modify_loan',
    'state_loan'
)

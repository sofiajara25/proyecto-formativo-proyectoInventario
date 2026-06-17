INSERT INTO group_permissions (
    group_id,
    permission_id
)

SELECT 
    1,
    permission_id
FROM permissions 
WHERE permission_codename IN (
    'list_user',
    'create_user',
    'report_brand',
    'view_returnable_material',
    'mofify_returnable_material',
    'state_brand',
    'list_consumable_material',
    'report_consumable_material',
    'modify_return',
    'view_return'
);
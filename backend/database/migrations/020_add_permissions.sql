INSERT INTO group_permissions (
    group_id,
    permission_id
)
SELECT 
    1,
    permission_id
FROM permissions
WHERE permission_codename IN (
    'create_returnable_material',
    'modify_returnable_material',
    'state_returnable_material',
    'create_consumable_material',
    'view_consumable_material',
    'modify_consumable_material',
    'state_consumable_material',
    'create_loan',
    'list_loan',
    'report_loan',
    'view_loan',
    'modify_loan',
    'state_loan',
    'create_return',
    'list_return',
    'report_return',
    'create_brand',
    'list_brand',
    'view_brand',
    'modify_brand'
);
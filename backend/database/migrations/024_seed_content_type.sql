-- database/migrations/seed_content_type.sql
-- Registros iniciales de contennt_type

INSERT INTO content_type (
    app_label,
    model
)
VALUES
    ('users', 'user'),
    ('groups', 'group'),
    ('tasks', 'task'),
    ('access', 'permission'),
    ('brands', 'brand'),
    ('consumable_materials', 'consumable_material'),
    ('loans', 'loan'),
    ('returnable_materials', 'returnable_material'),
    ('returns', 'return')

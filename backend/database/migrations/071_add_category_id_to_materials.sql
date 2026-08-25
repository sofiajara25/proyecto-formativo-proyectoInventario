-- Devolutivos: tenían un campo "category" de texto libre (el usuario lo
-- escribía a mano). Lo reemplazamos por category_id, que apunta al
-- catálogo real de categorías (tabla categorys).
ALTER TABLE returnable_materials ADD COLUMN IF NOT EXISTS category_id INT REFERENCES categorys(category_id);
ALTER TABLE returnable_materials DROP COLUMN IF EXISTS category;

-- Consumibles: nunca tuvieron un campo de categoría persistente (se agregó
-- y se eliminó como texto libre en migraciones anteriores). Se agrega
-- ahora ya enlazado al catálogo de categorías.
ALTER TABLE consumable_materials ADD COLUMN IF NOT EXISTS category_id INT REFERENCES categorys(category_id);

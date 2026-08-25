-- Los inserts de categorías no envían "status" (lo asigna el sistema, no el
-- formulario), pero la columna quedó como NOT NULL sin un valor por
-- defecto, así que cualquier creación fallaba por violar esa restricción.
-- Le agregamos un DEFAULT 'Activo', igual que en brands/inventory_names.
ALTER TABLE categorys ALTER COLUMN status SET DEFAULT 'Activo';

-- Por si ya existen filas creadas antes de este fix con status vacío/nulo
-- (no debería, pero por seguridad):
UPDATE categorys SET status = 'Activo' WHERE status IS NULL;

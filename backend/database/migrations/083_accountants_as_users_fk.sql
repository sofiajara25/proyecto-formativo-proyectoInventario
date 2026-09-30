-- Cuentadantes / custodios ligados a la tabla users (llave foránea).
-- Antes (migración 074) eran texto libre en un arreglo:
--   consumable_materials.accountants TEXT[]
--   returnable_materials.custodians  TEXT[]
-- Como un material puede tener varios cuentadantes, la relación es
-- muchos-a-muchos y se guarda en una tabla intermedia por tipo de material.

CREATE TABLE IF NOT EXISTS consumable_material_accountants (
  consumable_material_id INT NOT NULL REFERENCES consumable_materials(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id),
  PRIMARY KEY (consumable_material_id, user_id)
);

CREATE TABLE IF NOT EXISTS returnable_material_custodians (
  returnable_material_id INT NOT NULL REFERENCES returnable_materials(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id),
  PRIMARY KEY (returnable_material_id, user_id)
);

-- Datos existentes: solo se asocia un texto cuando coincide exactamente
-- (sin importar mayúsculas ni espacios de más) con el nombre completo
-- "nombre apellido" de UN solo usuario. Los textos ambiguos (ej. "Sofia",
-- que coincide con varios) o que no existen quedan sin cuentadante y se
-- asignan manualmente desde Editar.
WITH user_full_names AS (
  SELECT id, lower(trim(trim(user_name) || ' ' || trim(coalesce(user_lastname, '')))) AS full_name
  FROM users
),
unique_names AS (
  SELECT full_name, min(id) AS user_id
  FROM user_full_names
  GROUP BY full_name
  HAVING count(*) = 1
)
INSERT INTO consumable_material_accountants (consumable_material_id, user_id)
SELECT DISTINCT m.id, u.user_id
FROM consumable_materials m
CROSS JOIN LATERAL unnest(m.accountants) AS a(name)
JOIN unique_names u ON u.full_name = lower(trim(a.name))
ON CONFLICT DO NOTHING;

WITH user_full_names AS (
  SELECT id, lower(trim(trim(user_name) || ' ' || trim(coalesce(user_lastname, '')))) AS full_name
  FROM users
),
unique_names AS (
  SELECT full_name, min(id) AS user_id
  FROM user_full_names
  GROUP BY full_name
  HAVING count(*) = 1
)
INSERT INTO returnable_material_custodians (returnable_material_id, user_id)
SELECT DISTINCT m.id, u.user_id
FROM returnable_materials m
CROSS JOIN LATERAL unnest(m.custodians) AS c(name)
JOIN unique_names u ON u.full_name = lower(trim(c.name))
ON CONFLICT DO NOTHING;

-- Ya no se usan las columnas de texto libre.
ALTER TABLE consumable_materials DROP COLUMN IF EXISTS accountants;
ALTER TABLE returnable_materials DROP COLUMN IF EXISTS custodians;

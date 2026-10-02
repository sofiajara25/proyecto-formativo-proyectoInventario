-- Categorías "así, simplecito": solo nombre y estado, igual que Marcas y
-- Nombres de inventario. Se elimina el "tipo de elemento" (element_type)
-- del que antes dependía cada categoría.
--
-- Hay 3 categorías que deben existir SIEMPRE (por defecto, desde que se
-- instala el sistema): Herramientas, Equipo y Maquinaria, y Muebles y
-- Enseres. Se marcan con is_default y el backend no deja desactivarlas ni
-- renombrarlas. Las demás (ej. "Taladros", "Sillas") siguen funcionando
-- como categorías normales.

-- 1. Quitar el tipo de elemento (y su UNIQUE, que solo permitía una
--    categoría por tipo).
ALTER TABLE categorys DROP CONSTRAINT IF EXISTS categorys_element_type_key;
ALTER TABLE categorys DROP COLUMN IF EXISTS element_type;

-- 2. Marcar cuáles son las categorías por defecto.
ALTER TABLE categorys ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. No permitir dos categorías con el mismo nombre (sin importar
--    mayúsculas ni espacios), igual que se espera de un catálogo.
CREATE UNIQUE INDEX IF NOT EXISTS categorys_name_unique
  ON categorys (lower(trim(category_name)));

-- 4. Las 3 categorías por defecto: si ya existe una con ese nombre se
--    reutiliza; si no, se crea. Quedan activas y marcadas como por defecto.
INSERT INTO categorys (category_name, status, is_default)
VALUES ('Herramientas', 'Activo', TRUE),
       ('Equipo y Maquinaria', 'Activo', TRUE),
       ('Muebles y Enseres', 'Activo', TRUE)
ON CONFLICT ((lower(trim(category_name))))
DO UPDATE SET is_default = TRUE, status = 'Activo';

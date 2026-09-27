-- database/migrations/082_returns_status_three_states.sql
--
-- El módulo de Retornos en realidad debe manejar 3 estados reales:
-- "Disponible", "Mantenimiento" y "Baja" — así lo confirmó el dueño del
-- proyecto. Pero la tabla lo modelaba con TRES columnas booleanas
-- independientes (is_available, is_maintenance, is_low) que podían
-- quedar en combinaciones sin sentido (ej. is_available=true e
-- is_maintenance=true al mismo tiempo), y el switch del frontend solo
-- alternaba entre is_available/is_low: "Mantenimiento" nunca se podía
-- elegir desde ahí una vez creado el retorno.
--
-- Se reemplaza por una sola columna "status" (mismo patrón ya usado en
-- brands/categorys/inventory_names/quotations/tasks), con exactamente
-- uno de los 3 valores posibles.

-- 1) Columna nueva.
ALTER TABLE returns ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'Disponible';

-- 2) Traducir el dato existente: is_low manda (si estaba marcado como
--    "bajo", queda en Baja), si no, is_maintenance manda, si no,
--    is_available decide, y si ninguno estaba marcado, se deja en
--    Disponible por defecto.
UPDATE returns
SET status = CASE
    WHEN is_low = true THEN 'Baja'
    WHEN is_maintenance = true THEN 'Mantenimiento'
    WHEN is_available = true THEN 'Disponible'
    ELSE 'Disponible'
END;

-- 3) Las tres columnas booleanas quedan reemplazadas por "status".
ALTER TABLE returns DROP COLUMN is_available;
ALTER TABLE returns DROP COLUMN is_maintenance;
ALTER TABLE returns DROP COLUMN is_low;

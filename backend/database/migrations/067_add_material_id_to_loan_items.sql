-- Vincula cada material de un préstamo con el registro real del que sale
-- (consumable_materials o returnable_materials, según loans.material_type).
-- No lleva FOREIGN KEY porque puede apuntar a cualquiera de las dos tablas
-- dependiendo del tipo de material del préstamo (relación polimórfica
-- simple). Se usa para descontar/restaurar existencias automáticamente.
ALTER TABLE loan_items ADD COLUMN IF NOT EXISTS material_id INT;

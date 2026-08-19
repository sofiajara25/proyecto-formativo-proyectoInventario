-- Eliminar columna category de materiales de consumo
ALTER TABLE consumable_materials
DROP COLUMN category;

-- Quitar NOT NULL en placa SENA de materiales de consumo
ALTER TABLE consumable_materials
ALTER COLUMN sena_plate DROP NOT NULL;
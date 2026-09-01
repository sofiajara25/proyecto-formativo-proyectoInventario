-- Cuentadantes/custodios múltiples (texto libre, no ligados a la tabla de
-- usuarios) + fecha de compra obligatoria en material de consumo.

-- Material de consumo: "accountant" (un solo texto) -> "accountants" (arreglo
-- de texto). Se migra el valor existente a un arreglo de 1 elemento antes de
-- borrar la columna vieja, para no perder datos ya cargados.
ALTER TABLE consumable_materials ADD COLUMN accountants TEXT[] NOT NULL DEFAULT '{}';
UPDATE consumable_materials
SET accountants = ARRAY[accountant]
WHERE accountant IS NOT NULL AND accountant <> '';
ALTER TABLE consumable_materials DROP COLUMN accountant;

-- Fecha de compra: se agrega como opcional a nivel de base de datos (para no
-- romper los registros que ya existen sin ese dato); la obligatoriedad para
-- registros nuevos se valida en el formulario/backend.
ALTER TABLE consumable_materials ADD COLUMN purchase_date DATE;

-- Material devolutivo: mismo cambio para "custodian" -> "custodians".
ALTER TABLE returnable_materials ADD COLUMN custodians TEXT[] NOT NULL DEFAULT '{}';
UPDATE returnable_materials
SET custodians = ARRAY[custodian]
WHERE custodian IS NOT NULL AND custodian <> '';
ALTER TABLE returnable_materials DROP COLUMN custodian;

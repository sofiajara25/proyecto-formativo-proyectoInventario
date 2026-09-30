-- Material de consumo: se agregan "serial" (Serial Number / SN) y "model"
-- (modelo), que ya existían en material devolutivo. Ambos son opcionales.
-- A diferencia de devolutivo, el serial NO es UNIQUE: un registro de consumo
-- agrupa varias unidades (cantidad) y distintos registros pueden compartirlo.
ALTER TABLE consumable_materials ADD COLUMN IF NOT EXISTS serial VARCHAR(50);
ALTER TABLE consumable_materials ADD COLUMN IF NOT EXISTS model VARCHAR(100);

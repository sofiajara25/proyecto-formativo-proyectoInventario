ALTER TABLE consumable_materials
ADD COLUMN category VARCHAR(100);

ALTER TABLE returnable_materials
ADD COLUMN category VARCHAR(100);

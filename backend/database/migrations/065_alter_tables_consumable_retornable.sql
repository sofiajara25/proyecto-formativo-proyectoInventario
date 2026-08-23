ALTER TABLE returnable_materials ADD COLUMN inventory_name_id INT REFERENCES inventory_names(inventory_name_id);

ALTER TABLE consumable_materials ADD COLUMN inventory_name_id INT REFERENCES inventory_names(inventory_name_id);
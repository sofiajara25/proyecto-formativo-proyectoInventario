ALTER TABLE consumable_materials
ADD COLUMN brand_id INT,
ADD CONSTRAINT fk_consumable_brand
  FOREIGN KEY (brand_id) REFERENCES brands(id);
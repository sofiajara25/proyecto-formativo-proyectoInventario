ALTER TABLE returnable_materials
ADD COLUMN brand_id INT,
ADD CONSTRAINT fk_returnable_brand
  FOREIGN KEY (brand_id) REFERENCES brands(id);
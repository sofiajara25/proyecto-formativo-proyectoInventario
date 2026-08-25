CREATE TABLE IF NOT EXISTS categorys (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  element_type VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL
);
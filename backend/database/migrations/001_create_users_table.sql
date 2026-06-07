CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  document_type VARCHAR(20) NOT NULL,
  document_number VARCHAR(50) UNIQUE NOT NULL,
  user_type VARCHAR(30) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  user_email VARCHAR(150) UNIQUE NOT NULL,
  user_phone VARCHAR(20),
  user_address VARCHAR(150),
  user_status VARCHAR(20) NOT NULL,
  photo_url TEXT,
  password TEXT NOT NULL
);
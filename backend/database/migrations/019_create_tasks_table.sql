CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  task_name VARCHAR(100),
  task_description TEXT,
  delivery_date DATE,
  creation_date DATE,
  userId INT NOT NULL,   -- relación con usuario
  FOREIGN KEY (userId) REFERENCES users(id)
);

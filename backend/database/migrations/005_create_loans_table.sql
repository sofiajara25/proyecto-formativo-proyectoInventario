CREATE TABLE IF NOT EXISTS loans (
  id SERIAL PRIMARY KEY,
  loan_user VARCHAR(100) NOT NULL,     
  category VARCHAR(30) NOT NULL,   
  product_name VARCHAR(100) NOT NULL,
  loan_date DATE NOT NULL,             
  return_date DATE NOT NULL,         
  description VARCHAR(200),        
  photo_url TEXT            
);



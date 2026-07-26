-- Cambiar loan_id a entero
ALTER TABLE returns
ALTER COLUMN loan_id TYPE INT USING loan_id::integer;

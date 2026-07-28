-- Agrega la cantidad solicitada en el préstamo.
-- Sin esta columna era imposible verificar si había stock suficiente,
-- porque nunca se sabía cuántas unidades se estaban pidiendo.
ALTER TABLE loans
  ADD COLUMN IF NOT EXISTS quantity INT NOT NULL DEFAULT 1;
-- Antes una devolución solo apuntaba a "loan_id" (todo el préstamo), así
-- que no había forma de devolver un solo material de un préstamo con
-- varios (ej. "Escritorio" + "Sillas") sin devolver los dos. Con
-- "loan_item_id" cada devolución queda ligada a UN material puntual del
-- préstamo.
ALTER TABLE returns ADD COLUMN IF NOT EXISTS loan_item_id INT;

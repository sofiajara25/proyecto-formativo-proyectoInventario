-- Flujo de confirmación de tareas: quien la tiene asignada sube una foto
-- como evidencia de que ya la hizo, y queda pendiente de que la persona
-- que la creó la apruebe (o la rechace, y vuelva a quedar pendiente).

-- Quién creó/asignó la tarea (antes no se guardaba). Las tareas ya
-- existentes quedan con NULL: simplemente no aparecerán en el "por
-- confirmar" de nadie, ya que no se sabe quién las asignó.
ALTER TABLE tasks ADD COLUMN created_by INT REFERENCES users(id);

-- 'Pendiente' (aún no se ha hecho o fue rechazada), 'En revisión' (se
-- subió evidencia y se espera confirmación), 'Completada' (aprobada).
ALTER TABLE tasks ADD COLUMN status VARCHAR(30) NOT NULL DEFAULT 'Pendiente';

-- Ruta de la foto de evidencia subida al marcar la tarea como hecha.
ALTER TABLE tasks ADD COLUMN evidence_photo TEXT;

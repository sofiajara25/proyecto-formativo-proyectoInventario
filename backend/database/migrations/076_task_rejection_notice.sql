-- Guarda cuándo fue la última vez que rechazaron una tarea, para poder
-- avisarle a quien la tiene asignada (en la campana de notificaciones) que
-- se la rechazaron y tiene que volver a hacerla. Se limpia (vuelve a NULL)
-- cuando la persona sube una nueva evidencia o cuando se aprueba.
ALTER TABLE tasks ADD COLUMN rejected_at TIMESTAMP;

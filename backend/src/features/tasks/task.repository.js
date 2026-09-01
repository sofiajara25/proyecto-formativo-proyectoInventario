import { pool } from "../../config/db.js";

// Columnas comunes que devolvemos en cualquier consulta de tareas, para no
// repetirlas en cada método.
const TASK_COLUMNS = `
    t.id,
    t.userid AS "userId",
    t.task_name AS name,
    t.task_description AS description,
    t.delivery_date AS "dueDate",
    t.creation_date AS "createdAt",
    t.status,
    t.evidence_photo AS "evidencePhoto",
    t.created_by AS "createdBy",
    t.rejected_at AS "rejectedAt"
`;

export const taskRepository = {
    async create(taskData) {
        const {
            taskName,
            taskDescription,
            taskDeliveryDate,
            taskCreationDate,
            userId,
            createdBy,
        } = taskData;

        const query = `
            INSERT INTO tasks (
                task_name,
                task_description,
                delivery_date,
                creation_date,
                userId,
                created_by
            )
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING id;
        `;

        const values = [
            taskName,
            taskDescription,
            taskDeliveryDate,
            taskCreationDate,
            userId,
            createdBy ?? null,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async findByUserName(userName) {
        const query = `
            SELECT ${TASK_COLUMNS},
                u.user_name AS "userName",
                u.user_lastname AS "userLastname"
            FROM tasks t
            JOIN users u ON t.userid = u.id
            WHERE u.user_name ILIKE '%' || $1 || '%';
        `;
        const result = await pool.query(query, [userName]);
        return result.rows;
    },

    async findByUserId(userId) {
        const query = `
            SELECT ${TASK_COLUMNS},
                creator.user_name AS "creatorName",
                creator.user_lastname AS "creatorLastname"
            FROM tasks t
            LEFT JOIN users creator ON creator.id = t.created_by
            WHERE t.userid = $1
            ORDER BY t.id DESC;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    async findAll() {
        const query = `
            SELECT ${TASK_COLUMNS},
                u.user_name AS "userName",
                u.user_lastname AS "userLastname"
            FROM tasks t
            JOIN users u ON t.userid = u.id;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    async update(id, taskData) {
        const {
            taskName,
            taskDescription,
            taskDeliveryDate,
            taskCreationDate,
            editedBy,
        } = taskData;

        const query = `
            UPDATE tasks t
            SET task_name = $1,
                task_description = $2,
                delivery_date = $3,
                creation_date = COALESCE($4, creation_date),
                -- Si la tarea ya tenía dueño, se respeta; si no (tareas
                -- viejas, de antes de "created_by"), queda a nombre de
                -- quien la esté editando ahora.
                created_by = COALESCE(created_by, $5)
            WHERE id = $6
            RETURNING ${TASK_COLUMNS};
        `;
        const values = [
            taskName,
            taskDescription,
            taskDeliveryDate,
            taskCreationDate ?? null,
            editedBy ?? null,
            id,
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // La persona a la que se le asignó la tarea sube una foto como
    // evidencia de que ya la hizo. Solo se permite si estaba "Pendiente"
    // (si ya está "En revisión" o "Completada", no hace nada y devuelve
    // undefined, para que el service pueda avisar el error correcto).
    async submitEvidence(id, evidencePhoto) {
        const query = `
            UPDATE tasks t
            SET status = 'En revisión',
                evidence_photo = $1,
                -- Si estaba rechazada y vuelve a subir evidencia, se limpia
                -- el aviso de rechazo (ya está atendiendo el problema).
                rejected_at = NULL
            WHERE id = $2 AND status = 'Pendiente'
            RETURNING ${TASK_COLUMNS};
        `;
        const result = await pool.query(query, [evidencePhoto, id]);
        return result.rows[0];
    },

    // Quien creó la tarea la aprueba o la rechaza. Si la rechaza, vuelve a
    // quedar "Pendiente" (se borra la evidencia) para que la persona la
    // vuelva a hacer y suba una nueva foto, y se guarda "rejected_at" para
    // poder avisarle en su campana de notificaciones que se la rechazaron.
    async confirm(id, approve) {
        const query = approve
            ? `UPDATE tasks t SET status = 'Completada', rejected_at = NULL WHERE id = $1 RETURNING ${TASK_COLUMNS};`
            : `UPDATE tasks t SET status = 'Pendiente', evidence_photo = NULL, rejected_at = NOW() WHERE id = $1 RETURNING ${TASK_COLUMNS};`;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Tareas que alguien creó/asignó y que están esperando su confirmación
    // (ya se subió evidencia). Se usa para la campana de notificaciones.
    async findPendingConfirmationByCreator(creatorId) {
        const query = `
            SELECT ${TASK_COLUMNS},
                u.user_name AS "userName",
                u.user_lastname AS "userLastname"
            FROM tasks t
            JOIN users u ON t.userid = u.id
            WHERE t.created_by = $1 AND t.status = 'En revisión'
            ORDER BY t.id DESC;
        `;
        const result = await pool.query(query, [creatorId]);
        return result.rows;
    },
};

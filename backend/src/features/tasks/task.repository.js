import { pool } from "../../config/db.js";

export const taskRepository = {
    async create(taskData) {
        const {
            taskName,
            taskDescription,
            taskDeliveryDate,
            taskCreationDate,
            userId,
        } = taskData;

        const query = `
            INSERT INTO tasks (
                task_name,
                task_description,
                delivery_date,
                creation_date,
                userId
            )
            VALUES ($1,$2,$3,$4,$5)
            RETURNING id;
        `;

        const values = [
            taskName,
            taskDescription,
            taskDeliveryDate,
            taskCreationDate,
            userId,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async findByUserName(userName) {
        const query = `
            SELECT t.id,
                t.userid AS "userId",
                t.task_name AS name,
                t.task_description AS description,
                t.delivery_date AS "dueDate",
                t.creation_date AS "createdAt",
                u.user_name AS "userName"
            FROM tasks t
            JOIN users u ON t.userid = u.id
            WHERE u.user_name ILIKE '%' || $1 || '%';
        `;
        const result = await pool.query(query, [userName]);
        return result.rows;
    },

    async findByUserId(userId) {
        const query = `
            SELECT t.id,
                t.userid AS "userId",
                t.task_name AS name,
                t.task_description AS description,
                t.delivery_date AS "dueDate",
                t.creation_date AS "createdAt"
            FROM tasks t
            WHERE t.userid = $1
            ORDER BY t.id DESC;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    },

    async findAll() {
        const query = `
            SELECT t.id,
                t.userid AS "userId",
                t.task_name AS name,
                t.task_description AS description,
                t.delivery_date AS "dueDate",
                t.creation_date AS "createdAt",
                u.user_name AS "userName"
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
        } = taskData;

        const query = `
            UPDATE tasks
            SET task_name = $1,
                task_description = $2,
                delivery_date = $3,
                creation_date = COALESCE($4, creation_date)
            WHERE id = $5
            RETURNING id,
                userid AS "userId",
                task_name AS name,
                task_description AS description,
                delivery_date AS "dueDate",
                creation_date AS "createdAt";
        `;
        const values = [
            taskName,
            taskDescription,
            taskDeliveryDate,
            taskCreationDate ?? null,
            id,
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
};

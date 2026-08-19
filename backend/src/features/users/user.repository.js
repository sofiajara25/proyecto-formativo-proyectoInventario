// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";


// Exportamos el repositorio de usuarios.
// El repository encapsula todas las consultas SQL relacionadas con users.
export const userRepository = {


  // Método encargado de crear un usuario en la base de datos
  // Recibe un objeto con los datos ya validados y procesados por el service
  async create(userData) {


    // Desestructuramos explícitamente las propiedades esperadas
    // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
    const {
      userName,
      userLastname,
      userDocumentType,
      userDocumentNumber,
      groupId,
      userStartDate,
      userEndDate,
      userEmail,
      userPhone,
      userAddress,
      userStatus,
      userPassword,
      userPhoto,
    } = userData;

    // Definimos la consulta SQL parametrizada
    // Usar placeholders ($1, $2, ...) previene inyecciones SQL
    // RETURNING permite obtener datos generados por la base de datos (id)
    const query = `
      INSERT INTO users (
        user_name,
        user_lastname,
        document_type,
        document_number,
        group_id, 
        start_date,
        end_date,
        user_email,
        user_phone,
        user_address,
        user_status,
        password,
        photo_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id;
    `;


    // Array de valores que se pasan al query
    // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
    const values = [
      userName,
      userLastname,
      userDocumentType,
      userDocumentNumber,
      groupId,
      userStartDate,
      userEndDate,
      userEmail,
      userPhone,
      userAddress,
      userStatus,
      userPassword,
      userPhoto,
    ];


    // Ejecutamos la consulta usando el pool
    // pool.query retorna un objeto con metadata y filas resultantes
    const result = await pool.query(query, values);


    // Devolvemos únicamente el primer registro retornado
    // En este caso contiene el id del usuario recién creado
    return result.rows[0];
  },

  async findAll() {
    const query = `
      SELECT 
        u.id,
        u.user_name,
        u.user_lastname,
        u.document_type,
        u.document_number,
        u.start_date,
        u.end_date,
        u.user_email,
        u.user_phone,
        u.user_address,
        u.user_status,
        u.photo_url,
        g.group_name AS group_name
      FROM users u
      LEFT JOIN groups g ON u.group_id = g.group_id
      ORDER BY u.id;
    `;
    const result = await pool.query(query);
    return result.rows;
  },
  async findById(id) {
    const query = `
      SELECT 
        u.id, 
        u.user_name, 
        u.user_lastname,
        u.document_type, 
        u.document_number,
        u.start_date, 
        u.end_date,
        u.user_email,
        u.user_phone,
        u.user_address,
        u.user_status,
        u.photo_url,
        g.group_name AS group_name
      FROM users u
      LEFT JOIN groups g ON u.group_id = g.group_id
      WHERE u.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async update(id, userData) {
    const {
      userName,
      userLastname,
      userDocumentType,
      userDocumentNumber,
      groupId,
      userStartDate,
      userEndDate,
      userEmail,
      userPhone,
      userAddress,
      userStatus,
      userPassword,
      userPhoto,
    } = userData;

    const query = `
    UPDATE users
    SET user_name = $1,
        user_lastname = $2,
        document_type = $3,
        document_number = $4,
        group_id = $5,
        start_date = COALESCE($6, start_date),
        end_date = COALESCE($7, end_date),
        user_email = $8,
        user_phone = $9,
        user_address = $10,
        user_status = $11,
        password = COALESCE($12, password),
        photo_url = COALESCE($13, photo_url)
    WHERE id = $14
    RETURNING *;
  `;

    const values = [
      userName,
      userLastname,
      userDocumentType,
      userDocumentNumber,
      groupId,
      userStartDate,
      userEndDate,
      userEmail,
      userPhone,
      userAddress,
      userStatus,
      userPassword ?? null,
      userPhoto ?? null,
      id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // users.repository.js
  async getPermissionsByUserId(userId) {
    const query = `
      SELECT 
        p.permission_id, 
        p.permission_name, 
        p.permission_codename
      FROM user_permissions up
      INNER JOIN permissions p 
        ON p.permission_id = up.permission_id
      WHERE up.user_id = $1
      ORDER BY p.permission_name;
  `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async updatePermissions(userId, permissionIds) {

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `
        DELETE FROM user_permissions
        WHERE user_id = $1
      `,
        [userId],
      );
      for (const permissionId of permissionIds) {

        await client.query(
          `INSERT INTO user_permissions (
            user_id, 
            permission_id
          )
         VALUES ($1, $2)
         ON CONFLICT (user_id, permission_id) DO NOTHING
         `,
          [userId, permissionId]
        );
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async updateStatus(id, status) {
    const query = `
        UPDATE users
        SET user_status = $1
        WHERE id = $2
        RETURNING *;
    `;
    const values = [status, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }



};

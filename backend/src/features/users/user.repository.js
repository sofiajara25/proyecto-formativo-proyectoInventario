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
      userDocumentType,
      userDocumentNumber,
      userType,
      userStartDate,
      userEndDate,
      userEmail,
      userAddress,
      userPhone,
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
        document_type,
        document_number,
        user_type,
        start_date,
        end_date,
        user_email,
        user_phone,
        user_address,
        user_status,
        password,
        photo_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING id;
    `;


    // Array de valores que se pasan al query
    // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
    const values = [
      userName,
      userDocumentType,
      userDocumentNumber,
      userType,
      userStartDate,
      userEndDate,
      userEmail,
      userAddress,
      userPhone,
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
};

// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";

// Repositorio de nombres de inventario. Encapsula todas las consultas SQL
// relacionadas con la tabla inventory_names.
//
// Nota: además de "inventory_name_id" (nombre real de la columna PK)
// devolvemos un alias "id", porque algunas partes del frontend ya
// consumen ese campo como ".id". Así evitamos tener que tocar cada
// componente que lo usa.
export const inventoryNameRepository = {

  async create(data) {
    const { inventory_name } = data;

    const query = `
      INSERT INTO inventory_names (inventory_name)
      VALUES ($1)
      RETURNING *, inventory_name_id AS id;
    `;
    const result = await pool.query(query, [inventory_name]);
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(
      "SELECT *, inventory_name_id AS id FROM inventory_names ORDER BY inventory_name_id DESC"
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      "SELECT *, inventory_name_id AS id FROM inventory_names WHERE inventory_name_id = $1",
      [id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { inventory_name } = data;

    const query = `
      UPDATE inventory_names
      SET inventory_name = $1
      WHERE inventory_name_id = $2
      RETURNING *, inventory_name_id AS id;
    `;
    const result = await pool.query(query, [inventory_name, id]);
    return result.rows[0];
  },

  async updateStatus(id, status) {
    const query = `
      UPDATE inventory_names
      SET status = $1
      WHERE inventory_name_id = $2
      RETURNING *, inventory_name_id AS id;
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  },

};

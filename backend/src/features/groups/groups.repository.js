import { pool } from "../../config/db.js";


export const groupsRepository = {
  async create(groupData) {
    const { groupName } = groupData;

    const query = `
      INSERT INTO groups (
        group_name
      )
      VALUES ($1)
      RETURNING group_id, group_name, created_at, updated_at;
    `;

    const result = await pool.query(query, [groupName]);

    return result.rows[0];
  },

  async getAll() {
    const query = `
      SELECT
        group_id,
        group_name
      FROM groups
      ORDER BY group_name;
    `;


    const result = await pool.query(query);


    return result.rows;
  },


  // Obtener permisos de grupo por ID
  async getPermissionsByGroupId(groupId) {
    const query = `
      SELECT
        p.permission_id,
        p.permission_name,
        p.permission_codename
      FROM group_permissions gp
      INNER JOIN permissions p
        ON p.permission_id = gp.permission_id
      WHERE gp.group_id = $1
      ORDER BY p.permission_name;
    `;


    const result = await pool.query(query, [groupId]);


    return result.rows;
  },
};

import { pool } from "../../config/db.js";


export const groupsRepository = {
  async getAll() {
    const query = `
      SELECT
        group_id,
        group_name,
        is_active
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

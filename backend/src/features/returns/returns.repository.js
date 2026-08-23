// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";

// A qué tabla de materiales pertenece el préstamo que se está devolviendo.
// Misma idea que en loan.repository.js: no es un FK real, "material_type"
// del préstamo dice a cuál de las dos tablas hay que devolver el stock.
function tableForMaterialType(materialType) {
    if (materialType === "Devolutivo") return "returnable_materials";
    if (materialType === "Consumo") return "consumable_materials";
    return null;
}

// Exportamos el repositorio de usuarios.
// El repository encapsula todas las consultas SQL relacionadas con users.
export const returnRepository = {


    // Método encargado de crear una devolución.
    // Antes esto solo insertaba la fila en "returns" y no hacía nada más:
    // ni devolvía el stock al material, ni cerraba el préstamo, y además
    // trataba el préstamo completo como una sola unidad — así que si un
    // préstamo tenía dos materiales (ej. "Escritorio" + "Sillas"), no había
    // forma de devolver solo uno de los dos.
    //
    // Ahora la devolución se liga a UN material puntual del préstamo
    // (loan_item_id) y, en una sola transacción:
    //   1. Se inserta el registro de la devolución.
    //   2. Se suma la cantidad de ESE material al inventario real
    //      (returnable_materials o consumable_materials).
    //   3. El préstamo solo se marca como inactivo (devuelto por completo)
    //      cuando YA NO queda ningún material suyo pendiente de devolver.
    async create(returnData) {


        // Desestructuramos explícitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        const {
            materialType,
            loanId,
            loanItemId,
            returnDate,
            returnDescription,
            returnQuantity,
            isAvailable,
            isMaintenance,
            isLow
        } = returnData;

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // El material puntual que se está devolviendo, bloqueado para
            // evitar que dos devoluciones concurrentes lo procesen a la vez.
            const itemResult = await client.query(
                "SELECT id, loan_id, material_id, quantity FROM loan_items WHERE id = $1 AND loan_id = $2 FOR UPDATE",
                [loanItemId, loanId]
            );
            const loanItem = itemResult.rows[0];
            if (!loanItem) {
                throw new Error("El material seleccionado no pertenece a ese préstamo.");
            }

            // Evita devolver el mismo material dos veces.
            const alreadyReturned = await client.query(
                "SELECT 1 FROM returns WHERE loan_item_id = $1",
                [loanItemId]
            );
            if (alreadyReturned.rowCount > 0) {
                throw new Error("Este material ya fue devuelto anteriormente.");
            }

            // Definimos la consulta SQL parametrizada
            // Usar placeholders ($1, $2, ...) previene inyecciones SQL
            // RETURNING permite obtener datos generados por la base de datos (id)
            const query = `
          INSERT INTO returns (
            material_type,
            loan_id,
            loan_item_id,
            return_date,
            description,
            quantity,
            is_available,
            is_maintenance,
            is_low
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
          RETURNING *;
        `;

            const values = [
                materialType,
                loanId,
                loanItemId,
                returnDate,
                returnDescription,
                returnQuantity,
                isAvailable,
                isMaintenance,
                isLow
            ];

            const result = await client.query(query, values);
            const created = result.rows[0];

            // Buscamos el préstamo para saber a qué tabla de materiales
            // devolver el stock.
            const loanResult = await client.query(
                "SELECT material_type FROM loans WHERE loan_id = $1",
                [loanId]
            );
            const loan = loanResult.rows[0];

            if (loan) {
                const table = tableForMaterialType(loan.material_type);
                if (table && loanItem.material_id) {
                    await client.query(
                        `UPDATE ${table} SET quantity = quantity + $1 WHERE id = $2`,
                        [loanItem.quantity, loanItem.material_id]
                    );
                }

                // Solo cerramos el préstamo cuando TODOS sus materiales ya
                // tienen una devolución registrada (incluyendo la que
                // acabamos de insertar). Si todavía queda alguno pendiente
                // (ej. las sillas), el préstamo sigue activo.
                const pendingResult = await client.query(
                    `SELECT COUNT(*)::int AS pending
                     FROM loan_items li
                     WHERE li.loan_id = $1
                       AND NOT EXISTS (SELECT 1 FROM returns r WHERE r.loan_item_id = li.id)`,
                    [loanId]
                );
                if (pendingResult.rows[0].pending === 0) {
                    await client.query(
                        "UPDATE loans SET is_active = false WHERE loan_id = $1",
                        [loanId]
                    );
                }
            }

            await client.query("COMMIT");
            return created;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },

    async findAll() {
        const result = await pool.query("SELECT * FROM returns");
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query("SELECT * FROM returns WHERE id = $1", [id]);
        return result.rows[0]; // debe incluir user_photo
    },

    async update(id, returnData) {

        const {
            materialType,
            loanId,
            returnDate,
            returnDescription,
            returnQuantity,
            isAvailable,
            isMaintenance,
            isLow
        } = returnData;

        const query = `
            UPDATE returns
            SET material_type = $1,
                loan_id = $2,
                return_date = $3,
                description = $4,
                quantity = $5,
                is_available = $6,
                is_maintenance = $7,
                is_low = $8   
            WHERE id = $9
            RETURNING *;
        `;
        const values = [
            materialType,
            loanId,
            returnDate,
            returnDescription,
            returnQuantity,
            isAvailable,
            isMaintenance,
            isLow,
            id
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async updateStatus(id, isAvailable) {
        const query = `
            UPDATE returns
            SET is_available = $1,
                is_low = $2
            WHERE id = $3
            RETURNING *;
        `;
        const values = [isAvailable, !isAvailable, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

};

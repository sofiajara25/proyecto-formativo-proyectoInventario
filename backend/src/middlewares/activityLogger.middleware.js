// Bitácora automática de actividad.
//
// Por qué esto es un middleware genérico y no una llamada manual en cada
// controller: el proyecto tiene 14 módulos distintos (usuarios, marcas,
// préstamos, materiales, etc.), cada uno con create/update/status en su
// propio controller. Tocar los ~35 métodos uno por uno sería frágil (fácil
// olvidar alguno nuevo a futuro) y repetitivo. En vez de eso, este
// middleware se monta UNA sola vez en app.js, envuelve res.json de cada
// petición, y cuando detecta que fue una mutación (POST/PUT/PATCH) que
// terminó bien (status 2xx), guarda una fila en activity_logs sin que el
// controller tenga que saber que esto existe.
//
// No es perfecto: el texto de la descripción es genérico (no dice "la
// marca HP" sino "un registro en Marcas"), porque cada módulo devuelve
// formas de respuesta distintas y tratar de adivinar el nombre de cada
// una sería mucho más frágil que esto. Si más adelante se quiere algo más
// detallado, ahí sí conviene pasar a llamadas explícitas por módulo.
import { pool } from "../config/db.js";

// Prefijo de URL (segundo segmento de /api/<esto>/...) -> nombre bonito
// en español para la descripción del log.
const MODULE_LABELS = {
    users: "Usuarios",
    consumableMaterial: "Materiales de consumo",
    returnableMaterial: "Materiales devolutivos",
    brands: "Marcas",
    loan: "Préstamos",
    returns: "Devoluciones",
    groups: "Grupos",
    tasks: "Tareas",
    "inventory-names": "Nombres de inventario",
    categorys: "Categorías",
    quotations: "Cotizaciones",
    "loan-signatures": "Firmas de préstamo",
    permissions: "Permisos",
};

// Módulos que NO se registran: auth (login/logout/recuperar contraseña no
// son "CRUD de un módulo"), access (son solo lecturas), y activity-logs
// (para no registrar "alguien vio el log de actividad" como si fuera una
// mutación).
const EXCLUDED_MODULES = new Set(["auth", "access", "activity-logs"]);

function getModuleFromUrl(originalUrl) {
    const segments = originalUrl.split("?")[0].split("/").filter(Boolean);
    // originalUrl siempre empieza con "api", ej: /api/brands/12/status
    return segments[1] ?? null;
}

function getActionFromRequest(method, originalUrl) {
    if (method === "POST") return "create";
    if (originalUrl.split("?")[0].endsWith("/status")) return "status";
    if (method === "PUT" || method === "PATCH") return "update";
    return null;
}

const ACTION_VERBS = {
    create: "Creó",
    update: "Actualizó",
    status: "Cambió el estado de",
};

// Intenta encontrar un id de la entidad afectada: primero en los params
// de la ruta (cubre update/status, que siempre traen :id), y si no, busca
// en el cuerpo de la respuesta alguna clave que termine en "Id" o sea
// literalmente "id" (cubre create, donde cada módulo devuelve algo como
// { brandId: 12 } o { id: 12 }).
function guessEntityId(req, responseBody) {
    if (req.params?.id) return String(req.params.id);

    if (responseBody && typeof responseBody === "object") {
        for (const [key, value] of Object.entries(responseBody)) {
            if (/^id$|Id$/.test(key) && (typeof value === "number" || typeof value === "string")) {
                return String(value);
            }
        }
    }

    return null;
}

async function insertLog({ userId, action, module, entityId, description }) {
    try {
        let userName = null;

        if (userId) {
            const result = await pool.query(
                "SELECT user_name FROM users WHERE id = $1 LIMIT 1;",
                [userId]
            );
            userName = result.rows[0]?.user_name ?? null;
        }

        await pool.query(
            `INSERT INTO activity_logs (user_id, user_name, action, module, entity_id, description)
             VALUES ($1, $2, $3, $4, $5, $6);`,
            [userId ?? null, userName, action, module, entityId, description]
        );
    } catch (err) {
        // Un fallo al escribir el log NUNCA debe tumbar la petición real
        // del usuario: solo se deja constancia en la consola del servidor.
        console.error("No se pudo registrar la actividad en el log:", err.message);
    }
}

export function activityLogger(req, res, next) {
    const originalJson = res.json.bind(res);

    res.json = (body) => {
        const shouldLog =
            res.statusCode >= 200 &&
            res.statusCode < 300 &&
            ["POST", "PUT", "PATCH"].includes(req.method);

        if (shouldLog) {
            const module = getModuleFromUrl(req.originalUrl);
            const action = getActionFromRequest(req.method, req.originalUrl);

            if (module && action && !EXCLUDED_MODULES.has(module)) {
                const moduleLabel = MODULE_LABELS[module] ?? module;
                const entityId = guessEntityId(req, body);
                const idSuffix = entityId ? ` (ID ${entityId})` : "";
                const description = `${ACTION_VERBS[action]} un registro en ${moduleLabel}${idSuffix}`;

                // No se espera (await) esto a propósito: escribir el log no
                // debe demorar la respuesta que ya se le está mandando al
                // usuario.
                insertLog({
                    userId: req.user?.id ?? null,
                    action,
                    module,
                    entityId,
                    description,
                });
            }
        }

        return originalJson(body);
    };

    next();
}

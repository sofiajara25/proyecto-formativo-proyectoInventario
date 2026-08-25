// IMPORTANTE: debe ser el PRIMER import del archivo. Carga las variables de
// entorno (.env) antes de que se evalúe cualquier otro módulo. Antes,
// "dotenv.config()" se llamaba aquí abajo, después de "import app from
// './app.js'" — pero en ES modules todos los imports de un archivo se
// evalúan antes que el resto de su código, sin importar el orden en que
// estén escritos, así que "app.js" (y con él, mailer.js) ya se habían
// evaluado con GMAIL_USER/GMAIL_APP_PASSWORD todavía undefined. Ver
// env.js para el detalle.
import "./env.js";

// Importamos la instancia de la aplicación Express ya configurada.
// app.js debe encargarse de middlewares, rutas y configuración general.
import app from "./app.js"


// Definimos el puerto del servidor
// Se prioriza el valor definido en el entorno (producción)
// y se usa 4000 como valor por defecto en desarrollo
const PORT = process.env.PORT || 5000;


// Iniciamos el servidor HTTP usando la app de Express
// listen levanta el servidor y queda a la espera de peticiones
app.listen(PORT, () => {
    // Log informativo indicando que el servidor está corriendo
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
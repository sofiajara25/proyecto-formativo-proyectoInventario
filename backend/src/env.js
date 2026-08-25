// Este archivo existe SOLO para que "dotenv.config()" corra antes de que se
// importe cualquier otra cosa. En server.js, "import app from './app.js'"
// arrastra (transitivamente) mailer.js, que lee process.env.GMAIL_USER /
// process.env.GMAIL_APP_PASSWORD al crear el transporter — pero en un
// módulo ES, TODOS los imports de un archivo se evalúan antes que
// cualquier código normal de ese archivo, sin importar en qué orden estén
// escritos. Eso significa que aunque en server.js se escribiera
// "dotenv.config()" antes del "import app from './app.js'", igual se
// ejecutaría después de que app.js (y mailer.js) ya se hubieran evaluado,
// dejando GMAIL_USER/GMAIL_APP_PASSWORD como undefined y el envío de
// correos (recuperación de contraseña, firma de préstamos) fallando en
// silencio.
//
// Al importar este archivo PRIMERO (import "./env.js" antes de
// "import app from './app.js'"), su dotenv.config() sí termina de
// ejecutarse antes de que Node empiece a evaluar app.js.
import dotenv from "dotenv";
dotenv.config();

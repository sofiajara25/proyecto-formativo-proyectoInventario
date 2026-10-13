// Política de complejidad de contraseñas (RNF10): al menos 10 caracteres,
// una mayúscula, una minúscula, un número y un símbolo. Debe coincidir con
// las reglas que muestra el frontend en "Recuperar contraseña"
// (frontend/src/features/auth/schemas/passwordRules.js).
export const PASSWORD_RULES = [
    { test: (p) => p.length >= 10, message: "al menos 10 caracteres" },
    { test: (p) => /[A-ZÁÉÍÓÚÑ]/.test(p), message: "una letra mayúscula" },
    { test: (p) => /[a-záéíóúñ]/.test(p), message: "una letra minúscula" },
    { test: (p) => /\d/.test(p), message: "un número" },
    { test: (p) => /[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]/.test(p), message: "un símbolo (por ejemplo ! @ # _)" },
];

// Devuelve la lista de reglas que la contraseña NO cumple (vacía = válida).
export function missingPasswordRules(password = "") {
    return PASSWORD_RULES.filter((rule) => !rule.test(password)).map((rule) => rule.message);
}

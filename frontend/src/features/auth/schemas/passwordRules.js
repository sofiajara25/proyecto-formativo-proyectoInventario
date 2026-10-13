// Política de complejidad de contraseñas (RNF10). Se muestran como una
// lista en "Recuperar contraseña" que se va marcando a medida que se
// escribe. Deben coincidir con backend/src/features/auth/passwordPolicy.js,
// que vuelve a revisarlas para que no se puedan saltar.
export const PASSWORD_RULES = [
    { label: "Al menos 10 caracteres", test: (p) => p.length >= 10 },
    { label: "Una letra mayúscula", test: (p) => /[A-ZÁÉÍÓÚÑ]/.test(p) },
    { label: "Una letra minúscula", test: (p) => /[a-záéíóúñ]/.test(p) },
    { label: "Un número", test: (p) => /\d/.test(p) },
    { label: "Un símbolo (por ejemplo ! @ # _)", test: (p) => /[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]/.test(p) },
];

export function passwordMeetsRules(password = "") {
    return PASSWORD_RULES.every((rule) => rule.test(password));
}

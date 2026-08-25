// Function utilitaria  para construir el dataset de un reporte (tabla)
// Patrón: transformacion de datos (input => output listo para exportar)

export function buildReportDataset({
    categorys,          // Array de usuarios origen
    selectedFields, // Campos seleccionados para el reporte [{key,label}]
    scope,          // Alcance del reporte: "all" | "document"
    category_name  // Numero de documentos para filtrar (si aplica)
}) {

    // Copia inmutable del array original (evita mutaciones)
    let filteredCategorys = [...categorys];

    // Filtro por alcance: si es documento, se aplica filtro especifico
    if (scope === "category_name" && category_name) {
        filteredCategorys = filteredCategorys.filter(
            (category) => category.category_name === category_name  // Fix: typo "docuement_number" -> "document"
        );
    }

    // Construccion de encabezados del reporte
    // Se toma el label de cada uno de los campos seleccionados
    const headers = selectedFields.map((field) => field.label);

    // Construccion de filas del reporte
    // Cada usuario se transforma en un arreglo de valores segun los campos seleccionados
    const rows = filteredCategorys.map((category) =>
        selectedFields.map((field) => {
            const value = category[field.key]; // Acceso dinamico a la propiedad

            // Normalizacion: evita undefined o null en el reporte
            return value ?? "";
        })
    );

    // Estructura final desacoplada de la UI
    // Lista para exportar a Excel, PDF o renderizar una tabla
    return {
        headers,
        rows
    };
}
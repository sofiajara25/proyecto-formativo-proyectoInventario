// Libreria para generacion de PDFs en el cliente
import jsPDF from "jspdf";

// Plugin para creacion de tablas dentro del PDF
import autoTable from "jspdf-autotable";

// Funcion utilitaria para generar reporte en un PDF
// Patron: exportacion de datos (dataset -> documento estructurado)
export function generatePdfReport({
    headers,                            // Encabezadps de la tabla (columnas)
    rows,                              // Datos (array de filas)
    fileName = "user-report.pdf",      // Nombre del archivo del salida
})  {
    
    // Inicializa el documento PDF
    const doc = new jsPDF();

    // Configuracion del titulo
    doc.setFontSize(16);
    doc.text("Reporte de usuarios", 14, 20) // Posicion (x, y)

    // Generacion de tabla automatica
    autoTable(doc, {
        startY: 30, // Posicion inicial debajo del titulo

        head:[headers], // Encabezados (debe ser array de arrays)
        body: rows,     // Filas del reporte

        theme: "grid",  // Estilo visual de la tabla

        // Estilos del encabezado
        headStyles: {
            fillColor: [33, 150, 243], // Color de fondo (RGB)
            textColor: 255, // Color del texto
            fontSize: 11,
        },
        

        // Estilos globales de las celdas
        styles: {
            fontSize: 10,
        },

        // Margenes del documento
        margin: {
            left: 14,
            right: 14,
        },
    })

    // Genera y descarga el archivo PDF
    doc.save(fileName)
}
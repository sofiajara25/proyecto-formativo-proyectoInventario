// libreria para generacion de PDFs en el cliente
import jsPDF from "jspdf";

// plugin para creacion de tablas dentro del PDF
import autoTable from "jspdf-autotable";

// funcion utilitaria para generar reporte en PDF
// patron: exportacion de datos (dataset -> documento estructurado)

export function generatePdfReport({
    headers,                            // encabezados de la tabla (columnas)
    rows,                               // datos (array de filas)
    fileName = "loan-report.pdf",       // nombre del archivo de salida
}) {

    // inicializa el documento PDF
    const doc = new jsPDF();

    // titulo del reporte
    doc.setFontSize(16);
    doc.text("Reporte de Prestamos", 14, 20); // posicion (x, y)

    // generacion de tabla automatica
    autoTable(doc, {
        startY: 30,         // posicion inicial debajo del titulo
        head: [headers],    // encabezados (array de arrays)
        body: rows,         // filas del reporte

        theme: "grid",      // estilo visual de la tabla

        // estilos del encabezado
        headStyles: {
            fillColor: [33, 150, 243],  // color de fondo (RGB)
            textColor: 255,             // color del texto
            fontSize: 11,
        },

        // estilos globales de las celdas
        styles: {
            fontSize: 10,
        },

        // margenes del documento
        margin: {
            left: 14,
            right: 14,
        },
    });

    // genera y descarga el archivo PDF
    doc.save(fileName);
}
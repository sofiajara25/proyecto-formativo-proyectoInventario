// libreria para manipulacion y generacion de archivos excel
import * as XLSX from "xlsx";

// funcion utilitaria para generar un archivo excel a partir de datos tabulares
// patron: exportacion de datos (dataset => archivo descargable)

export function generateExcelReport({
    headers,                            // array de encabezados
    rows,                               // array de filas (array de arrays)
    fileName = "loan-report.xlsx"       // nombre del archivo de salida
}) {

    const currentDate = new Date().toLocaleDateString();

    // el titulo ocupa la misma cantidad de celdas que los headers
    const reportTitle = [`REPORTE DE PRESTAMOS - ${currentDate}`];
    const titleRow = new Array(headers.length).fill("");
    titleRow[0] = reportTitle[0]; // solo la primera celda tiene el texto

    // estructura final de la hoja
    const worksheetData = [
        titleRow,   // fila 1 - titulo
        [],         // fila 2 - vacia
        headers,    // fila 3 - encabezados
        ...rows     // fila 4 en adelante - datos
    ];

    // convierte array de arrays en hoja de excel
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // merge del titulo abarcando todas las columnas
    worksheet["!merges"] = [{
        s: { r: 0, c: 0 },
        e: { r: 0, c: headers.length - 1 }, // corregido: usa headers.length en vez de range.e.c
    }];

    // ancho de columnas
    worksheet["!cols"] = headers.map(() => ({ wch: 25 }));

    // altura de la primera fila
    worksheet["!rows"] = [{ hpt: 25 }];

    // crear libro de excel
    const workbook = XLSX.utils.book_new();

    // agregar hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prestamos");

    // genera y descarga el archivo
    XLSX.writeFile(workbook, fileName);
}
// Libreria para manipulacion y genereacion de archivos excel
import * as XLSX from "xlsx";

// Funcion utilitaria para generar un archivo excel a partir de datos tabulares

// Patron : exportacion de datos (dataset => archivo descargable)


export function generateExcelReport ({
    headers,                    //Array de encabezados
    rows,                       // Array de Filas (array de arrays)
    fileName = "user-report.xlsx"  // Nombre del archivo de salida
}) {


const currenDate = new Date().toLocaleDateString();
const reportTitle = `   **********   REPORTE DE USUARIOS - ${currenDate}  **********`;

    //Estructura Final de la hoja
    

    // Primera fila = headers
    //siguientes filas  = datos 

    const worksheetData = [
        [reportTitle],
        [],
        headers,
        ...rows
    ];


    //Convierte un array de arrays (AOA = Arrays of Arrays) en una hoja de excel
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);


    //Marge Visual
    const range = XLSX.utils.decode_range(worksheet["!ref"] )
    worksheet["!merges"] = [{
        s: { r: 0, c: 0},
        e: { r: 0, c: range.e.c},
    }];

    // Ancho de columna 
    worksheet["!cols"] = headers.map(() => ({wch: 25}))
    
    //Altura de la fila 
    worksheet["!rows"] = [{hpt: 25}]

    // Crear un nuevo libro de excel (workbook)
    const workbook = XLSX.utils.book_new();

    //Agrega la hoja del libro con el nombre del usuario
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");


    //Genera y descarga el archivo excel en el cliente
    XLSX.writeFile(workbook, fileName)
}
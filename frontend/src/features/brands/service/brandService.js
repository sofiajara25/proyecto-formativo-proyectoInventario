// URL base del endpoint de usuarios en el backend
// En desarrollo apunta al servidor Express local
// En producción debería provenir de variables de entorno
const API_URL = "http://localhost:5000/api/brands";
// import { getToken } from "@/shared/utils/tokenStorage";


// Función para crear un usuario en el backend
// Recibe un objeto con los datos del usuario
// Retorna la respuesta JSON del servidor
export async function createBrand(brandData) {

    const token = sessionStorage.getItem("token");

    // Realizamos la petición HTTP usando fetch
    const response = await fetch(API_URL, {
        // Método HTTP según convención REST
        method: "POST",


        // Cabeceras de la petición
        // Indicamos que enviamos JSON
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },


        // Convertimos el objeto userData a JSON
        body: JSON.stringify(brandData),
    });


    // Verificamos si la respuesta NO fue exitosa (status != 2xx)
    if (!response.ok) {
        // Leemos el cuerpo de la respuesta de error
        const error = await response.json();


        // Lanzamos una excepción con el mensaje de error
        // Esto permite que el componente que llama maneje el error con try/catch
        throw new Error(error.error || "Error al crear la marca");
    }


    // Si la petición fue exitosa, retornamos la respuesta parseada como JSON
    return response.json();
};

// Obtener todas las marcas (para la lista)
export async function getBrands() {
    const token = sessionStorage.getItem("token");
    const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al obtener marcas");
    return response.json();
};

export async function getBrandById(id) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/brands/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener marca");
    return response.json();
};

export async function updateBrand(id, brandData) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/brands/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brandData),
    });
    if (!response.ok) throw new Error("Error al actualizar marca");
    return response.json();
}

export async function updateBrandStatus(id, status) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Error al actualizar estado");
    return response.json();
}






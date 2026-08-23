// URL base del endpoint de usuarios en el backend
// En desarrollo apunta al servidor Express local
// En producción debería provenir de variables de entorno
const API_URL = "http://localhost:5000/api/consumableMaterial";
// import { getToken } from "@/shared/utils/tokenStorage";


// Función para crear un usuario en el backend
// Recibe un objeto con los datos del usuario
// Retorna la respuesta JSON del servidor
export async function createConsumableMaterial(consumableMaterialData) {
    const formData = new FormData();
    const token = sessionStorage.getItem("token");

    formData.append("materialAccountant", consumableMaterialData.materialAccountant);
    // materialToolId ya no se envía: el backend lo genera automáticamente.
    formData.append("materialSenaPlate", consumableMaterialData.materialSenaPlate);
    formData.append("materialName", consumableMaterialData.materialName);
    formData.append("materialEntryDate", consumableMaterialData.materialEntryDate);
    formData.append("materialQuantity", consumableMaterialData.materialQuantity);
    formData.append("inventoryNameId", consumableMaterialData.inventoryNameId);
    formData.append("materialLocation", consumableMaterialData.materialLocation);
    formData.append("materialUnitValue", consumableMaterialData.materialUnitValue);
    formData.append("materialTotalValue", consumableMaterialData.materialTotalValue);
    formData.append("materialStatus", consumableMaterialData.materialStatus);
    formData.append("materialDescription", consumableMaterialData.materialDescription);

    // Solo enviamos brandId si hay una marca seleccionada. FormData convierte
    // cualquier valor a texto, así que un null se volvería el string "null"
    // y Postgres lo rechazaría al intentar guardarlo en una columna entera.
    // Si el campo no viaja, el backend lo trata como ausente y guarda NULL.
    if (consumableMaterialData.brandId) {
        formData.append("brandId", consumableMaterialData.brandId);
    }

    if (Array.isArray(consumableMaterialData.materialTechnicalSheet) && consumableMaterialData.materialTechnicalSheet.length) {
        formData.append("materialTechnicalSheet", consumableMaterialData.materialTechnicalSheet[0]);
    }

    // archivos
    if (consumableMaterialData.photo?.length) {
        consumableMaterialData.photo.forEach((file) => {
            formData.append("photo", file);
        });
    }

    // Realizamos la petición HTTP usando fetch
    // IMPORTANTE: se envía "formData" (multipart/form-data), NO JSON.
    // No se debe fijar manualmente el header Content-Type: el navegador
    // necesita generar el boundary del multipart automáticamente. Si se
    // envía como JSON, multer nunca recibe los archivos (req.files queda
    // vacío) y la foto llega null al backend.
    const response = await fetch(API_URL, {
        // Método HTTP según convención REST
        method: "POST",

        // Cabeceras de la petición
        headers: {
            Authorization: `Bearer ${token}`,
        },

        body: formData,
    });

    // Verificamos si la respuesta NO fue exitosa (status != 2xx)
    if (!response.ok) {
        // Leemos el cuerpo de la respuesta de error
        const error = await response.json();


        // Lanzamos una excepción con el mensaje de error
        // Esto permite que el componente que llama maneje el error con try/catch
        throw new Error(error.error || "Error al crear material");
    }


    // Si la petición fue exitosa, retornamos la respuesta parseada como JSON
    return response.json();
};

// Vista previa del tool_id que se le asignará al próximo material creado.
// No reserva nada: solo consulta cuál sería.
export async function getNextConsumableToolId() {
    const response = await fetch(`${API_URL}/next-tool-id`);
    if (!response.ok) throw new Error("Error al obtener el próximo ID");
    const data = await response.json();
    return data.toolId;
}

export async function getConsumables() {
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/consumableMaterial", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener materiales de consumo");
    return response.json();
};

export async function getConsumableById(id) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/consumableMaterial/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener material de consumo");
    return response.json();
};

export async function updateConsumable(id, consumableMaterialData) {

    const formData = new FormData();

    formData.append("materialAccountant", consumableMaterialData.materialAccountant);
    formData.append("materialToolId", consumableMaterialData.materialToolId);
    formData.append("materialSenaPlate", consumableMaterialData.materialSenaPlate);
    formData.append("materialName", consumableMaterialData.materialName);
    formData.append("materialEntryDate", consumableMaterialData.materialEntryDate);
    formData.append("materialQuantity", consumableMaterialData.materialQuantity);
    formData.append("inventoryNameId", consumableMaterialData.inventoryNameId);
    formData.append("materialLocation", consumableMaterialData.materialLocation);
    formData.append("materialUnitValue", consumableMaterialData.materialUnitValue);
    formData.append("materialTotalValue", consumableMaterialData.materialTotalValue);
    formData.append("materialStatus", consumableMaterialData.materialStatus);
    formData.append("materialDescription", consumableMaterialData.materialDescription);

    // Solo enviamos brandId si hay una marca seleccionada (ver nota en
    // createConsumableMaterial más arriba).
    if (consumableMaterialData.brandId) {
        formData.append("brandId", consumableMaterialData.brandId);
    }

    // 📌 Aquí agregas la ficha técnica
    if (Array.isArray(consumableMaterialData.materialTechnicalSheet) && consumableMaterialData.materialTechnicalSheet.length) {
        formData.append("materialTechnicalSheet", consumableMaterialData.materialTechnicalSheet[0]);
    }

    // "photo" puede traer una MEZCLA de fotos que ya existían (strings con
    // la ruta) y fotos nuevas (File). Las que ya existían van en
    // "keepPhotos" (como JSON, porque FormData no soporta arreglos
    // anidados); las nuevas se suben como archivos.
    const photoItems = Array.isArray(consumableMaterialData.photo) ? consumableMaterialData.photo : [];
    const keepPhotos = photoItems.filter((item) => typeof item === "string");
    const newPhotoFiles = photoItems.filter((item) => item instanceof File);

    formData.append("keepPhotos", JSON.stringify(keepPhotos));
    newPhotoFiles.forEach((file) => formData.append("photo", file));

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        // headers: { "Content-Type": "application/json" },
        body: formData,
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar material de consumo");
    }

    return response.json();
}

export async function updateConsumableStatus(id, status) {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Error al actualizar estado");
    return response.json();
}






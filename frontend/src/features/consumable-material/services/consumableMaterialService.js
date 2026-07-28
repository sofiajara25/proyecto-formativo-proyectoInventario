// URL base del endpoint de usuarios en el backend
// En desarrollo apunta al servidor Express local
// En producción debería provenir de variables de entorno
const API_URL = "http://localhost:5000/api/consumableMaterial";


// Función para crear un usuario en el backend
// Recibe un objeto con los datos del usuario
// Retorna la respuesta JSON del servidor
export async function createConsumableMaterial(consumableMaterialData) {
    const formData = new FormData();

    formData.append("materialAccountant", consumableMaterialData.materialAccountant);
    formData.append("materialToolId", consumableMaterialData.materialToolId);
    formData.append("materialSenaPlate", consumableMaterialData.materialSenaPlate);
    formData.append("materialName", consumableMaterialData.materialName);
    formData.append("materialEntryDate", consumableMaterialData.materialEntryDate);
    formData.append("materialQuantity", consumableMaterialData.materialQuantity);
    formData.append("materialLocation", consumableMaterialData.materialLocation);
    formData.append("materialUnitValue", consumableMaterialData.materialUnitValue);
    formData.append("materialTotalValue", consumableMaterialData.materialTotalValue);
    formData.append("materialStatus", consumableMaterialData.materialStatus);
    formData.append("materialDescription", consumableMaterialData.materialDescription);
    formData.append("brandId", consumableMaterialData.brandId);

    // archivos
    if (consumableMaterialData.photo?.length) {
        consumableMaterialData.photo.forEach((file) => {
            formData.append("photo", file);
        });
    }

    // Realizamos la petición HTTP usando fetch
    const response = await fetch(API_URL, {
        // Método HTTP según convención REST
        method: "POST",

        // Cabeceras de la petición
        // Indicamos que enviamos JSON
        // headers: {
        //     "Content-Type": "application/json",
        // },


        // Convertimos el objeto userData a JSON
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
    formData.append("materialLocation", consumableMaterialData.materialLocation);
    formData.append("materialUnitValue", consumableMaterialData.materialUnitValue);
    formData.append("materialTotalValue", consumableMaterialData.materialTotalValue);
    formData.append("materialStatus", consumableMaterialData.materialStatus);
    formData.append("materialDescription", consumableMaterialData.materialDescription);
    formData.append("brandId", consumableMaterialData.brandId);

    if (Array.isArray(consumableMaterialData.photo) && consumableMaterialData.photo.length) {
        formData.append("photo", consumableMaterialData.photo[0]);
    }

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






const API_URL = "http://localhost:5000/api/returnableMaterial";
// import { getToken } from "@/shared/utils/tokenStorage";


// Agrega los campos comunes de texto/número (todo lo que NO son las fotos).
// El manejo de fotos se hace aparte porque crear y actualizar lo necesitan
// distinto (ver buildReturnableCreateFormData / buildReturnableUpdateFormData).
function appendCommonReturnableFields(formData, returnableMaterialData) {
    formData.append("materialToolId", returnableMaterialData.materialToolId);
    formData.append("materialSenaPlate", returnableMaterialData.materialSenaPlate);
    // Igual que con brandId: solo se envía si hay una categoría
    // seleccionada, para no mandar "null" como texto.
    if (returnableMaterialData.categoryId) {
        formData.append("categoryId", returnableMaterialData.categoryId);
    }
    formData.append("materialSerial", returnableMaterialData.materialSerial);
    formData.append("materialName", returnableMaterialData.materialName);
    formData.append("materialModel", returnableMaterialData.materialModel);
    formData.append("materialUnitValue", returnableMaterialData.materialUnitValue);
    formData.append("materialCustodian", returnableMaterialData.materialCustodian);
    formData.append("materialQuantity", returnableMaterialData.materialQuantity);
    formData.append("materialStatus", returnableMaterialData.materialStatus);
    formData.append("materialTotalValue", returnableMaterialData.materialTotalValue);
    formData.append("materialDimensions", returnableMaterialData.materialDimensions);
    formData.append("materialDescription", returnableMaterialData.materialDescription);

    // Solo enviamos brandId si hay una marca seleccionada. FormData convierte
    // cualquier valor a texto, así que un null se volvería el string "null"
    // y Postgres lo rechazaría al intentar guardarlo en una columna entera.
    // Si el campo no viaja, el backend lo trata como ausente y guarda NULL.
    if (returnableMaterialData.brandId) {
        formData.append("brandId", returnableMaterialData.brandId);
    }

    // Igual que "keepPhotos": un arreglo no se puede mandar directo en
    // multipart/form-data, así que viaja como JSON.
    formData.append("quotationIds", JSON.stringify(returnableMaterialData.quotationIds ?? []));

    // La ficha técnica es un solo archivo: si sigue siendo el string que ya
    // existía (no se tocó el campo), reenviarlo como texto no hace daño —
    // multer lo ignora como archivo y el backend conserva el actual.
    if (Array.isArray(returnableMaterialData.materialTechnicalSheet) && returnableMaterialData.materialTechnicalSheet.length) {
        formData.append("materialTechnicalSheet", returnableMaterialData.materialTechnicalSheet[0]);
    }
    formData.append("inventoryNameId", returnableMaterialData.inventoryNameId);

    formData.append("materialLocation", returnableMaterialData.materialLocation);
}

// Al crear, "photo" son puros archivos nuevos (todavía no existe nada que
// conservar): se mandan todos bajo el mismo campo "photo".
function buildReturnableCreateFormData(returnableMaterialData) {
    const formData = new FormData();
    appendCommonReturnableFields(formData, returnableMaterialData);

    const photoFiles = Array.isArray(returnableMaterialData.photo) ? returnableMaterialData.photo : [];
    photoFiles.forEach((file) => formData.append("photo", file));

    return formData;
}

// Al actualizar, "photo" puede traer una MEZCLA de fotos que ya existían
// (strings con la ruta) y fotos nuevas (File). Separamos: las que ya
// existían van en "keepPhotos" (como JSON, porque FormData no soporta
// arreglos anidados) y las nuevas se suben como archivos.
function buildReturnableUpdateFormData(returnableMaterialData) {
    const formData = new FormData();
    appendCommonReturnableFields(formData, returnableMaterialData);

    const photoItems = Array.isArray(returnableMaterialData.photo) ? returnableMaterialData.photo : [];
    const keepPhotos = photoItems.filter((item) => typeof item === "string");
    const newPhotoFiles = photoItems.filter((item) => item instanceof File);

    formData.append("keepPhotos", JSON.stringify(keepPhotos));
    newPhotoFiles.forEach((file) => formData.append("photo", file));

    return formData;
}

export async function createReturnableMaterial(returnableMaterialData) {
    // Realizamos la petición HTTP usando fetch
    const token = sessionStorage.getItem("token");

    // IMPORTANTE: se envía como multipart/form-data, NO como JSON. No se
    // debe fijar manualmente el header Content-Type: el navegador necesita
    // generar el boundary del multipart automáticamente. Si se envía como
    // JSON, multer nunca recibe los archivos (req.files queda vacío) y la
    // foto / ficha técnica llegan null al backend.
    const response = await fetch(API_URL, {
        // Método HTTP según convención REST
        method: "POST",

        // Cabeceras de la petición
        headers: {
            Authorization: `Bearer ${token}`,
        },

        body: buildReturnableCreateFormData(returnableMaterialData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear material");
    }

    return response.json();
}

// Vista previa del tool_id que se le asignará al próximo material creado.
// No reserva nada: solo consulta cuál sería.
export async function getNextReturnableToolId() {
    const response = await fetch(`${API_URL}/next-tool-id`);
    if (!response.ok) throw new Error("Error al obtener el próximo ID");
    const data = await response.json();
    return data.toolId;
}

export async function getReturnables() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener materiales devolutivos");
    return response.json();
}

export async function getReturnableById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Error al obtener material devolutivo");
    return response.json();
}

export async function updateReturnable(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: buildReturnableUpdateFormData(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar material devolutivo");
    }

    return response.json();
}

export async function updateReturnableStatus(id, status) {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Error al actualizar estado");
    return response.json();
}


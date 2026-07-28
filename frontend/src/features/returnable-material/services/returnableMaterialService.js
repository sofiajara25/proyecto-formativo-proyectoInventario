const API_URL = "http://localhost:5000/api/returnableMaterial";

function buildReturnableFormData(returnableMaterialData) {
    const formData = new FormData();

    formData.append("materialToolId", returnableMaterialData.materialToolId);
    formData.append("materialSenaPlate", returnableMaterialData.materialSenaPlate);
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
    formData.append("brandId", returnableMaterialData.brandId);

    if (Array.isArray(returnableMaterialData.materialTechnicalSheet) && returnableMaterialData.materialTechnicalSheet.length) {
        formData.append("materialTechnicalSheet", returnableMaterialData.materialTechnicalSheet[0]);
    }

    formData.append("materialLocation", returnableMaterialData.materialLocation);

    if (Array.isArray(returnableMaterialData.photo) && returnableMaterialData.photo.length) {
        formData.append("photo", returnableMaterialData.photo[0]);
    }

    return formData;
}

export async function createReturnableMaterial(returnableMaterialData) {
    const response = await fetch(API_URL, {
        method: "POST",
        body: buildReturnableFormData(returnableMaterialData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear material");
    }

    return response.json();
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
        body: buildReturnableFormData(data),
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


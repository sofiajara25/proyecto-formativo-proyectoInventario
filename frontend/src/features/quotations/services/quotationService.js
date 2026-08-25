const API_URL = "http://localhost:5000/api/quotations";

export async function createQuotation(quotationData) {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();

    formData.append("quotationName", quotationData.quotationName);
    formData.append("pdf", quotationData.pdf[0]);

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear la cotización");
    }

    return response.json();
}

export async function getQuotations() {
    const token = sessionStorage.getItem("token");
    const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener cotizaciones");
    return response.json();
}

export async function getQuotationById(id) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener la cotización");
    return response.json();
}

export async function updateQuotationStatus(id, status) {
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

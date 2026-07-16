const API_URL = "http://localhost:5000/api/loan";

function buildLoanFormData(loanData) {
    const formData = new FormData();

    formData.append("loanUser", loanData.loanUser);
    formData.append("loanCategory", loanData.loanCategory);
    formData.append("loanProductName", loanData.loanProductName);
    formData.append("loanDate", loanData.loanDate);
    formData.append("loanReturnDate", loanData.loanReturnDate);
    formData.append("loanDescription", loanData.loanDescription);

    if (Array.isArray(loanData.photo) && loanData.photo.length) {
        formData.append("photo", loanData.photo[0]);
    }

    return formData;
}

export async function createLoan(loanData) {
    const response = await fetch(API_URL, {
        method: "POST",
        body: buildLoanFormData(loanData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear prestamo");
    }

    return response.json();
}

export async function getLoans() {
    const token = sessionStorage.getItem("token");
    const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener prestamo");
    return response.json();
}

export async function getLoanById(id) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener prestamo");
    return response.json();
}

export async function updateLoan(id, loanData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: buildLoanFormData(loanData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar prestamo");
    }

    return response.json();
}

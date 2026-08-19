import axios from "axios";
// import { getToken } from "@/shared/utils/tokenStorage";


const API_URL = "http://localhost:5000/api/loan";

function buildLoanFormData(loanData) {
    const formData = new FormData();

    formData.append("loanMaterialType", loanData.loanMaterialType);
    formData.append("loanUser", loanData.loanUser);
    formData.append("loanApprenticeGroup", loanData.loanApprenticeGroup);
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
    const token = sessionStorage.getItem("token");
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
        body: JSON.stringify(loanData),
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

export async function getLoanById(loanId) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/${loanId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener prestamo");
    return response.json();
}

export async function updateLoan(loanId, loanData) {
    const response = await fetch(`${API_URL}/${loanId}`, {
        method: "PUT",
        body: buildLoanFormData(loanData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar prestamo");
    }

    return response.json();
}

export async function updateLoanStatus(loanId, isActive) {
  const response = await axios.put(`${API_URL}/${loanId}/status`, {
    is_active: isActive,
  });
  return response.data;
}

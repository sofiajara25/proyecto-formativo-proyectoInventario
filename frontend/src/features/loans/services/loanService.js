import axios from "axios";
// import { getToken } from "@/shared/utils/tokenStorage";


const API_URL = "http://localhost:5000/api/loan";

// Usada al ACTUALIZAR: "photo" puede traer una MEZCLA de fotos que ya
// existían (strings con la ruta) y fotos nuevas (File). Las que ya existían
// van en "keepPhotos" (como JSON, porque FormData no soporta arreglos
// anidados); las nuevas se suben como archivos.
function buildLoanFormData(loanData) {
    const formData = new FormData();

    formData.append("loanMaterialType", loanData.loanMaterialType);
    formData.append("loanUser", loanData.loanUser);
    formData.append("loanUserIdentification", loanData.loanUserIdentification ?? "");
    formData.append("loanApprenticeGroup", loanData.loanApprenticeGroup ?? "");
    formData.append("loanDate", loanData.loanDate);
    formData.append("loanReturnDate", loanData.loanReturnDate);
    formData.append("loanDescription", loanData.loanDescription);
    formData.append("loanType", loanData.loanType ?? "");
    // FormData convierte todo a texto: is_active se manda como "true"/"false"
    // y el backend lo vuelve a convertir a booleano.
    formData.append("isActive", String(loanData.isActive ?? true));
    // El préstamo ahora maneja varios materiales (no una sola
    // categoría/producto suelto), así que van como JSON dentro del
    // multipart/form-data igual que al crear.
    formData.append("materials", JSON.stringify(loanData.materials ?? []));

    const photoItems = Array.isArray(loanData.photo) ? loanData.photo : [];
    const keepPhotos = photoItems.filter((item) => typeof item === "string");
    const newPhotoFiles = photoItems.filter((item) => item instanceof File);

    formData.append("keepPhotos", JSON.stringify(keepPhotos));
    newPhotoFiles.forEach((file) => formData.append("photo", file));

    return formData;
}

// Usada al CREAR: "photo" son puros archivos nuevos (todavía no existe nada
// que conservar) y "materials" es el arreglo de materiales del préstamo, que
// va como JSON dentro del multipart/form-data (FormData no soporta arreglos
// anidados directamente).
function buildLoanCreateFormData(loanData) {
    const formData = new FormData();

    formData.append("loanMaterialType", loanData.loanMaterialType);
    formData.append("loanUser", loanData.loanUser);
    formData.append("loanUserIdentification", loanData.loanUserIdentification);
    formData.append("loanApprenticeGroup", loanData.loanApprenticeGroup);
    formData.append("loanDate", loanData.loanDate);
    formData.append("loanReturnDate", loanData.loanReturnDate);
    formData.append("loanDescription", loanData.loanDescription);
    formData.append("loanType", loanData.loanType);
    formData.append("isActive", String(loanData.isActive ?? true));
    formData.append("materials", JSON.stringify(loanData.materials ?? []));

    // Firma electrónica: si hay correo (venga de un usuario registrado o
    // escrito a mano), se manda para que el backend genere el enlace de
    // aceptación. Si no hay, simplemente no se crea la firma.
    if (loanData.signerEmail) {
        formData.append("signerEmail", loanData.signerEmail);
    }

    const photoFiles = Array.isArray(loanData.photo) ? loanData.photo : [];
    photoFiles.forEach((file) => formData.append("photo", file));

    return formData;
}

export async function createLoan(loanData) {
    const token = sessionStorage.getItem("token");

    // IMPORTANTE: se envía como multipart/form-data, NO como JSON. Antes se
    // mandaba JSON.stringify(loanData): eso nunca llegaba a subir la foto
    // (multer no recibe archivos en un body JSON) y tampoco serializaba bien
    // "materials". No se debe fijar manualmente el header Content-Type: el
    // navegador necesita generar el boundary del multipart automáticamente.
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: buildLoanCreateFormData(loanData),
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

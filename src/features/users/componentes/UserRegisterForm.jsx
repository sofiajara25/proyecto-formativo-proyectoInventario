import { useState, useEffect } from "react";
import { Input, Button, Select } from "@/shared";
import { getDocumentType } from "../services/selectServices.js";
import { userSchema } from "../schemas/userSchema";


export default function UserRegisterForm() {

    const [documentType, setDocumentType] = useState([]);
    const [formData, setFormData] = useState({
        userName: "",
        userDocumentType: "",
        userDocumentNumber: "",
        userType: "",
        userEndDate: "",
        userStartDate: "",
        userEmail: "",
        userAddress: "",
        userPhone: "",
        userStatus: "",
    });
    const [errors, setErrors] = useState({});

    const tiposUsuario = [
        { value: "admin", label: "Administrador" },
        { value: "usuario", label: "Usuario" }
    ];

    const estados = [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
    ];

    useEffect(() => {
        getDocumentType().then(setDocumentType);
    }, []);

    //=========================
    //      Handle Genérico
    //* Función que se ejecuta cada vez que cambia el valor de un input del formulario
    //==========================

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //=========================
    //      Handle Submit
    //* Función que se ejecuta cuando se envía el formulario
    //==========================

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = userSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                fieldErrors[field] = issue.message;
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        console.log("Usuario válido:", result.data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-600 to-purple-400 flex flex-col items-center justify-center">
            {/* Encabezado */}
            <header className="mb-8 text-center">
                <h1 className="text-white text-2xl font-bold">
                    Sistema Inventario de Infraestructura y <br/>Teleinformática CDITI SENA
                </h1>
            </header>
            <div className="bg-white p-8 rounded-xl w-full max-w-6xl ">
                <h1 className="text text-primary text-2xl mb-6">
                    Crear Cuenta
                </h1>
                <form
                    className="grid grid-cols-1 place-items-center gap-6"
                    onSubmit={handleSubmit}
                >
                    {/* Inputs */}
                    <div className="grid grid-cols-3 gap-6 mx-auto">

                        {/* Fila 1 */}
                        <Input
                            label="Nombre completo"
                            name="userName"
                            placeholder="Ingrese su nombre"
                            value={formData.userName}
                            type="text"
                            onChange={handleChange}
                            error={errors.userName}
                        />
                        <Select
                            label="Tipo de documento"
                            name="userDocumentType"
                            options={documentType}
                            value={formData.userDocumentType}
                            onChange={handleChange}
                            error={errors.userDocumentType}
                        />
                        <Input
                            label="Número de documento"
                            name="userDocumentNumber"
                            placeholder="Ingrese su número de documento"
                            value={formData.userDocumentNumber}
                            type="text"
                            onChange={handleChange}
                            error={errors.userDocumentNumber}
                        />

                        {/* Fila 2 */}
                        <Select
                            label="Tipo de usuario"
                            name="userType"
                            options={tiposUsuario}
                            value={formData.userType}
                            onChange={handleChange}
                            error={errors.userType}
                        />
                        <Input
                            label="Fecha de finalización"
                            name="userEndDate"
                            placeholder=""
                            value={formData.userEndDate}
                            type="date"
                            onChange={handleChange}
                            error={errors.userEndDate}
                        />
                        <Input
                            label="Fecha de inicio"
                            name="userStartDate"
                            placeholder=""
                            value={formData.userStartDate}
                            type="date"
                            onChange={handleChange}
                            error={errors.userStartDate}
                        />

                        {/* Fila 3 */}
                        <Input
                            label="Correo electrónico"
                            name="userEmail"
                            placeholder="Ingrese su correo"
                            value={formData.userEmail}
                            type="email"
                            onChange={handleChange}
                            error={errors.userEmail}
                        />
                        <Input
                            label="Dirección de domicilio"
                            name="userAddress"
                            placeholder="Ingrese su dirección"
                            value={formData.userAddress}
                            type="text"
                            onChange={handleChange}
                            error={errors.userAddress}
                        />
                        <Input
                            label="Número de teléfono"
                            name="userPhone"
                            placeholder="Ingrese su teléfono"
                            value={formData.userPhone}
                            type="tel"
                            onChange={handleChange}
                            error={errors.userPhone}
                        />

                        {/* Fila 4 */}
                        <Select
                            label="Estado"
                            name="userStatus"
                            options={estados}
                            value={formData.userStatus}
                            onChange={handleChange}
                            error={errors.userStatus}
                        />

                    </div>
                    {/* Acciones */}
                    <div className="flex items-end justify-center gap-6">
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                        >
                            Crear Cuenta
                        </Button>
                    </div>

                </form>
            </div>
        </div >
    );
}

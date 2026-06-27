import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Button } from "@/shared";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserById } from "../services/userService";
// import { users } from "../data/users";



export default function ViewUserPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserById(id)
            .then((data) => {
                console.log("Usuario desde backend:", data);
                setUser(data);
            })
            .catch((err) => console.error("Error cargando usuario:", err));
    }, [id]);

    if (!user)
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    background:
                        "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                }}
            >
                <p
                    style={{
                        color: "var(--color-white)",
                        fontSize: "var(--fs-sm)",
                    }}
                >
                    Usuario no encontrado.
                </p>
            </div>
        );

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background:
                    "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)",
            }}
            onClick={() => navigate("/dashboard/list-usuarios")}
        >
            <Navbar />

            <div
                className="flex flex-1 items-center justify-center px-10 py-8"
                onClick={() => navigate("/dashboard/list-usuarios")}
            >
                <div
                    className="bg-white rounded-2xl flex flex-col gap-6"
                    style={{ padding: "36px 40px", width: "100%", maxWidth: "680px" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center gap-6">
                        <div
                            className="flex items-center justify-center rounded-full"
                            style={{
                                width: "80px",
                                height: "80px",
                                background: "var(--color-primary-950)",
                                flexShrink: 0,
                            }}
                        >
                            {user.photo_url ? (
                                <img
                                    src={`http://localhost:5000/${user.photo_url}`}
                                    alt="Foto del usuario"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <User size={40} color="white" />
                            )}

                        </div>

                        <div className="flex flex-col gap-1">
                            <p
                                style={{
                                    fontSize: "var(--fs-sm)",
                                    fontWeight: "var(--font-weight-bold)",
                                    color: "var(--color-gray-900)",
                                    margin: 0,
                                }}
                            >
                                {user.user_name}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    color: "var(--color-gray-500)",
                                    margin: 0,
                                }}
                            >
                                {user.user_email}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    fontWeight: "var(--font-weight-bold)",
                                    color: "var(--color-primary-950)",
                                    margin: 0,
                                }}
                            >
                                {user.document_type} - {user.document_number}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Detalles */}
                    <div className="grid grid-cols-2 gap-4">
                        {[

                            { label: "Nombre", value: user.user_name },
                            { label: "Tipo documento", value: user.document_type },
                            { label: "Número documento", value: user.document_number },
                            { label: "Tipo usuario", value: user.user_type },
                            { label: "Fecha de inicio", value: user.start_date },
                            { label: "Fecha de finalización", value: user.end_date },
                            { label: "Correo", value: user.user_email },
                            { label: "Teléfono", value: user.user_phone },
                            { label: "Dirección", value: user.user_address },
                            { label: "Estado", value: user.user_status },
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col gap-1">
                                <p
                                    style={{
                                        fontSize: "var(--fs-xxxs)",
                                        fontWeight: "var(--font-weight-bold)",
                                        color: "var(--color-gray-500)",
                                        margin: 0,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    {item.label}
                                </p>
                                <p
                                    style={{
                                        fontSize: "var(--fs-xxs)",
                                        color: "var(--color-gray-900)",
                                        margin: 0,
                                    }}
                                >
                                    {item.value}
                                </p>
                            </div>
                        ))}

                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Acciones */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() => navigate(`/dashboard/users/${user.id}/edit`)}
                            type="button"
                            variant="primary"
                            size="md"
                        >
                            Editar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

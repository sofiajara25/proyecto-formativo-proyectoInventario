import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Button, PhotoViewer, formatDate } from "@/shared";
import { User } from "lucide-react";
import { getCurrentUser } from "../../auth/services/authService";
import { getMyProfile } from "../../users/services/userService";
import { getTasksByUserId } from "../../tasks/services/taskService";
import { isAdmin as checkIsAdmin } from "@/shared/utils/permissions";
import { TaskEvidenceCard } from "../../tasks";

// Correo de soporte a mostrar en "Mi perfil". Puesto como constante para
// cambiarlo fácil en un solo lugar el día que se confirme el definitivo.
const SUPPORT_EMAIL = "soporte@sena.edu.co";

export default function ProfilePage() {
    const navigate = useNavigate();
    const isAdmin = checkIsAdmin();

    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    const fetchTasks = (userId) => {
        setLoadingTasks(true);
        getTasksByUserId(userId)
            .then((data) => setTasks(Array.isArray(data) ? data : []))
            .catch((err) => {
                console.error("Error al cargar mis tareas:", err);
                setTasks([]);
            })
            .finally(() => setLoadingTasks(false));
    };

    useEffect(() => {
        const user = getCurrentUser();

        if (!user) {
            setLoadingProfile(false);
            setLoadingTasks(false);
            return;
        }

        getMyProfile()
            .then(setProfile)
            .catch((err) => console.error("Error cargando el perfil:", err))
            .finally(() => setLoadingProfile(false));

        if (!isAdmin) {
            fetchTasks(user.id);
        } else {
            setLoadingTasks(false);
        }
    }, [isAdmin]);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <main className="flex-1 flex flex-col gap-4 p-4 sm:p-6 max-w-3xl w-full mx-auto">
                <h1 style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0 }}>
                    Mi perfil
                </h1>

                {/* Datos del usuario */}
                <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-4">
                    {loadingProfile ? (
                        <p className="text-sm text-gray-500">Cargando...</p>
                    ) : !profile ? (
                        <p className="text-sm text-gray-500">No se pudo cargar la información del usuario.</p>
                    ) : (
                        <>
                            <div className="flex items-center gap-4">
                                <PhotoViewer
                                    photos={profile.photo_url ? [profile.photo_url] : []}
                                    fallbackIcon={<User size={32} color="white" />}
                                    size={64}
                                    alt="Foto de perfil"
                                />
                                <div>
                                    <p className="text-lg font-bold text-gray-900">
                                        {profile.user_name} {profile.user_lastname}
                                    </p>
                                    <p className="text-sm text-gray-500">{profile.group_name || "Sin grupo asignado"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <p><strong>Nombres:</strong> {profile.user_name}</p>
                                <p><strong>Apellidos:</strong> {profile.user_lastname}</p>
                                <p><strong>Tipo de documento:</strong> {profile.document_type}</p>
                                <p><strong>Número de documento:</strong> {profile.document_number}</p>
                                <p><strong>Correo:</strong> {profile.user_email}</p>
                                <p><strong>Teléfono:</strong> {profile.user_phone || "—"}</p>
                                <p><strong>Dirección:</strong> {profile.user_address || "—"}</p>
                                <p><strong>Grupo:</strong> {profile.group_name || "—"}</p>
                                <p><strong>Fecha de inicio:</strong> {profile.start_date ? formatDate(profile.start_date) : "—"}</p>
                                <p><strong>Fecha de finalización:</strong> {profile.end_date ? formatDate(profile.end_date) : "—"}</p>
                                <p><strong>Estado:</strong> {profile.user_status}</p>
                            </div>

                            <div>
                                <Button variant="secondary" size="sm" onClick={() => navigate("/auth/recovery")}>
                                    Cambiar contraseña
                                </Button>
                            </div>

                            <p className="text-xs text-gray-400">
                                Si alguno de estos datos está mal o necesitas cambiarlo, escríbenos a{" "}
                                <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a>{" "}
                                indicando qué hay que corregir.
                            </p>
                        </>
                    )}
                </div>

                {/* Mis tareas: solo para usuarios estándar (los administradores
                    ya ven los préstamos recientes en la campana del navbar) */}
                {!isAdmin && (
                    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3">
                        <h2 className="text-sm font-bold text-gray-900">Mis tareas</h2>

                        {loadingTasks ? (
                            <p className="text-sm text-gray-500">Cargando...</p>
                        ) : tasks.length === 0 ? (
                            <p className="text-sm text-gray-500">No tienes tareas asignadas.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {tasks.map((task) => (
                                    <TaskEvidenceCard
                                        key={task.id}
                                        task={task}
                                        onUpdated={() => {
                                            const user = getCurrentUser();
                                            if (user) fetchTasks(user.id);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Soporte */}
                <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-1">
                    <h2 className="text-sm font-bold text-gray-900">¿Necesitas ayuda?</h2>
                    <p className="text-sm text-gray-500">
                        Si tienes algún problema con tu cuenta o con el sistema, o necesitas corregir o
                        cambiar algún dato de tu perfil, escríbenos a{" "}
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline text-primary-950">
                            {SUPPORT_EMAIL}
                        </a>
                        .
                    </p>
                </div>
            </main>
        </div>
    );
}

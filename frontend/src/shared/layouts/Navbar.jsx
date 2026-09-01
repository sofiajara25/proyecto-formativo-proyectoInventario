import { Menu, ArrowLeft, Bell, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    IconButton,
    Dropdown,
    DropdownTrigger,
    DropdownItem,
    DropdownContent,
    SearchField,
    Button,
    Modal,
    formatDate,
} from "@/shared";
import logoSena from "@/assets/images/LogoSena.png";
import { logout } from "../../features/auth/services/logoutSevice";
import { isAdmin as checkIsAdmin } from "@/shared/utils/permissions";
import { getCurrentUser } from "../../features/auth/services/authService";
import { getTasksByUserId, getTasksPendingConfirmation, confirmTask } from "../../features/tasks/services/taskService";
import { getLoans } from "../../features/loans/services/loanService";

const API_ORIGIN = "http://localhost:5000";

export default function Navbar() {
    const navigate = useNavigate();
    const isAdmin = checkIsAdmin();
    const [notifications, setNotifications] = useState([]);
    const [notifLoading, setNotifLoading] = useState(true);

    // Tareas que ESTE usuario asignó (creó) y que están "En revisión",
    // esperando que las apruebe o las rechace. Aplica a cualquiera que
    // haya creado una tarea, sea o no administrador.
    const [pendingConfirmations, setPendingConfirmations] = useState([]);
    const [reviewingTask, setReviewingTask] = useState(null);
    const [confirmError, setConfirmError] = useState("");

    // Cuántas cosas nuevas hay para mostrar como "burbuja" sobre la
    // campana, sin que haga falta abrir el dropdown para darse cuenta:
    // tareas por confirmar (para quien creó tareas) + tareas propias
    // rechazadas (para quien las tiene asignadas).
    const rejectedCount = !isAdmin
        ? notifications.filter((task) => task.rejectedAt).length
        : 0;
    const badgeCount = pendingConfirmations.length + rejectedCount;

    const loadPendingConfirmations = () => {
        getTasksPendingConfirmation()
            .then((items) => setPendingConfirmations(Array.isArray(items) ? items : []))
            .catch((err) => {
                console.error("Error cargando tareas por confirmar:", err);
                setPendingConfirmations([]);
            });
    };

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const handleConfirm = async (approve) => {
        if (!reviewingTask) return;
        setConfirmError("");
        try {
            await confirmTask(reviewingTask.id, approve);
            setReviewingTask(null);
            loadPendingConfirmations();
        } catch (err) {
            setConfirmError(err.message || "Error al confirmar la tarea");
        }
    };

    // Notificaciones: a un administrador le muestra los últimos 5
    // préstamos; a un usuario estándar, sus tareas asignadas. isAdmin()
    // lee el resumen de acceso guardado en el login (shared/utils/
    // permissions.js), así que no hace falta pedirlo de nuevo aquí.
    useEffect(() => {
        const user = getCurrentUser();

        const loadNotifications = !user
            ? Promise.resolve([])
            : isAdmin
                ? getLoans().then((loans) => loans.slice(-5).reverse())
                : getTasksByUserId(user.id).then((tasks) =>
                    // Ya completadas no son notificación de nada pendiente,
                    // así que no tiene sentido seguir mostrándolas aquí.
                    Array.isArray(tasks) ? tasks.filter((t) => t.status !== "Completada") : tasks
                );

        loadNotifications
            .then((items) => setNotifications(Array.isArray(items) ? items : []))
            .catch((err) => {
                console.error("Error cargando notificaciones:", err);
                setNotifications([]);
            })
            .finally(() => setNotifLoading(false));

        if (user) loadPendingConfirmations();
    }, [isAdmin]);

    return (
        <nav
            style={{
                background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
            }}
        >
            <div className="px-3 sm:px-4">
                <div className="flex h-14 sm:h-16 items-center gap-2 justify-between">

                    {/* Izquierda: volver + logo */}
                    <div className="flex items-center shrink-0 gap-14">
                        <IconButton
                            ariaLabel="Volver"
                            variant="nav"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={24} />
                        </IconButton>

                        <Link to="/dashboard/home" className="hidden md:block ml-10">
                            <img src={logoSena} alt="logo" className="h-10 sm:h-12 w-auto" />
                        </Link>
                    </div>

                    {/* Derecha: cerrar sesión + menú */}
                    <div className="flex items-center gap-2 shrink-0 justify-end">
                        {/* Cerrar sesión — oculto en móvil, visible en sm+ */}
                        <div className="hidden sm:block">
                            <Button onClick={handleLogout} variant="secondary" size="sm">
                                Cerrar sesión
                            </Button>
                        </div>

                        {/* Notificaciones */}
                        <Dropdown>
                            <DropdownTrigger>
                                <div className="relative">
                                    <IconButton ariaLabel="Notificaciones" variant="nav">
                                        <Bell size={24} />
                                    </IconButton>
                                    {badgeCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-600 text-white pointer-events-none"
                                            style={{ fontSize: "10px", fontWeight: "var(--font-weight-bold)", minWidth: "18px", height: "18px", padding: "0 4px" }}
                                        >
                                            {badgeCount > 9 ? "9+" : badgeCount}
                                        </span>
                                    )}
                                </div>
                            </DropdownTrigger>

                            <DropdownContent className="w-80 max-h-96 overflow-y-auto">
                                <div className="px-3 py-2 border-b border-white/10">
                                    <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)", fontWeight: "var(--font-weight-bold)" }}>
                                        {isAdmin ? "Últimos préstamos" : "Tareas asignadas"}
                                    </p>
                                </div>

                                {notifLoading && (
                                    <p className="px-3 py-2" style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}>
                                        Cargando...
                                    </p>
                                )}

                                {!notifLoading && notifications.length === 0 && (
                                    <p className="px-3 py-2" style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}>
                                        {isAdmin ? "No hay préstamos recientes" : "No tienes tareas asignadas"}
                                    </p>
                                )}

                                {!notifLoading && isAdmin && notifications.map((loan) => (
                                    <div key={loan.loan_id} className="px-3 py-2 border-b border-white/10 last:border-b-0">
                                        <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)", fontWeight: "var(--font-weight-bold)" }}>
                                            {loan.product_name}
                                        </p>
                                        <p style={{ fontSize: "var(--fs-xxxs)", color: "var(--color-gray-300)" }}>
                                            Usuario: {loan.loan_user}
                                        </p>
                                        <p style={{ fontSize: "var(--fs-xxxs)", color: "var(--color-gray-300)" }}>
                                            Fecha: {formatDate(loan.loan_date)}
                                        </p>
                                    </div>
                                ))}

                                {!notifLoading && !isAdmin && notifications.map((task) => (
                                    <div key={task.id} className="px-3 py-2 border-b border-white/10 last:border-b-0">
                                        <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)", fontWeight: "var(--font-weight-bold)" }}>
                                            {task.name}
                                        </p>
                                        {task.rejectedAt ? (
                                            <p style={{ fontSize: "var(--fs-xxxs)", color: "var(--color-red-300, #fca5a5)" }}>
                                                {task.creatorName
                                                    ? `${task.creatorName} ${task.creatorLastname ?? ""} rechazó tu tarea, vuelve a intentarlo`
                                                    : "Rechazaron tu tarea, vuelve a intentarlo"}
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: "var(--fs-xxxs)", color: "var(--color-gray-300)" }}>
                                                Entrega: {formatDate(task.dueDate)}
                                            </p>
                                        )}
                                    </div>
                                ))}

                                {/* Tareas que este usuario asignó y que están esperando
                                    su confirmación (aplica sin importar si es admin). */}
                                {pendingConfirmations.length > 0 && (
                                    <>
                                        <div className="px-3 py-2 border-b border-t border-white/10">
                                            <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)", fontWeight: "var(--font-weight-bold)" }}>
                                                Tareas por confirmar
                                            </p>
                                        </div>
                                        {pendingConfirmations.map((task) => (
                                            <button
                                                key={`pending-${task.id}`}
                                                type="button"
                                                onClick={() => setReviewingTask(task)}
                                                className="w-full text-left px-3 py-2 border-b border-white/10 last:border-b-0 hover:bg-white/5"
                                            >
                                                <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)", fontWeight: "var(--font-weight-bold)" }}>
                                                    {task.name}
                                                </p>
                                                <p style={{ fontSize: "var(--fs-xxxs)", color: "var(--color-gray-300)" }}>
                                                    {task.userName} {task.userLastname} dice que ya la hizo
                                                </p>
                                            </button>
                                        ))}
                                    </>
                                )}
                            </DropdownContent>
                        </Dropdown>

                        {/* Mi perfil */}
                        <Link to="/dashboard/perfil">
                            <IconButton ariaLabel="Mi perfil" variant="nav">
                                <User size={24} />
                            </IconButton>
                        </Link>

                        <Dropdown>
                            <DropdownTrigger>
                                <IconButton ariaLabel="Menú" variant="nav">
                                    <Menu size={24} />
                                </IconButton>
                            </DropdownTrigger>

                            <DropdownContent className="w-44">
                                <DropdownItem>
                                    <Link
                                        to="/dashboard/home"
                                        className="block w-full"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}
                                    >
                                        Inicio
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link
                                        to="/dashboard/list"
                                        className="block w-full"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}
                                    >
                                        Listas
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link
                                        to="/dashboard/setting"
                                        className="block w-full"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}
                                    >
                                        Ajustes
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link
                                        to="/dashboard/tasks/search"
                                        className="block w-full"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}
                                    >
                                        Buscar tareas
                                    </Link>
                                </DropdownItem>
                                {/* Cerrar sesión en móvil dentro del menú */}
                                <DropdownItem className="sm:hidden">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </DropdownItem>
                            </DropdownContent>
                        </Dropdown>
                    </div>

                </div>
            </div>

            {/* Revisar evidencia de una tarea y aprobarla o rechazarla */}
            <Modal
                isOpen={Boolean(reviewingTask)}
                title={reviewingTask?.name ?? ""}
                onClose={() => { setReviewingTask(null); setConfirmError(""); }}
                showFooter={false}
            >
                {reviewingTask && (
                    <div className="flex flex-col gap-3">
                        <p className="text-sm text-gray-600">
                            {reviewingTask.userName} {reviewingTask.userLastname} marcó esta tarea como hecha. Revisa la evidencia y confirma si quedó bien.
                        </p>

                        {reviewingTask.evidencePhoto && (
                            <img
                                src={`${API_ORIGIN}/${reviewingTask.evidencePhoto.replace(/^\/+/, "")}`}
                                alt="Evidencia de la tarea"
                                className="w-full max-h-72 object-contain rounded-lg border border-gray-200"
                            />
                        )}

                        {confirmError && <p className="text-red-600 text-sm">{confirmError}</p>}

                        <div className="flex justify-end gap-3 pt-1">
                            <Button variant="secondary" size="sm" onClick={() => handleConfirm(false)}>
                                Rechazar
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => handleConfirm(true)}>
                                Aprobar
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </nav>
    );
}
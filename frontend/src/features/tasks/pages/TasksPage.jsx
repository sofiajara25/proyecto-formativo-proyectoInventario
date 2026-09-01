import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Input, Button } from "@/shared";
import TaskCard, { getTaskDisplayStatus } from "@/shared/components/TaskCard";
import { getTasksByUserName, getAllTasks } from "../services/taskService";
import { getUsers } from "../../users/services/userService";
import TasksRegisterForm from "../components/TasksRegisterForm"

// Filtro de estado que se ve arriba de la lista de tareas.
const STATUS_FILTERS = ["Todas", "Pendiente", "En revisión", "Completada", "Rechazada"];

export default function TasksPage() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [searched, setSearched] = useState(true);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [statusFilter, setStatusFilter] = useState("Todas");

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(err => console.error("Error al cargar usuarios:", err));
    }, []);

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);;

    const handleSaveTask = (task) => {
        // Aquí puedes llamar a createTask(task) para guardar en BD
        setTasks((prev) => [...prev, task]);
    };

    // Se usa tanto al montar la página como para refrescar la lista después
    // de editar una tarea (ver onTaskUpdated en <TaskCard> más abajo).
    const fetchAllTasks = async () => {
        try {
            const data = await getAllTasks();
            setTasks(data);
        } catch (err) {
            console.error("Error al cargar tareas:", err);
        }
    };

    // 👇 cargar todas las tareas al montar
    useEffect(() => {
        fetchAllTasks();
    }, []);

    const handleSearch = async () => {
        if (!name.trim()) {
            setNameError("Ingresa un nombre de usuario");
            return;
        }
        setNameError("");
        setLoading(true);

        try {
            const data = await getTasksByUserName(name); // 👈 llamada al backend
            setTasks(data);
        } catch (err) {
            console.error("Error al obtener tareas:", err);
            setTasks([]);
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const handleEdit = (task) => {
        navigate(`/dashboard/tasks/${task.id}/edit`);
    };

    // Tareas ya filtradas por el estado elegido arriba de la lista.
    const filteredTasks = useMemo(() => {
        if (statusFilter === "Todas") return tasks;
        return tasks.filter((task) => getTaskDisplayStatus(task) === statusFilter);
    }, [tasks, statusFilter]);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <div>
                <h2 className="text-2xl font-medium text-center text-white">
                    Tareas
                </h2>
            </div>

            <main className="flex-1 flex flex-col md:flex-row items-stretch md:items-start gap-6 p-4 sm:p-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 md:w-72 md:flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col gap-3">
                        <h2
                            className="text-sm font-semibold"
                            style={{ color: "var(--color-primary-950)", fontFamily: "var(--main-font)" }}
                        >
                            Buscar tarea por persona
                        </h2>

                        <Input
                            label="Nombre de usuario"
                            type="text"
                            placeholder="Ingrese el nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            error={nameError}
                            containerClassName="w-full"
                        />


                        <Button variant="secondary" size="sm" onClick={handleSearch} disabled={loading}>
                            {loading ? "Buscando..." : "Buscar"}
                        </Button>
                    </div>

                    {/* 👇 Nuevo bloque para asignar tarea */}
                    <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col gap-3">
                        <h2
                            className="text-sm font-semibold"
                            style={{ color: "var(--color-primary-950)", fontFamily: "var(--main-font)" }}
                        >
                            Asignar nueva tarea
                        </h2>

                        <Button variant="primary" size="sm" onClick={() => setIsRegisterOpen(true)}>
                            Crear tarea
                        </Button>
                    </div>

                    {isRegisterOpen && (
                        <TasksRegisterForm
                            users={users} // 👈 lista de usuarios
                            onClose={() => setIsRegisterOpen(false)}
                            onSaveTask={handleSaveTask}
                        />
                    )}
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-lg p-5 min-h-[300px]">
                    {/* Filtro por estado */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {STATUS_FILTERS.map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
                                style={
                                    statusFilter === status
                                        ? { background: "var(--color-primary-950)", borderColor: "var(--color-primary-950)", color: "white" }
                                        : { background: "white", borderColor: "#e5e7eb", color: "#4b5563" }
                                }
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {!searched ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-30 pointer-events-none">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-gray-200 rounded-2xl h-28" />
                            ))}
                        </div>
                    ) : tasks.length === 0 ? (
                        <p className="text-sm text-center mt-10" style={{ color: "var(--color-tertiary-950)", fontFamily: "var(--main-font)" }}>
                            No se encontraron tareas para este usuario.
                        </p>
                    ) : filteredTasks.length === 0 ? (
                        <p className="text-sm text-center mt-10" style={{ color: "var(--color-tertiary-950)", fontFamily: "var(--main-font)" }}>
                            No hay tareas con el estado "{statusFilter}".
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredTasks.map((task) => (
                                <TaskCard key={task.id} task={task} onEdit={handleEdit} onTaskUpdated={fetchAllTasks} />
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
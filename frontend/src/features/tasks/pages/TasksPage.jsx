import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Input, Button } from "@/shared";
import TaskCard from "@/shared/components/TaskCard";
import { getTasksByUserName, getAllTasks } from "../services/taskService";

export default function TasksPage() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [searched, setSearched] = useState(true);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [loading, setLoading] = useState(false);

    // 👇 cargar todas las tareas al montar
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getAllTasks();
                setTasks(data);
            } catch (err) {
                console.error("Error al cargar tareas:", err);
            }
        };
        fetchTasks();
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

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <main className="flex-1 flex flex-col lg:flex-row items-stretch lg:items-start gap-6 p-4 sm:p-6">

                <div className="w-full lg:w-72 lg:flex-shrink-0 bg-white rounded-xl shadow-lg p-5 flex flex-col gap-3">
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

                <div className="flex-1 bg-white rounded-xl shadow-lg p-5 min-h-[300px]">
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
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {tasks.map((task) => (
                                <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
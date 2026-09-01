import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/shared";
import TaskCard from "@/shared/components/TaskCard";
import { getTasksByUserId } from "../services/taskService";
import { getCurrentUser } from "../../auth/services/authService";

export default function MyTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(() => {
        const user = getCurrentUser();

        const request = user ? getTasksByUserId(user.id) : Promise.resolve([]);

        return request
            .then((data) => setTasks(data))
            .catch((err) => {
                console.error("Error al cargar mis tareas:", err);
                setTasks([]);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <main className="flex-1 flex flex-col gap-4 p-4 sm:p-6">
                <h1 style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0 }}>
                    Mis tareas
                </h1>

                <div className="flex-1 bg-white rounded-xl shadow-lg p-5 min-h-[300px]">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-30 pointer-events-none">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-gray-200 rounded-2xl h-28" />
                            ))}
                        </div>
                    ) : tasks.length === 0 ? (
                        <p className="text-sm text-center mt-10" style={{ color: "var(--color-tertiary-950)", fontFamily: "var(--main-font)" }}>
                            No tienes tareas asignadas.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {tasks.map((task) => (
                                <TaskCard key={task.id} task={task} onTaskUpdated={fetchTasks} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

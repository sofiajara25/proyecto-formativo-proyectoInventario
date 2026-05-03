// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/shared";
import { Login } from "@/features/auth";
import { CreateUserPage } from "@/features/users"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [{ index: true }],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <CreateUserPage/>},
      { path: "/dashboard/auth", element: <Login/>},
      { path: "usuarios", element: <h1>Usuarios</h1> },
      { path: "productos", element: <h1>Productos</h1> },      
    ],
  },
]);

export default router;

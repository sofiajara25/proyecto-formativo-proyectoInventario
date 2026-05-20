// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/shared";
import { Login } from "@/features/auth";
import { CreateUserPage } from "@/features/users";
import { HomePage } from "@/features/home";

// 👇 Importamos las 4 páginas de los formularios
import { CreateLoansPage }              from "@/features/loans";
import { CreateMaterialPage }           from "@/features/consumable-material";
import { CreateReturnableMaterialPage } from "@/features/returnable-material";
import { CreateBrandsPage }             from "@/features/brands";

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
      { index: true, element: <h1></h1> },
      { path: "/dashboard/auth", element: <Login /> },
      { path: "/dashboard/productos", element: <h1>Productos</h1> },

      // Ruta del home
      { path: "/dashboard/home", element: <HomePage /> },

      // Rutas de los 4 formularios
      { path: "/dashboard/prestamo",   element: <CreateLoansPage /> },
      { path: "/dashboard/consumo",    element: <CreateMaterialPage /> },
      { path: "/dashboard/devolutivo", element: <CreateReturnableMaterialPage /> },
      { path: "/dashboard/usuarios",  element: <CreateUserPage/>},
      { path: "/dashboard/retorno",    element: <CreateBrandsPage /> },
    ],
  },
]);

export default router;
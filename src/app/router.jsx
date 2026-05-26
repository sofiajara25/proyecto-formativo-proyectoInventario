// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "@/shared";
import { Login } from "@/features/auth";
import { CreateUserPage, ListUserPage } from "@/features/users";
import { HomePage, ListPage, SettingsPage } from "@/features/home";

// 👇 Importamos las 4 páginas de los formularios
import { CreateLoansPage, ListLoansPage } from "@/features/loans";
import { CreateMaterialPage, ListConsumablePage } from "@/features/consumable-material";
import { CreateReturnableMaterialPage, ListReturMaterialPage } from "@/features/returnable-material";
import { CreateBrandsPage, ListBrandPage, UpdateBrandPage } from "@/features/brands";

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
      { path: "/dashboard/list", element: <ListPage /> },
      { path: "/dashboard/setting", element: <SettingsPage /> },
      

      // Rutas de los 4 formularios de crear
      { path: "/dashboard/prestamo",   element: <CreateLoansPage /> },
      { path: "/dashboard/consumo",    element: <CreateMaterialPage /> },
      { path: "/dashboard/devolutivo", element: <CreateReturnableMaterialPage /> },
      { path: "/dashboard/usuarios",  element: <CreateUserPage/>},
      { path: "/dashboard/retorno",    element: <CreateBrandsPage /> },

       // Rutas de los 4 formularios de listas
      { path: "/dashboard/list-prestamo",   element: <ListLoansPage/> },
      { path: "/dashboard/list-consumo",    element: <ListConsumablePage /> },
      { path: "/dashboard/list-devolutivo", element: <ListReturMaterialPage /> },
      { path: "/dashboard/list-usuarios",  element: <ListUserPage/>},
      { path: "/dashboard/list-retorno",    element: <CreateBrandsPage /> },
      { path: "/dashboard/list-marca", element: <ListBrandPage/> },
    ],
  },
]);

export default router;
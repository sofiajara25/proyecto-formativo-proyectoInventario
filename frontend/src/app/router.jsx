// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout, ProtectedRoute } from "@/shared";
import { Login, ForgotPassword, VerifyCode, ResetPassword } from "@/features/auth";
import { CreateUserPage, ListUserPage, UpdateUserPage, ViewUserPage } from "@/features/users";
import { HomePage, ListPage, SettingsPage } from "@/features/home";
import { AccessPage } from "@/features/access";


// 👇 Importamos las 4 páginas de los formularios
import { CreateLoansPage, ListLoansPage, UpdateLoansPage, ViewLoanPage } from "@/features/loans";
import { CreateMaterialPage, ListConsumablePage, UpdateMaterialPage, ViewConsumablePage } from "@/features/consumable-material";
import { CreateReturnableMaterialPage, ListReturMaterialPage, UpdateReturnablePage, ViewReturMaterialPage } from "@/features/returnable-material";
import { CreateBrandsPage, ListBrandPage, UpdateBrandPage, ViewBrandPage } from "@/features/brands";
import { CreateReturnPage, UpdateReturnPage, ListReturnPage } from "@/features/returns"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "recovery", element: <ForgotPassword /> },
      { path: "recovery/verify", element: <VerifyCode /> },
      { path: "recovery/reset", element: <ResetPassword /> },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>,
    children: [
      { index: true, element: <h1></h1> },
      { path: "/dashboard/auth", element: <Login /> },
      { path: "/dashboard/productos", element: <h1>Productos</h1> },

      // Ruta del home
      { path: "/dashboard/home", element: <HomePage /> },
      { path: "/dashboard/list", element: <ListPage /> },
      { path: "/dashboard/setting", element: <SettingsPage /> },


      // Rutas de los 4 formularios de crear
      { path: "/dashboard/prestamo", element: <CreateLoansPage /> },
      { path: "/dashboard/consumo", element: <CreateMaterialPage /> },
      { path: "/dashboard/devolutivo", element: <CreateReturnableMaterialPage /> },
      { path: "/dashboard/usuarios", element: <CreateUserPage /> },
      { path: "/dashboard/retorno", element: <CreateReturnPage /> },
      { path: "/dashboard/marca", element: <CreateBrandsPage /> },


      // Rutas de los 4 formularios de listas
      { path: "/dashboard/list-prestamo", element: <ListLoansPage /> },
      { path: "/dashboard/list-consumo", element: <ListConsumablePage /> },
      { path: "/dashboard/list-devolutivo", element: <ListReturMaterialPage /> },
      { path: "/dashboard/list-usuarios", element: <ListUserPage /> },
      { path: "/dashboard/list-retorno", element: <ListReturnPage /> },
      { path: "/dashboard/list-marca", element: <ListBrandPage /> },

      // Rutas de Actulizar
      { path: "/dashboard/loans/:id/edit", element: <UpdateLoansPage /> },
      { path: "/dashboard/brands/:id/edit", element: <UpdateBrandPage /> },
      { path: "/dashboard/consumables/:id/edit", element: <UpdateMaterialPage /> },
      { path: "/dashboard/retornables/:id/edit", element: <UpdateReturnablePage /> },
      { path: "/dashboard/users/:id/edit", element: <UpdateUserPage /> },

      // Rutas de Ver
      { path: "/dashboard/loans/:id/view", element: <ViewLoanPage /> },
      { path: "/dashboard/users/:id/view", element: <ViewUserPage /> },
      { path: "/dashboard/brands/:id/view", element: <ViewBrandPage /> },
      { path: "/dashboard/consumables/:id/view", element: <ViewConsumablePage /> },
      { path: "/dashboard/retornables/:id/view", element: <ViewReturMaterialPage /> },

      {
        path: "/dashboard/access",
        element: <AccessPage />,
      },
    ],
  },
]);

export default router;

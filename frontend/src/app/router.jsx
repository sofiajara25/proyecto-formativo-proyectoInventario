// src/app/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout, ProtectedRoute, RequirePermission, RequireSuperAdmin } from "@/shared";
// import { getToken } from "@/shared/utils/tokenStorage";
import { Login, ForgotPassword, VerifyCode, ResetPassword } from "@/features/auth";
import { CreateUserPage, ListUserPage, UpdateUserPage, ViewUserPage } from "@/features/users";
import { HomePage, ListPage, SettingsPage } from "@/features/home";
import { AccessPage } from "@/features/access";


// 👇 Importamos las 4 páginas de los formularios
import { CreateLoansPage, ListLoansPage, UpdateLoansPage, ViewLoanPage } from "@/features/loans";
import { CreateMaterialPage, ListConsumablePage, UpdateMaterialPage, ViewConsumablePage } from "@/features/consumable-material";
import { CreateReturnableMaterialPage, ListReturMaterialPage, UpdateReturnablePage, ViewReturMaterialPage } from "@/features/returnable-material";
import { CreateBrandsPage, ListBrandPage, UpdateBrandPage, ViewBrandPage } from "@/features/brands";
import { CreateReturnPage, UpdateReturnPage, ListReturnPage, ViewReturnPage } from "@/features/returns"
import { CreateInventoryNamePage, ListInventoryNamePage, UpdateInventoryNamePage, ViewInventoryNamePage } from "@/features/inventory-name"

import {CreateCategoryPage, ListCategoryPage, UpdateCategoryPage, ViewCategoryPage} from "@/features/categorys"

import { TasksPage } from "@/features/tasks"

import { QuotationsPage } from "@/features/quotations"

import { AcceptLoanPage } from "@/features/loan-signatures"

import { ProfilePage } from "@/features/profile"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />,
  },
  // Pública: se llega desde el enlace del correo, sin necesidad de iniciar
  // sesión (quien firma puede no tener cuenta en el sistema).
  {
    path: "/aceptar-prestamo/:token",
    element: <AcceptLoanPage />,
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
      { path: "/dashboard/perfil", element: <ProfilePage /> },

      // Tarea
      {
        path: "/dashboard/tasks/search",
        element: (
          <RequirePermission permission="list_task">
            <TasksPage />
          </RequirePermission>
        ),
      },

      // Cotizaciones (sin lista/CRUD completo: solo crear y ver, como tareas)
      {
        path: "/dashboard/cotizaciones",
        element: (
          <RequirePermission permission="list_quotation">
            <QuotationsPage />
          </RequirePermission>
        ),
      },

      // Rutas de los formularios de crear
      {
        path: "/dashboard/prestamo",
        element: (
          <RequirePermission permission="create_loan">
            <CreateLoansPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/consumo",
        element: (
          <RequirePermission permission="create_consumable_material">
            <CreateMaterialPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/devolutivo",
        element: (
          <RequirePermission permission="create_returnable_material">
            <CreateReturnableMaterialPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/usuarios",
        element: (
          <RequirePermission permission="create_user">
            <CreateUserPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/retorno",
        element: (
          <RequirePermission permission="create_return">
            <CreateReturnPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/marca",
        element: (
          <RequirePermission permission="create_brand">
            <CreateBrandsPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/nombreInventario",
        element: (
          <RequirePermission permission="create_inventory_name">
            <CreateInventoryNamePage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/categoria",
        element: (
          <RequirePermission permission="create_category">
            <CreateCategoryPage />
          </RequirePermission>
        ),
      },

      // Rutas de los formularios de listas
      {
        path: "/dashboard/list-prestamo",
        element: (
          <RequirePermission permission="list_loan">
            <ListLoansPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/list-consumo",
        element: (
          <RequirePermission permission="list_consumable_material">
            <ListConsumablePage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/list-devolutivo",
        element: (
          <RequirePermission permission="list_returnable_material">
            <ListReturMaterialPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/list-usuarios",
        element: (
          <RequirePermission permission="list_user">
            <ListUserPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/list-retorno",
        element: (
          <RequirePermission permission="list_return">
            <ListReturnPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/list-marca",
        element: (
          <RequirePermission permission="list_brand">
            <ListBrandPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/list-nombreInventario",
        element: (
          <RequirePermission permission="list_inventory_name">
            <ListInventoryNamePage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/list-categoria",
        element: (
          <RequirePermission permission="list_category">
            <ListCategoryPage />
          </RequirePermission>
        ),
      },


      // Rutas de Actulizar
      {
        path: "/dashboard/loans/:loan_id/edit",
        element: (
          <RequirePermission permission="modify_loan">
            <UpdateLoansPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/brands/:id/edit",
        element: (
          <RequirePermission permission="modify_brand">
            <UpdateBrandPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/consumables/:id/edit",
        element: (
          <RequirePermission permission="modify_consumable_material">
            <UpdateMaterialPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/retornables/:id/edit",
        element: (
          <RequirePermission permission="modify_returnable_material">
            <UpdateReturnablePage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/users/:id/edit",
        element: (
          <RequirePermission permission="modify_user">
            <UpdateUserPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/retorno/:id/edit",
        element: (
          <RequirePermission permission="modify_return">
            <UpdateReturnPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/inventory-names/:id/edit",
        element: (
          <RequirePermission permission="modify_inventory_name">
            <UpdateInventoryNamePage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/categorys/:id/edit",
        element: (
          <RequirePermission permission="modify_category">
            <UpdateCategoryPage />
          </RequirePermission>
        ),
      },


      // Rutas de Ver
      {
        path: "/dashboard/loans/:loan_id/view",
        element: (
          <RequirePermission permission="view_loan">
            <ViewLoanPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/users/:id/view",
        element: (
          <RequirePermission permission="view_user">
            <ViewUserPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/brands/:id/view",
        element: (
          <RequirePermission permission="view_brand">
            <ViewBrandPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/consumables/:id/view",
        element: (
          <RequirePermission permission="view_consumable_material">
            <ViewConsumablePage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/retorno/:id/view",
        element: (
          <RequirePermission permission="view_return">
            <ViewReturnPage />
          </RequirePermission>
        ),
      },

      {
        path: "/dashboard/retornables/:id/view",
        element: (
          <RequirePermission permission="view_returnable_material">
            <ViewReturMaterialPage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/inventory-names/:id/view",
        element: (
          <RequirePermission permission="view_inventory_name">
            <ViewInventoryNamePage />
          </RequirePermission>
        ),
      },
      {
        path: "/dashboard/categorys/:id/view",
        element: (
          <RequirePermission permission="view_category">
            <ViewCategoryPage />
          </RequirePermission>
        ),
      },


      {
        path: "/dashboard/access",
        element: (
          <RequireSuperAdmin>
            <AccessPage />
          </RequireSuperAdmin>
        ),
      },
    ],
  },
]);

export default router;

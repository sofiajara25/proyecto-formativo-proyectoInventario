import { Dices, Users2, UserRoundCheck, ShelvingUnit, ChartColumnStacked, FileText } from "lucide-react"

export const settings = [
    {
        id: 1,
        title: "Gestión de Marca",
        logo: Dices,
        category: "perifericos",
        path: "/dashboard/list-marca",
        permission: "list_brand",
    },
    {
        id: 2,
        title: "Grupos",
        logo: Users2,
        category: "perifericos",
        path: "/dashboard/access",
        // Este no usa "permission": se filtra aparte por isSuperAdmin en
        // SettingsPage.jsx, no es parte del sistema de permisos normal.
    },
    {
        id: 3,
        title: "Gestionar usuario",
        logo: UserRoundCheck,
        category: "perifericos",
        path: "/dashboard/list-usuarios",
        permission: "list_user",
    },
    {
        id: 4,
        title: "Nombre del Inventario",
        logo: ShelvingUnit,
        category: "perifericos",
        path: "/dashboard/list-nombreInventario",
        permission: "list_inventory_name",
    },
    {
        id: 5,
        title: "Categoría",
        logo: ChartColumnStacked,
        category: "perifericos",
        path: "/dashboard/list-categoria",
        permission: "list_category",
    },
    {
        id: 6,
        title: "Cotizaciones",
        logo: FileText,
        category: "perifericos",
        path: "/dashboard/cotizaciones",
        permission: "list_quotation",
    },
]

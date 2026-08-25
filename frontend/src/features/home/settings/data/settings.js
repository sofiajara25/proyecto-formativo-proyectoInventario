import { Dices, Users2, UserRoundCheck, ShelvingUnit, ChartColumnStacked, FileText } from "lucide-react"

export const settings = [
    {
        id: 1,
        title: "Gestión de Marca",
        logo: Dices,
        category: "perifericos",
        path: "/dashboard/list-marca",
    },
    {
        id: 2,
        title: "Grupos",
        logo: Users2,
        category: "perifericos",
        path: "/dashboard/access",
    },
    {
        id: 3,
        title: "Gestionar usuario",
        logo: UserRoundCheck,
        category: "perifericos",
        path: "/dashboard/list-usuarios",
    },
    {
        id: 4,
        title: "Nombre del Inventario",
        logo: ShelvingUnit,
        category: "perifericos",
        path: "/dashboard/list-nombreInventario",
    },
    {
        id: 5,
        title: "Categoría",
        logo: ChartColumnStacked,
        category: "perifericos",
        path: "/dashboard/list-categoria",
    },
    {
        id: 6,
        title: "Cotizaciones",
        logo: FileText,
        category: "perifericos",
        path: "/dashboard/cotizaciones",
    },
]

import {
  ArrowLeftRight,
  PackageOpen,
  Users,
  RefreshCw,
} from "lucide-react";

export const lists = [
    {
        id: 1,
        title: "Gestionar Préstamo",
        path: "/dashboard/list-prestamo",
        category: "perifericos",
        logo: ArrowLeftRight,
    },
    {
        id: 2,
        title: "Gestionar Material de Devolutivo",
        path: "/dashboard/list-devolutivo",
        category: "perifericos",
        logo: PackageOpen
    },
    {
        id: 3,
        title: "Gestionar Retorno",
        path: "/dashboard/list-retorno",
        category: "perifericos",
        logo: Users
    },
    {
        id: 4,
        title: "Gestionar Material de Consumo",
        path: "/dashboard/list-consumo",
        category: "perifericos",
        logo: RefreshCw
    },
];
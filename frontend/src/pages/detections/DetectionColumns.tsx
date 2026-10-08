import { type ColumnDef, type Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header"
import type { Detection } from "@/redux/slices/DetectionSlice"

// Filtre de dates : filterValue = [debut, fin], format yyyy-mm-dd
const dateBetweenFilter = (row: Row<Detection>, _columnId: string, filterValue: [string, string]) => {
    const rowDate = new Date(row.original.date_detection)
    const [start, end] = filterValue

    if (start && rowDate < new Date(start)) return false
    // on prend toute la journée de fin
    if (end && rowDate > new Date(end + "T23:59:59")) return false
    return true
}

export const colonneDetection: ColumnDef<Detection>[] = [
    {
        accessorKey: "date_detection",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ getValue }) => {
            const date = new Date(getValue<string>())
            return <span>{date.toLocaleString("fr-FR")}</span>
        },
        filterFn: dateBetweenFilter,
    },
    {
        accessorKey: "numero",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Plaque" />,
        cell: ({ getValue }) => <span className="font-mono font-medium">{getValue<string>()}</span>,
    },
    {
        accessorKey: "camera",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Caméra" />,
        cell: ({ getValue }) => getValue<string | null>() ?? "-",
    },
    {
        id: "statut",
        header: "Statut",
        cell: ({ row }) => {
            const { alerte, reconnue } = row.original

            if (reconnue) {
                return <Badge className="bg-green-500 text-white">Reconnue</Badge>
            }
            // alerte = plaque détectée mais rien de lisible
            if (alerte) {
                return <Badge className="bg-red-500 text-white">Illisible</Badge>
            }
            return <Badge className="bg-amber-500 text-white">À vérifier</Badge>
        },
    },
]

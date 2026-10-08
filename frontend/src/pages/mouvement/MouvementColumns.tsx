"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header"
import React from "react"
import { Badge } from "@/components/ui/badge"
import { LogIn, LogOut } from "lucide-react"


type StatusType = "Actif" | "En maintenance" | "En panne";

export type Camera = {
    id: number
    code: string,
    rtsp_url: string,
    description: string,
    type: string,
    zone: any,
    status: StatusType
}

export interface Mouvement {
    id: number
    camera: Camera
    quantite: number
    timestamp: string
}

const dateBetweenFilter = (row: any, columnId: string, filterValue: [string, string]) => {
    const rowDate = new Date(row.original[columnId])
    const [start, end] = filterValue

    if (start && rowDate < new Date(start)) return false
    if (end && rowDate > new Date(end)) return false
    return true
}

export const colonneMouvement: ColumnDef<Mouvement>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "timestamp",
        header: "Date",
        cell: ({ getValue }) => {
            const value = getValue<string>()
            const date = new Date(value)

            return (
                <span>
                    {date.toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}{" "}
                    {date.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })}
                </span>
            )
        },
        filterFn:dateBetweenFilter
    },
    {
        accessorFn: (row) => row.camera?.code,
        id: "camera",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Camera" />
        ),
    },
    {
        accessorFn: (row) => row.camera?.type,
        id: 'type',
        header: "Type",
        cell: ({ getValue }) => {
            const value = getValue<string>()

            let icon, label, className

            if (value === "entree") {
                icon = <LogIn className="w-4 h-4 mr-1" />
                label = "Entrée"
                className = "bg-green-500 hover:bg-green-600 text-white"
            } else if (value === "sortie") {
                icon = <LogOut className="w-4 h-4 mr-1" />
                label = "Sortie"
                className = "bg-red-500 hover:bg-red-600 text-white"
            } else {
                label = "Inconnu"
                className = "bg-gray-500 text-white"
            }

            return (
                <Badge variant="secondary" className={`flex items-center ${className}`}>
                    {icon}
                    {label}
                </Badge>
            )
        },
    },
    {
        accessorKey: "quantite",
        header: "Quantité",
    },

]
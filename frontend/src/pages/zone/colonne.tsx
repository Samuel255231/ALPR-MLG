"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header"
import React from "react"
import EditZone from "./EditZone"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import { deleteZone } from "@/redux/slices/ZoneSlice"

export type Zone = {
    id: number
    nom: string
}

export const colonneZone: ColumnDef<Zone>[] = [
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
        accessorKey: "nom",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nom" />
        ),
    },
    {
        id: "actions",
        cell: function ActionsZone({ row }) {
            const dispatch = useDispatch<AppDispatch>()
            const zone = row.original
            const [editZone, setEditZone] = React.useState<boolean>(false)

            return (
                <div>
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setEditZone(!editZone)
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="text-green-600">Editer</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    dispatch(deleteZone(zone.id))
                                }}>
                                    <Trash className="mr-2 h-4 w-4 text-red-600" />
                                    <span className="text-red-600">Supprimer</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <EditZone zone={zone} open={editZone} setOpen={setEditZone} />
                </div>
            )
        },
    },
]
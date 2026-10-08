"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { CheckCircle, Edit, MoreHorizontal, Trash, Wrench, XCircle } from "lucide-react"
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
// import EditZone from "./EditZone"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import { deleteCamera, updateCamera } from "@/redux/slices/CameraSlice"
import { StatusBadge } from "./StatusBadge"
import EditCamera from "./EditCamera"

type StatusType = "Actif" | "En maintenance" | "En panne";

export type Camera = {
    id: number
    code: string,
    rtsp_url: string,
    description?: string,
    type: string,
    zone: { id: number; nom: string },
    status: StatusType
}

export const colonneCamera: ColumnDef<Camera>[] = [
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
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Camera" />
        ),
    },
    {
        accessorFn: (row) => row.zone?.nom,
        id: "zone",
        header: "Zone",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "rtsp_url",
        header: "Url d'accès",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
        id: "actions",
        cell: function ActionsCamera({ row }) {
            const dispatch = useDispatch<AppDispatch>()
            const camera = row.original
            const status = camera.status
            const [editCamera, setEditCamera] = React.useState<boolean>(false)

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
                                        setEditCamera(!editCamera)
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="text-green-600">Editer</span>
                                </DropdownMenuItem>
                                {status != 'Actif' && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            dispatch(updateCamera({
                                                id: camera.id,
                                                code: camera.code,
                                                rtsp_url: camera.rtsp_url,
                                                description: camera.description,
                                                type: camera.type,
                                                zone: camera.zone.id,
                                                status: 'Actif'
                                            }))
                                        }}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                                        <span className="text-blue-600">Actif</span>
                                    </DropdownMenuItem>
                                )}
                                {status != 'En maintenance' && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            dispatch(updateCamera({
                                                id: camera.id,
                                                code: camera.code,
                                                rtsp_url: camera.rtsp_url,
                                                description: camera.description,
                                                type: camera.type,
                                                zone: camera.zone.id,
                                                status: 'En maintenance'
                                            }))
                                        }}
                                    >
                                        <Wrench className="mr-2 h-4 w-4 text-yellow-600" />
                                        <span className="text-yellow-600">En maintenace</span>
                                    </DropdownMenuItem>
                                )}
                                {status != 'En panne' && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            dispatch(updateCamera({
                                                id: camera.id,
                                                code: camera.code,
                                                rtsp_url: camera.rtsp_url,
                                                description: camera.description,
                                                type: camera.type,
                                                zone: camera.zone.id,
                                                status: 'En panne'
                                            }))
                                        }}
                                    >
                                        <XCircle className="mr-2 h-4 w-4 text-backgound" />
                                        <span className="text-backgound">En panne</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => {
                                    dispatch(deleteCamera(camera.id))
                                }}>
                                    <Trash className="mr-2 h-4 w-4 text-red-600" />
                                    <span className="text-red-600">Supprimer</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <EditCamera camera={camera} open={editCamera} setOpen={setEditCamera} />
                </div>
            )
        },
    },
]
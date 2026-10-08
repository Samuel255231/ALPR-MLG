"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Check, CheckCircle, IterationCw, MoreHorizontal, X, XCircle } from "lucide-react"
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
import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/redux/store"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/fr"
import { Badge } from "@/components/ui/badge"
import { toggleUserActive } from "@/redux/slices/UserSlice"
import ReinitialiserMotPasse from "./ReinitialiserMotPasse"
import { libelleRole } from "@/lib/roles"
dayjs.extend(relativeTime)
dayjs.locale("fr")

export type User = {
    id: number
    username: string,
    email: string,
    telephone: string,
    first_name: string,
    last_name?: string,
    role: string,
    last_login: string,
    is_active: string
}

export const colonneUser: ColumnDef<User>[] = [
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
        accessorFn: (row) => row.last_name
            ? `${row.first_name} ${row.last_name}`
            : row.first_name || "",
        id: 'fullname',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nom complet" />
        ),
        cell: ({ row }) => (
            <span>{`${row.original.first_name} ${row.original.last_name}`}</span>
        ),
    },
    {
        accessorKey: "username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nom d'utilisateur" />
        ),
    },
    {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ getValue }) => libelleRole(getValue<string>()),
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "last_login",
        header: "Dernier connexion",
        cell: ({ getValue }) => {
            const value = getValue<string>()
            return value ? dayjs(value).fromNow() : "-"
        },
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ getValue }) => {
            const isActive = getValue();
            const label = isActive ? "Activé" : "Désactivé";
            const Icon = isActive ? CheckCircle : XCircle;
            const bgClass = isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800";

            return (
                <Badge variant="secondary" className={bgClass}>
                    <Icon className={`w-4 h-4`} />
                    {label}
                </Badge>
                // <div className="flex items-center gap-2">
                //     <Icon className={`w-4 h-4 ${color}`} />
                //     <span
                //         className={`px-2 py-1 rounded-full text-sm font-medium ${bgClass}`}
                //     >
                //         {label}
                //     </span>
                // </div>
            );
        },
    },
    {
        id: "actions",
        cell: function ActionsUtilisateur({ row }) {
            const dispatch = useDispatch<AppDispatch>()
            const user = row.original
            const isActive = user.is_active
            const [resetPassword,setResetPassword]=useState(false)
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
                                        dispatch(toggleUserActive(user.id))
                                    }}
                                >
                                    {isActive ? (
                                        <X className="h-4 w-4 text-red-600" />
                                    ) : (
                                        <Check className="h-4 w-4 text-green-600" />
                                    )}
                                    <span className={isActive ? "text-red-600" : "text-green-600"}>
                                        {isActive ? "Désactiver" : "Activer"}
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    setResetPassword(!resetPassword)
                                }}>
                                    <IterationCw className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="text-green-600">Reinitialiser mot de passe</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ReinitialiserMotPasse userId={user.id} open={resetPassword} setOpen={setResetPassword} />
                    </div>
                </div>
            )
        },
    },
]
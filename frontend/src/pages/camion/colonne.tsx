
//src\pages\camion\colonne.tsx
// src/pages/camion/colonne.tsx
import { type ColumnDef } from "@tanstack/react-table"
import ActionCell from "./ActionCell"
import type { Proprietaire } from "./types"
import { Checkbox } from "@/components/ui/checkbox" // Ajouter cet import

export const colonneCamion = (callbacks: {
  onDeleted: (id: number) => void
  onUpdated: (p: Proprietaire) => void
}): ColumnDef<Proprietaire>[] => [
  // NOUVELLE COLONNE : Sélection
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
  // Colonnes existantes...
  { accessorKey: "plaque", header: "Immatriculation" },
  { accessorKey: "marque", header: "Marque" },
  { accessorKey: "modele", header: "Modèle" },
  { accessorKey: "nom", header: "Propriétaire" },
  { accessorKey: "chauffeur", header: "Chauffeur" },
  { accessorKey: "statut", header: "Statut", cell: ({ row }) => row.original.statut ?? "actif" },
  {
    id: "actions",
    header: "Actes",
    cell: ({ row }) => (
      <ActionCell
        proprietaire={row.original}
        onDeleted={callbacks.onDeleted}
        onUpdated={callbacks.onUpdated}
      />
    ),
  },
]


/*
import { type ColumnDef } from "@tanstack/react-table"
import ActionCell from "./ActionCell"
import type { Proprietaire } from "./types"

export const colonneCamion = (callbacks: {
  onDeleted: (id: number) => void
  onUpdated: (p: Proprietaire) => void
}): ColumnDef<Proprietaire>[] => [
  { accessorKey: "plaque", header: "Immatriculation" },
  { accessorKey: "marque", header: "Marque" },
  { accessorKey: "modele", header: "Modèle" },
  { accessorKey: "nom", header: "Propriétaire" },
  { accessorKey: "chauffeur", header: "Chauffeur" },
  { accessorKey: "statut", header: "Statut", cell: ({ row }) => row.original.statut ?? "actif" },
  {
    id: "actions",
    header: "Actes",
    cell: ({ row }) => (
      <ActionCell
        proprietaire={row.original}
        onDeleted={callbacks.onDeleted}
        onUpdated={callbacks.onUpdated}
      />
    ),
  },
]
*/



/*
import { type ColumnDef } from "@tanstack/react-table"
import ActionCell from "./ActionCell"

export interface Proprietaire {
  id: number
  plaque: string
  marque: string
  modele: string
  nom: string
  chauffeur: string
  statut?: string
}

export const colonneCamion = (reload: () => void): ColumnDef<Proprietaire>[] => [
  {
    accessorKey: "plaque",
    header: "Immatriculation",
  },
  {
    accessorKey: "marque",
    header: "Marque",
  },
  {
    accessorKey: "modele",
    header: "Modèle",
  },
  {
    accessorKey: "nom",
    header: "Propriétaire",
  },
  {
    accessorKey: "chauffeur",
    header: "Chauffeur",
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ row }) => row.original.statut ?? "actif",
  },
  {
    id: "actions",
    header: "Actes",
    cell: ({ row }) => (
      <ActionCell
        proprietaire={row.original}
        onDeleted={reload}
        onUpdated={reload}
      />
    ),
  },
]


*/

/*

"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header"
import ActionCell from "./ActionCell"

export type Proprietaire = {
  id: number
  plaque: string
  marque: string
  modele: string
  statut: string
  nom: string
  chauffeur: string
}

export const colonneCamion = (onDeleted?: () => void): ColumnDef<Proprietaire>[] => [
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
  { accessorKey: "plaque", header: ({ column }) => <DataTableColumnHeader column={column} title="Immatriculation" /> },
  { accessorKey: "marque", header: "Marque" },
  { accessorKey: "modele", header: "Modèle" },
  { accessorKey: "nom", header: "Propriétaire" },
  { accessorKey: "chauffeur", header: "Chauffeur" },
  { accessorKey: "statut", header: "Statut" },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell proprietaire={row.original} onDeleted={onDeleted} />,
  },
]
*/
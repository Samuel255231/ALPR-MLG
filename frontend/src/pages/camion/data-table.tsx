


// src/pages/camion/data-table.tsx
"use client"
import * as React from "react"
import { Input } from "@/components/ui/input"
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { DataTableViewOptions } from "@/components/datatable/dataTable-view-options"
import { DataTablePagination } from "@/components/datatable/datatable-pagination"
import AjoutProprietaire from "./AjoutProprietaire"
import { Trash2 } from "lucide-react"
import axios from "axios"

// ✅ Interface pour les données qui ont un ID
interface WithId {
  id: number
}

// ✅ Props génériques avec contrainte
interface DataTableProps<TData extends WithId, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onAdded?: (created: TData) => void
  onDeleteMultiple?: (ids: number[]) => void
}

export function DataTable<TData extends WithId, TValue>({
  columns,
  data,
  onAdded,
  onDeleteMultiple,
}: DataTableProps<TData, TValue>) {
  const [addProprietaire, setAddProprietaire] = React.useState<boolean>(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleDeleteMultiple = async (ids: number[]) => {
    if (!confirm(`Supprimer ${ids.length} véhicule(s) sélectionné(s) ?`)) return
    
    try {
      // Utiliser la prop onDeleteMultiple si elle est fournie
      if (onDeleteMultiple) {
        onDeleteMultiple(ids)
      } else {
        // Sinon, utiliser notre propre logique
        await Promise.all(
          ids.map(id => 
            axios.delete(`http://localhost:8000/alpr/proprietaire/${id}/delete/`)
          )
        )
        
        alert(`Suppression réussie (${ids.length} véhicule(s)) ✅`)
        
        // Rafraîchir les données
        if (window.location) {
          window.location.reload()
        }
      }
    } catch {
      alert("Erreur lors de la suppression multiple ❌")
    }
  }

  
  const handleAddedWrapper = React.useCallback((created: unknown) => {
  if (onAdded) {
    // Vérifier que created a la structure attendue
    if (created && typeof created === 'object' && 'id' in created) {
      onAdded(created as TData)
    }
  }
}, [onAdded])




  return (
    <div className="flex flex-col gap-4 overflow-auto px-4 lg:px-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Input
          placeholder="Filtrer par immatriculation..."
          value={(table.getColumn("plaque")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("plaque")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          {/* Bouton de suppression multiple */}
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
              variant="outline"
              size="sm"
              onClick={() => {
                // ✅ Type-safe sans 'any'
                const selectedIds = table.getSelectedRowModel().rows.map(row => 
                  (row.original as TData).id
                )
                handleDeleteMultiple(selectedIds)
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden lg:inline">
                Supprimer ({table.getFilteredSelectedRowModel().rows.length})
              </span>
            </Button>
          )}
          
          <DataTableViewOptions table={table} />
          
          <Button
            className="cursor-pointer bg-green-500 hover:bg-green-600"
            variant="outline"
            size="sm"
            onClick={() => setAddProprietaire(true)}
          >
            <IconPlus />
            <span className="hidden lg:inline">Ajouter un véhicule</span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultats.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      <AjoutProprietaire
        open={addProprietaire}
        setOpen={setAddProprietaire}
        onAdded={handleAddedWrapper}
      />
    </div>
  )
}





/*
"use client"
import * as React from "react"
import { Input } from "@/components/ui/input"
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { DataTableViewOptions } from "@/components/datatable/dataTable-view-options"
import { DataTablePagination } from "@/components/datatable/datatable-pagination"
import AjoutProprietaire from "./AjoutProprietaire"
import { Trash2 } from "lucide-react"
import axios from "axios" // ⬅️ IMPORTANT : Ajouter cet import

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onAdded?: (created: any) => void // ⬅️ Modifier le type ici
  onDeleteMultiple?: (ids: number[]) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAdded,
  onDeleteMultiple,
}: DataTableProps<TData, TValue>) {
  const [addProprietaire, setAddProprietaire] = React.useState<boolean>(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleDeleteMultiple = async (ids: number[]) => {
    if (!confirm(`Supprimer ${ids.length} véhicule(s) sélectionné(s) ?`)) return
    
    try {
      // Utiliser la prop onDeleteMultiple si elle est fournie
      if (onDeleteMultiple) {
        onDeleteMultiple(ids)
      } else {
        // Sinon, utiliser notre propre logique
        await Promise.all(
          ids.map(id => 
            axios.delete(`http://localhost:8000/alpr/proprietaire/${id}/delete/`)
          )
        )
        
        alert(`Suppression réussie (${ids.length} véhicule(s)) ✅`)
        
        // Rafraîchir les données
        if (window.location) {
          window.location.reload()
        }
      }
    } catch {
      alert("Erreur lors de la suppression multiple ❌")
    }
  }

  return (
    <div className="flex flex-col gap-4 overflow-auto px-4 lg:px-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Input
          placeholder="Filtrer par immatriculation..."
          value={(table.getColumn("plaque")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("plaque")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          {/* Bouton de suppression multiple 
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
              variant="outline"
              size="sm"
              onClick={() => {
                const selectedIds = table.getSelectedRowModel().rows.map(row => {
                  const item = row.original as any
                  return item.id as number
                })
                handleDeleteMultiple(selectedIds)
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden lg:inline">
                Supprimer ({table.getFilteredSelectedRowModel().rows.length})
              </span>
            </Button>
          )}
          
          <DataTableViewOptions table={table} />
          
          <Button
            className="cursor-pointer bg-green-500 hover:bg-green-600"
            variant="outline"
            size="sm"
            onClick={() => setAddProprietaire(true)}
          >
            <IconPlus />
            <span className="hidden lg:inline">Ajouter un véhicule</span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultats.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      <AjoutProprietaire
        open={addProprietaire}
        setOpen={setAddProprietaire}
        onAdded={onAdded}
      />
    </div>
  )
}
*/





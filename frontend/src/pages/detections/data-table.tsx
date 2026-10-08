import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PrinterIcon } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import {
    type SortingState,
    type ColumnFiltersState,
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

import { DataTablePagination } from "@/components/datatable/datatable-pagination"
import type { Detection } from "@/redux/slices/DetectionSlice"
import { colonneDetection } from "./DetectionColumns"

export function DataTable({ data }: { data: Detection[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const [debut, setDebut] = React.useState<string>("")
    const [fin, setFin] = React.useState<string>("")

    const table = useReactTable({
        data,
        columns: colonneDetection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: { sorting, columnFilters },
    })

    const statutTexte = (d: Detection) => {
        if (d.reconnue) return "Reconnue"
        return d.alerte ? "Illisible" : "À vérifier"
    }

    // Exporte les lignes qui passent les filtres actuels
    const exporterPDF = () => {
        const lignes = table.getFilteredRowModel().rows.map((row) => row.original)

        const doc = new jsPDF()
        doc.text("Rapport des détections", 14, 10)

        autoTable(doc, {
            head: [["Date", "Plaque", "Caméra", "Statut"]],
            body: lignes.map((d) => [
                new Date(d.date_detection).toLocaleString("fr-FR"),
                d.numero,
                d.camera ?? "-",
                statutTexte(d),
            ]),
            startY: 20,
            styles: { fontSize: 9 },
        })

        doc.save("rapport_detections.pdf")
    }

    return (
        <div className="flex flex-col gap-4 overflow-auto px-4 lg:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        placeholder="Filtrer par plaque..."
                        value={(table.getColumn("numero")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("numero")?.setFilterValue(e.target.value)}
                        className="max-w-xs"
                    />
                    <Input
                        placeholder="Filtrer par caméra..."
                        value={(table.getColumn("camera")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("camera")?.setFilterValue(e.target.value)}
                        className="max-w-xs"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        type="date"
                        value={debut}
                        onChange={(e) => {
                            setDebut(e.target.value)
                            table.getColumn("date_detection")?.setFilterValue([e.target.value, fin])
                        }}
                    />
                    <Input
                        type="date"
                        value={fin}
                        onChange={(e) => {
                            setFin(e.target.value)
                            table.getColumn("date_detection")?.setFilterValue([debut, e.target.value])
                        }}
                    />
                    <Button
                        className="cursor-pointer bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                        onClick={exporterPDF}
                    >
                        <PrinterIcon className="mr-2 h-4 w-4" />
                        Exporter
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
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={colonneDetection.length} className="h-24 text-center">
                                    Aucune détection.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    )
}

"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PrinterIcon } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

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

import { DataTablePagination } from "@/components/datatable/datatable-pagination"
import { type Mouvement, colonneMouvement } from "./MouvementColumns"

export function DataTable({
    data,
}: {
    data: Mouvement[]
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [date1, setDate1] = React.useState<string>("")
    const [date2, setDate2] = React.useState<string>("")

    const table = useReactTable({
        data,
        columns: colonneMouvement,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const handleExportPDF = () => {
        const filteredData = table
            .getFilteredRowModel()
            .rows.map((row) => row.original)
            .filter((item) => {
                const ts = new Date(item.timestamp)
                if (date1 && ts < new Date(date1)) return false
                if (date2 && ts > new Date(date2)) return false
                return true
            })

        const doc = new jsPDF()
        doc.text("Rapport des Mouvements", 14, 10)

        const tableColumn = ["Date", "Caméra", "Type", "Quantité"]
        const tableRows = filteredData.map((m) => [
            new Date(m.timestamp).toLocaleString("fr-FR"),
            m.camera?.code ?? "",
            m.camera?.type === "entree"
                ? "Entrée"
                : m.camera?.type === "sortie"
                    ? "Sortie"
                    : "Inconnu",
            m.quantite,
        ])

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 9 },
        })

        doc.save("rapport_mouvements.pdf")
    }

    return (
        <div className="flex flex-col gap-4 overflow-auto px-4 lg:px-6">
            {/* Filtres */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 lg:px-6">
                <Input
                    placeholder="Filtrer par caméra..."
                    value={(table.getColumn("camera")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("camera")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <div className="flex items-center gap-2">
                    <Input
                        type="date"
                        value={date1}
                        onChange={(e) => {
                            setDate1(e.target.value)
                            table.getColumn("timestamp")?.setFilterValue([e.target.value, date2])

                        }}
                    />
                    <Input
                        type="date"
                        value={date2}
                        onChange={(e) => {
                            setDate2(e.target.value)
                            table.getColumn("timestamp")?.setFilterValue([date1, e.target.value])
                        }}
                    />
                    <Button
                        className="cursor-pointer bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                        onClick={handleExportPDF}
                    >
                        <PrinterIcon className="mr-2 h-4 w-4" />
                        Exporter
                    </Button>
                </div>
            </div>

            {/* Tableau */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table
                                .getRowModel()
                                .rows.map((row) => (
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
                                <TableCell colSpan={colonneMouvement.length} className="h-24 text-center">
                                    Aucun résultat.
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

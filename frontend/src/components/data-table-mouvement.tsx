import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod"

// ---------------- SCHEMA ----------------
export const schema = z.object({
  id: z.number(),
  type: z.string(),
  quantite: z.number(),
  timestamp: z.string(),
})
export type Mouvement = z.infer<typeof schema>

// ---------------- DRAG HANDLE ----------------
const DragHandle: React.FC<{ id: number }> = ({ id }) => {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon">
      ≡
    </Button>
  )
}

// ---------------- DRAGGABLE ROW ----------------
interface DraggableRowProps {
  row: Mouvement
  renderCells: () => React.ReactNode[]
}
const DraggableRow: React.FC<DraggableRowProps> = ({ row, renderCells }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.id })
  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-70" : ""}
    >
      {renderCells()}
    </tr>
  )
}

// ---------------- TABLE COMPONENT ----------------
interface DataTableProps {
  data: Mouvement[]
}
export const DataTable: React.FC<DataTableProps> = ({ data: initialData }) => {
  const [data, setData] = React.useState<Mouvement[]>(initialData)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data.map(d => d.id), [data])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setData(prev => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} sensors={sensors} onDragEnd={handleDragEnd}>
      <table className="border-collapse border w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Drag</th>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Quantité</th>
            <th className="border px-2 py-1">Timestamp</th>
          </tr>
        </thead>
        <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
          <tbody>
            {data.map(row => (
              <DraggableRow
                key={row.id}
                row={row}
                renderCells={() => [
                  <td key="drag" className="border px-2 py-1"><DragHandle id={row.id} /></td>,
                  <td key="id" className="border px-2 py-1">{row.id}</td>,
                  <td key="type" className="border px-2 py-1">
                    <Input defaultValue={row.type} onChange={e => {
                      const value = e.target.value
                      setData(prev => prev.map(r => r.id === row.id ? { ...r, type: value } : r))
                    }} />
                  </td>,
                  <td key="quantite" className="border px-2 py-1">
                    <Input type="number" defaultValue={row.quantite} onChange={e => {
                      const value = Number(e.target.value)
                      setData(prev => prev.map(r => r.id === row.id ? { ...r, quantite: value } : r))
                    }} />
                  </td>,
                  <td key="timestamp" className="border px-2 py-1">{row.timestamp}</td>,
                ]}
              />
            ))}
          </tbody>
        </SortableContext>
      </table>
    </DndContext>
  )
}

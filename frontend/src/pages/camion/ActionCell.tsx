
//src\pages\camion\ActionCell.tsx
import React, { useState } from "react"
import { MoreHorizontal, Trash, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import ModifierProprietaire from "./ModifierProprietaire"
import type { Proprietaire } from "./types"

interface Props {
  proprietaire: Proprietaire
  onDeleted?: (id: number) => void
  onUpdated?: (updated: Proprietaire) => void
}

const ActionCell: React.FC<Props> = ({ proprietaire, onDeleted, onUpdated }) => {
  const [openEdit, setOpenEdit] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Supprimer le propriétaire ${proprietaire.nom} ?`)) return
    try {
      await axios.delete(`http://localhost:8000/alpr/proprietaire/${proprietaire.id}/delete/`)
      alert("Propriétaire supprimé avec succès ✅")
      onDeleted?.(proprietaire.id)
    } catch {
      alert("Erreur lors de la suppression ❌")
    }
  }

  return (
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

          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="mr-2 h-4 w-4 text-blue-600" />
            <span className="text-blue-600">Modifier</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4 text-red-600" />
            <span className="text-red-600">Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModifierProprietaire
        open={openEdit}
        setOpen={setOpenEdit}
        proprietaire={proprietaire}
        onUpdated={onUpdated}
      />
    </div>
  )
}

export default ActionCell





/*

import React, { useState } from "react"
import { MoreHorizontal, Trash, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import ModifierProprietaire from "./ModifierProprietaire"

interface Props {
  proprietaire: {
    id: number
    plaque: string
    nom: string
    marque: string
    modele: string
    chauffeur: string
    statut?: string
  }
  onDeleted?: () => void
  onUpdated?: () => void
}

const ActionCell: React.FC<Props> = ({ proprietaire, onDeleted, onUpdated }) => {
  const [openEdit, setOpenEdit] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Supprimer le propriétaire ${proprietaire.nom} ?`)) return
    try {
      await axios.delete(`http://localhost:8000/alpr/proprietaire/${proprietaire.id}/delete/`)
      alert("Propriétaire supprimé avec succès ✅")
      onDeleted?.()
    } catch {
      alert("Erreur lors de la suppression ❌")
    }
  }

  return (
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

          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="mr-2 h-4 w-4 text-blue-600" />
            <span className="text-blue-600">Modifier</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4 text-red-600" />
            <span className="text-red-600">Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModifierProprietaire
        open={openEdit}
        setOpen={setOpenEdit}
        proprietaire={proprietaire}
        onUpdated={onUpdated}
      />
    </div>
  )
}

export default ActionCell


*/





/*
import React, { useState } from "react"
import { MoreHorizontal, Trash, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import ModifierProprietaire from "./ModifierProprietaire"

interface Props {
  proprietaire: {
    id: number
    plaque: string
    nom: string
    marque: string
    modele: string
    chauffeur: string
    statut?: string
  }
  onDeleted?: () => void
  onUpdated?: () => void
}


const ActionCell: React.FC<Props> = ({ proprietaire, onDeleted, onUpdated }) => {
  const [openEdit, setOpenEdit] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Supprimer le propriétaire ${proprietaire.nom} ?`)) return
    try {
      await axios.delete(`http://localhost:8000/alpr/proprietaire/${proprietaire.id}/delete/`)
      alert("Propriétaire supprimé avec succès ✅")
      if (onDeleted) onDeleted()
    } catch {
      alert("Erreur lors de la suppression ❌")
    }
  }

  return (
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

          {/* Bouton Modifier 
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="mr-2 h-4 w-4 text-blue-600" />
            <span className="text-blue-600">Modifier</span>
          </DropdownMenuItem>

          {/* Bouton Supprimer 
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4 text-red-600" />
            <span className="text-red-600">Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal ModifierProprietaire 
      <ModifierProprietaire
        open={openEdit}
        setOpen={setOpenEdit}
        proprietaire={proprietaire}
        onUpdated={onUpdated}
      />
    </div>
  )
}

export default ActionCell

*/
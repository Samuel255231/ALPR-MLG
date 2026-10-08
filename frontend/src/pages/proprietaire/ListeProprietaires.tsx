import React, { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface ProprietaireData {
  id: number
  plaque: string
  marque: string
  modele: string
  statut: string
  nom: string
  chauffeur?: string | null
}

const ListeProprietaires: React.FC = () => {
  const [proprietaires, setProprietaires] = useState<ProprietaireData[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // État pour le modal
  const [showModal, setShowModal] = useState(false)
  const [current, setCurrent] = useState<ProprietaireData | null>(null)
  const [nom, setNom] = useState("")
  const [marque, setMarque] = useState("")
  const [modele, setModele] = useState("")
  const [chauffeur, setChauffeur] = useState("")
  const [statut, setStatut] = useState("")

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8000/alpr/proprietaires/?page=${page}&search=${search}`)
      setProprietaires(res.data.results)
      setTotalPages(res.data.total_pages)
    } catch {
      alert("Erreur lors du chargement des propriétaires")
    }
  }, [page, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce propriétaire ?")) return
    try {
      await axios.delete(`http://localhost:8000/alpr/proprietaire/${id}/delete/`)
      fetchData()
    } catch {
      alert("Erreur lors de la suppression")
    }
  }

  const openModal = (p: ProprietaireData) => {
    setCurrent(p)
    setNom(p.nom)
    setMarque(p.marque)
    setModele(p.modele)
    setChauffeur(p.chauffeur || "")
    setStatut(p.statut)
    setShowModal(true)
  }

  const handleUpdate = async () => {
    if (!current) return
    try {
      const res = await axios.put(`http://localhost:8000/alpr/proprietaire/${current.id}/update/`, {
        nom,
        marque,
        modele,
        chauffeur,
        statut
      })
      alert(res.data.message)
      setShowModal(false)
      fetchData()
    } catch {
      alert("Erreur lors de la mise à jour")
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Liste des propriétaires</h2>

      <Card className="p-4 space-y-4">
        {/* Recherche */}
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Rechercher par plaque ou nom"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => fetchData()}>Rechercher</Button>
        </div>

        {/* Tableau */}
        <table className="w-full border-collapse border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Plaque</th>
              <th className="border p-2">Marque</th>
              <th className="border p-2">Modèle</th>
              <th className="border p-2">Propriétaire</th>
              <th className="border p-2">Chauffeur</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {proprietaires.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  Aucun propriétaire trouvé
                </td>
              </tr>
            ) : (
              proprietaires.map((p) => (
                <tr key={p.id}>
                  <td className="border p-2">{p.plaque}</td>
                  <td className="border p-2">{p.marque}</td>
                  <td className="border p-2">{p.modele}</td>
                  <td className="border p-2">{p.nom}</td>
                  <td className="border p-2">{p.chauffeur || "—"}</td>
                  <td className="border p-2">{p.statut}</td>
                  <td className="border p-2 flex gap-2">
                    <Button
                      className="bg-yellow-500 text-white px-2 py-1"
                      onClick={() => openModal(p)}
                    >
                      Modifier
                    </Button>
                    <Button
                      className="bg-red-600 text-white px-2 py-1"
                      onClick={() => handleDelete(p.id)}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</Button>
          <span>Page {page} / {totalPages}</span>
          <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Suivant</Button>
        </div>
      </Card>

      {/* Modal de modification */}
      {showModal && current && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="p-6 w-96 space-y-4 bg-white">
            <h3 className="text-xl font-bold">Modifier propriétaire</h3>
            <Input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            <Input placeholder="Marque" value={marque} onChange={(e) => setMarque(e.target.value)} />
            <Input placeholder="Modèle" value={modele} onChange={(e) => setModele(e.target.value)} />
            <Input placeholder="Chauffeur" value={chauffeur} onChange={(e) => setChauffeur(e.target.value)} />
            <Input placeholder="Statut" value={statut} onChange={(e) => setStatut(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <Button className="bg-gray-400 text-white" onClick={() => setShowModal(false)}>Annuler</Button>
              <Button className="bg-green-600 text-white" onClick={handleUpdate}>Enregistrer</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ListeProprietaires

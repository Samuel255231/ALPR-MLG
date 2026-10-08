/*
import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from "axios"

// 🔹 Interface pour typer les données du propriétaire
interface ProprietaireData {
  plaque: string
  marque: string
  modele: string
  statut: string
  nom: string
  chauffeur?: string | null
}

const FicheProprietaire: React.FC = () => {
  const [plaque, setPlaque] = useState<string>("")
  const [data, setData] = useState<ProprietaireData | null>(null)
  const [error, setError] = useState<string>("")

  const handleSearch = async () => {
    setError("")
    setData(null)
    try {
      const res = await axios.get<ProprietaireData>(
        `http://localhost:8000/alpr/proprietaire/?plaque=${plaque}`
      )
      setData(res.data)
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error: string }>
      setError(axiosError.response?.data?.error || "Erreur inconnue")
    }
  }

  const handleAddProprietaire = () => {
    // 👉 Ici tu pourras ouvrir un formulaire ou rediriger vers une page "Ajouter"
    alert(`Ajouter un propriétaire pour la plaque : ${plaque}`)
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Fiche propriétaire</h2>
        <p className="text-gray-600">
          Rechercher un véhicule par plaque et afficher ses informations
        </p>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Ex: ABC123MG"
            value={plaque}
            onChange={(e) => setPlaque(e.target.value)}
          />
          <Button onClick={handleSearch}>Rechercher</Button>
        </div>

        {error && (
          <div className="space-y-2 mt-4">
            <p className="text-red-500">{error}</p>
            {/* Bouton affiché uniquement si plaque inconnue 
            <Button
              onClick={handleAddProprietaire}
              className="bg-green-600 text-white"
            >
              Ajouter un propriétaire
            </Button>
          </div>
        )}

        {data && (
          <div className="space-y-2 mt-4">
            <p><strong>Plaque :</strong> {data.plaque}</p>
            <p><strong>Marque :</strong> {data.marque}</p>
            <p><strong>Modèle :</strong> {data.modele}</p>
            <p><strong>Statut :</strong> {data.statut}</p>
            <p><strong>Propriétaire :</strong> {data.nom}</p>
            <p><strong>Chauffeur :</strong> {data.chauffeur || "—"}</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default FicheProprietaire
*/


import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from "axios"

interface ProprietaireData {
  plaque: string
  marque: string
  modele: string
  statut: string
  nom: string
  chauffeur?: string | null
}

const FicheProprietaire: React.FC = () => {
  const [plaque, setPlaque] = useState<string>("")
  const [data, setData] = useState<ProprietaireData | null>(null)
  const [error, setError] = useState<string>("")

  // Champs pour ajout manuel
  const [nom, setNom] = useState("")
  const [marque, setMarque] = useState("")
  const [modele, setModele] = useState("")
  const [chauffeur, setChauffeur] = useState("")

  const handleSearch = async () => {
    setError("")
    setData(null)
    try {
      const res = await axios.get<ProprietaireData>(
        `http://localhost:8000/alpr/proprietaire/?plaque=${plaque}`
      )
      setData(res.data)
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error: string }>
      setError(axiosError.response?.data?.error || "Erreur inconnue")
    }
  }

  const handleAddProprietaire = async () => {
    try {
      const res = await axios.post("http://localhost:8000/alpr/proprietaire/add/", {
        plaque,
        nom,
        marque,
        modele,
        chauffeur
      })
      alert(res.data.message)
      setData(res.data) // affiche directement la fiche ajoutée
      setError("")
    } catch  {
      alert("Erreur lors de l'ajout du propriétaire")
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Fiche propriétaire</h2>
        <p className="text-gray-600">
          Rechercher un véhicule par plaque et afficher ses informations
        </p>
      </div>

      <Card className="p-4 space-y-4">
        {/* Recherche par plaque */}
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Ex: ABC123MG"
            value={plaque}
            onChange={(e) => setPlaque(e.target.value)}
          />
          <Button onClick={handleSearch}>Rechercher</Button>
        </div>

        {/* Si plaque inconnue */}
        {error && (
          <div className="space-y-2 mt-4">
            <p className="text-red-500">{error}</p>

            <div className="space-y-2 mt-4 border p-3 rounded bg-gray-50">
              <h3 className="font-bold text-gray-800">Ajouter un propriétaire</h3>
              <Input placeholder="Nom propriétaire" value={nom} onChange={(e) => setNom(e.target.value)} />
              <Input placeholder="Marque véhicule" value={marque} onChange={(e) => setMarque(e.target.value)} />
              <Input placeholder="Modèle véhicule" value={modele} onChange={(e) => setModele(e.target.value)} />
              <Input placeholder="Chauffeur" value={chauffeur} onChange={(e) => setChauffeur(e.target.value)} />
              <Button onClick={handleAddProprietaire} className="bg-green-600 text-white">
                Ajouter ce propriétaire
              </Button>
            </div>
          </div>
        )}

        {/* Si plaque connue */}
        {data && (
          <div className="space-y-2 mt-4">
            <p><strong>Plaque :</strong> {data.plaque}</p>
            <p><strong>Marque :</strong> {data.marque}</p>
            <p><strong>Modèle :</strong> {data.modele}</p>
            <p><strong>Statut :</strong> {data.statut}</p>
            <p><strong>Propriétaire :</strong> {data.nom}</p>
            <p><strong>Chauffeur :</strong> {data.chauffeur || "—"}</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default FicheProprietaire

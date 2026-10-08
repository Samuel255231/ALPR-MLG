//src\pages\camion\Camion.tsx


import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { colonneCamion } from './colonne'
import { Card } from '@/components/ui/card'
import axios from 'axios'
import type { Proprietaire } from './types'

const Camion: React.FC = () => {
  const [data, setData] = useState<Proprietaire[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProprietaires = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:8000/alpr/proprietaires/')
      setData(res.data.results ?? res.data)
    } catch {
      alert("Erreur lors du chargement des véhicules ALPR ❌")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProprietaires()
  }, [])

  
   const handleDeleteMultiple = async (ids: number[]) => {
    if (!confirm(`Voulez-vous vraiment supprimer ${ids.length} véhicule(s) ?`)) {
        return
       }
  
    try {
    // Option 1 : Suppression en boucle (plus simple)
        for (const id of ids) {
           await axios.delete(`http://localhost:8000/alpr/proprietaire/${id}/delete/`)
        }
    
    // Option 2 : Suppression batch (si votre API le supporte)
    // await axios.post('http://localhost:8000/alpr/proprietaires/bulk-delete/', { ids })
    
    alert(`${ids.length} véhicule(s) supprimé(s) avec succès ✅`)
    
    // Mise à jour optimiste : supprimer de l'état local
    setData(prev => prev.filter(p => !ids.includes(p.id)))
    
    // Réinitialiser la sélection
    // (Nous devrons passer cette fonction à DataTable)
    
  } catch (error) {
    alert("Erreur lors de la suppression multiple ❌")
    console.error(error)
  }
}



  // ✅ Ajout optimiste
  const handleAdded = (created: Proprietaire) => {
    setData(prev => [created, ...prev])
  }

  // ✅ Mise à jour optimiste
  const handleUpdated = (updated: Proprietaire) => {
    setData(prev => prev.map(p => (p.id === updated.id ? updated : p)))
  }

  // ✅ Suppression optimiste
  const handleDeleted = (id: number) => {
    setData(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className='p-4 space-y-6'>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des véhicules ALPR</h2>
        <p className="text-gray-600">Suivi des véhicules reconnus par le système ALPR</p>
      </div>

      <Card>
        {loading ? (
          <p className="p-4 text-gray-500">Chargement en cours...</p>
        ) : (
          <DataTable<Proprietaire, unknown>
            columns={colonneCamion({
              onDeleted: handleDeleted,
              onUpdated: handleUpdated,
            })}
            data={data}
            onAdded={handleAdded}
            onDeleteMultiple={handleDeleteMultiple}
          />
        )}
      </Card>
    </div>
  )
}

export default Camion








/*

import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { colonneCamion } from './colonne'
import { Card } from '@/components/ui/card'
import axios from 'axios'

const Camion: React.FC = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔁 Fonction pour charger les propriétaires depuis l'API
  const fetchProprietaires = async () => {
    try {
      const res = await axios.get('http://localhost:8000/alpr/proprietaires/')
      setData(res.data.results)
    } catch {
      alert("Erreur lors du chargement des véhicules ALPR ❌")
    } finally {
      setLoading(false)
    }
  }

  // Charger au montage
  useEffect(() => {
    fetchProprietaires()
  }, [])

  return (
    <div className='p-4 space-y-6'>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des véhicules ALPR</h2>
          <p className="text-gray-600">Suivi des véhicules reconnus par le système ALPR</p>
        </div>
        {/* Bouton Ajouter un véhicule 
        
      </div>

      <Card>
        {loading ? (
          <p className="p-4 text-gray-500">Chargement en cours...</p>
        ) : (
          <DataTable
            columns={colonneCamion(fetchProprietaires)} // 🔁 callback pour suppression
            data={data}
            onAdded={fetchProprietaires}
          />
        )}
      </Card>
      
    </div>
  )
}

export default Camion

*/





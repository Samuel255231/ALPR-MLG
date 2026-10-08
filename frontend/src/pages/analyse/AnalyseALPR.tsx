import React, { useEffect, useState } from "react"
import { API_URL } from "@/config"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchCameras } from "@/redux/slices/CameraSlice"
import { detectALPRVideo, resetALPR, type StatutPlaque } from "@/redux/slices/ALPRSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Eye, Upload, Video, Image as ImageIcon } from "lucide-react"

const AnalyseALPR: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  
  // État Redux
  const { cameras } = useSelector((state: RootState) => state.cameras)
  const { data, loading, error } = useSelector((state: RootState) => state.alpr)
  
  // État local
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [cameraId, setCameraId] = useState<string>("")

  // Charger les caméras
  useEffect(() => {
    dispatch(fetchCameras())
  }, [dispatch])

  // Réinitialiser lors du changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    dispatch(resetALPR())

    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !cameraId) return

    dispatch(detectALPRVideo({ 
      file, 
      camera_id: parseInt(cameraId) 
    }))
  }

  const getStatusColor = (statut: StatutPlaque) => {
    if (statut === "reconnue") return "text-green-600"
    if (statut === "a_verifier") return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusIcon = (statut: StatutPlaque) => {
    if (statut === "reconnue") return <CheckCircle className="w-4 h-4 text-green-500" />
    if (statut === "a_verifier") return <Eye className="w-4 h-4 text-yellow-500" />
    return <AlertCircle className="w-4 h-4 text-red-500" />
  }

  const libelleStatut: Record<StatutPlaque, string> = {
    reconnue: "Reconnue",
    a_verifier: "À vérifier",
    illisible: "Illisible",
  }

  return (
    <div className="p-4 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analyse ALPR</h1>
        <p className="text-gray-600">
          Upload d'images ou vidéos pour la reconnaissance automatique de plaques malgaches
        </p>
      </div>

      {/* TOUT DANS UNE SEULE COLONNE */}
      <div className="space-y-6">
        {/* Section Upload et paramètres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Configuration de l'analyse
            </CardTitle>
            <CardDescription>
              Configurez la source et lancez l'analyse ALPR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colonne gauche - Configuration */}
              <div className="space-y-4">
                {/* Sélection caméra */}
                <div className="space-y-2">
                  <Label htmlFor="camera">Caméra source</Label>
                  <select
                    id="camera"
                    value={cameraId}
                    onChange={(e) => setCameraId(e.target.value)}
                    className="w-full border rounded-md p-2 bg-white"
                    aria-label="Sélectionner une caméra"
                    title="Sélectionnez la caméra source"
                  >
                    <option value="">Sélectionner une caméra</option>
                    {cameras.map((cam) => (
                      <option key={cam.id} value={cam.id.toString()}>
                        {cam.code} - {cam.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload fichier */}
                <div className="space-y-2">
                  <Label htmlFor="file">Fichier image ou vidéo</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500">
                    Supports : JPG, PNG, MP4, AVI, MOV
                  </p>
                </div>

                <div className="space-y-1 pt-4 border-t text-sm text-gray-500">
                  <p>Vidéo : 60 secondes maximum. Le traitement peut durer une à deux minutes.</p>
                  <p>Une plaque est « reconnue » quand son texte respecte le format malgache (ex. 1844 TAH).</p>
                </div>
              </div>

              {/* Colonne droite - Aperçu */}
              <div className="space-y-4">
                <Label>Aperçu du fichier</Label>
                {preview ? (
                  <div className="rounded-lg overflow-hidden border h-48 flex items-center justify-center bg-gray-50">
                    {file?.type.startsWith("video") ? (
                      <video src={preview} controls className="w-full h-full object-contain" />
                    ) : (
                      <img src={preview} alt="Aperçu" className="w-full h-full object-contain" />
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Aperçu du fichier</p>
                    </div>
                  </div>
                )}
                
                {file && (
                  <div className="text-sm text-gray-600">
                    <p><strong>Nom :</strong> {file.name}</p>
                    <p><strong>Taille :</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><strong>Type :</strong> {file.type.split('/')[1]?.toUpperCase()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bouton analyse */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={!file || !cameraId || loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Analyse en cours...
                  </>
                ) : (
                  "Lancer l'analyse"
                )}
              </Button>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Erreur : {error}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section Résultats - S'affiche seulement après analyse */}
        {data && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-gray-50">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Résultats de l'analyse
                {data.camera_name && (
                  <span className="ml-auto text-sm font-normal text-gray-600">
                    Caméra : {data.camera_name}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {data.results.length} plaque(s) détectée(s)
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Statistiques rapides */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-2xl font-bold text-blue-700">{data.results.length}</p>
                  <p className="text-sm text-gray-600">Plaques détectées</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-2xl font-bold text-green-700">
                    {data.results.filter(r => r.statut === "reconnue").length}
                  </p>
                  <p className="text-sm text-gray-600">Reconnues</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-2xl font-bold text-yellow-700">
                    {data.results.filter(r => r.statut !== "reconnue").length}
                  </p>
                  <p className="text-sm text-gray-600">À vérifier</p>
                </div>
              </div>

              {/* Liste détaillée des plaques */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Détails des plaques détectées</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left font-semibold">Plaque</th>
                        <th className="p-3 text-left font-semibold">Confiance de lecture</th>
                        <th className="p-3 text-left font-semibold">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.results.map((result, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="p-3 font-medium">{result.numero}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-full rounded-full ${
                                    result.statut === "reconnue" ? "bg-green-500" :
                                    result.statut === "a_verifier" ? "bg-yellow-500" : "bg-red-500"
                                  }`}
                                  style={{ width: `${result.confiance_lecture * 100}%` }}
                                />
                              </div>
                              <span className="font-medium">{(result.confiance_lecture * 100).toFixed(0)}%</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(result.statut)}
                              <span className={getStatusColor(result.statut)}>
                                {libelleStatut[result.statut]}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Résultat annoté */}
              {(data.image_url || data.video_url) && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {data.image_url ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    Résultat annoté
                  </h3>
                  
                  {data.image_url && (
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={`${API_URL}${data.image_url}`}
                        alt="Résultat ALPR annoté"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                  )}
                  
                  {data.video_url && (
                    <div className="border rounded-lg overflow-hidden">
                      <video
                        src={`${API_URL}${data.video_url}`}
                        controls
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AnalyseALPR
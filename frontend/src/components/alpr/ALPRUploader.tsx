"use client"
import { useState } from "react"
import { API_URL } from "@/config"
import api from "@/api/client"

type PlateResult = {
  numero: string
  confidence: number
}

export default function ALPRUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [results, setResults] = useState<PlateResult[]>([])
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null)
  const [annotatedVideo, setAnnotatedVideo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await api.post("/alpr/detect/", formData)
      const data = res.data
      setResults(data.results)

      if (data.image_url) {
        setAnnotatedImage(API_URL + data.image_url)
        setAnnotatedVideo(null)
      }

      if (data.video_url) {
        setAnnotatedVideo(API_URL + data.video_url)
        setAnnotatedImage(null)
      }

    } catch (error) {
      console.error("Erreur détection:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    setResults([])
    setAnnotatedImage(null)
    setAnnotatedVideo(null)


    if (selected) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selected)

    } else {
      setPreview(null)
    }
  }


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Détection ALPR</h2>

      <label htmlFor="file" className="block font-medium">Sélectionner une image ou vidéo</label>
      <input
        id="file"
        type="file"
        accept="image/*,video/*"
        title="Fichier à analyser"
        onChange={handleFileChange}
      />
       
        {preview && file?.type.startsWith("video") && (
        <div className="mt-4">
          <video src={preview} controls className="max-w-md rounded shadow" />
        </div>
      )}

      {preview && file?.type.startsWith("image") && (
        <div className="mt-4">
          <img src={preview} alt="Aperçu" className="max-w-md rounded shadow" />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Analyse en cours..." : "Envoyer"}
      </button>

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Plaques détectées :</h3>
          <ul className="list-disc pl-6">
            {results.map((p, i) => (
              <li key={i}>
                {p.numero} — confiance : {(p.confidence * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {annotatedImage && (
        <div className="mt-6">
          <h3 className="font-semibold">Image annotée :</h3>
          <img src={annotatedImage} alt="Résultat ALPR" className="max-w-md rounded shadow" />
        </div>
      )}

      {annotatedVideo && (
        <div className="mt-6">
          <h3 className="font-semibold">Vidéo annotée :</h3>
          <video src={annotatedVideo} controls className="max-w-md rounded shadow" />
        </div>
      )}
    </div>
  )
}



/*
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Aperçu" className="max-w-md rounded shadow" />
        </div>
      )}
       
      {preview && file?.type.startsWith("video") && (
          <video src={preview} controls className="max-w-md rounded shadow" />
       )}

      {preview && file?.type.startsWith("image") && (
          <img src={preview} alt="Aperçu" className="max-w-md rounded shadow" />
     )}




      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Analyse en cours..." : "Envoyer"}
      </button>

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Plaques détectées :</h3>
          <ul className="list-disc pl-6">
            {results.map((p, i) => (
              <li key={i}>
                {p.numero} — confiance : {(p.confidence * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {annotatedImage && (
        <div className="mt-6">
          <h3 className="font-semibold">Image annotée :</h3>
          <img src={annotatedImage} alt="Résultat ALPR" className="max-w-md rounded shadow" />
        </div>
      )}
    </div>
  )
}

*/
import axios from "axios"
import { API_URL } from "@/config"

const TOKEN_KEY = "userTokenAlpr"

// Un seul client pour tous les appels vers le backend
const api = axios.create({ baseURL: API_URL })

// Ajoute le token de connexion à chaque requête
api.interceptors.request.use((config) => {
    try {
        const stocke = localStorage.getItem(TOKEN_KEY)
        const access = stocke ? JSON.parse(stocke).access : null
        if (access) {
            config.headers.Authorization = `Bearer ${access}`
        }
    } catch {
        // token illisible : on envoie la requête sans
    }
    return config
})

// Token expiré ou refusé : on déconnecte et on revient à la page de connexion
api.interceptors.response.use(
    (reponse) => reponse,
    (erreur) => {
        // (une erreur 401 sur la connexion elle-même veut seulement dire « mauvais identifiants »)
        const estConnexion = erreur.config?.url?.includes("/users/login/")
        if (erreur.response?.status === 401 && !estConnexion && localStorage.getItem(TOKEN_KEY)) {
            localStorage.removeItem(TOKEN_KEY)
            window.location.href = "/login"
        }
        return Promise.reject(erreur)
    }
)

// Texte d'erreur à afficher à partir d'une erreur d'appel API
export function messageErreur(erreur: unknown): string {
    if (axios.isAxiosError(erreur)) {
        const data = erreur.response?.data
        if (typeof data === "string" && data) return data
        if (data && typeof data === "object") {
            // le backend renvoie soit {"detail": "..."} soit {"champ": ["message"]}
            const detail = (data as { detail?: unknown; error?: unknown }).detail ?? (data as { error?: unknown }).error
            return typeof detail === "string" ? detail : JSON.stringify(data)
        }
        return erreur.message
    }
    return erreur instanceof Error ? erreur.message : "Erreur inconnue"
}

export default api

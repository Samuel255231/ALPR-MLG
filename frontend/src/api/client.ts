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
        if (erreur.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
            localStorage.removeItem(TOKEN_KEY)
            window.location.href = "/login"
        }
        return Promise.reject(erreur)
    }
)

export default api

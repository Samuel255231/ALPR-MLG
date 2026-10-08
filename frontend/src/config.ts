// Adresse du backend Django. On peut la changer dans frontend/.env (voir .env.example)
export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

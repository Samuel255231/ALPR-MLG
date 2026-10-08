import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

// Rôle de l'utilisateur connecté
export function useRole() {
    const role = useSelector((state: RootState) => state.auth.userToken?.user?.role)
    return { role, estAdmin: role === "admin" }
}

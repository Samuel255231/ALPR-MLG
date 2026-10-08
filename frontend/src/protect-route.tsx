import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation, matchPath } from "react-router-dom"
import type { RootState } from "@/redux/store"
import type { Role } from "@/redux/slices/AuthSlice"

// Rôles autorisés pour chaque page. Une page absente de cette liste est refusée.
const routeRoleMap: Record<string, Role[]> = {
  "/": ["admin", "operateur"],
  "/detections": ["admin", "operateur"],
  "/analyse": ["admin", "operateur"],
  "/zone": ["admin", "operateur"],
  "/camera": ["admin", "operateur"],
  "/compte": ["admin", "operateur"],
  "/motdepasse": ["admin", "operateur"],
  "/users": ["admin"],
}

const ProtectedRoute = () => {
  const { userToken } = useSelector((state: RootState) => state.auth)
  const userRole = userToken?.user?.role
  const location = useLocation()

  // Pas connecté : retour à la page de connexion
  if (!userToken) {
    return <Navigate to="/login" replace />
  }

  // On cherche la règle qui correspond exactement à cette page
  const regle = Object.entries(routeRoleMap).find(([chemin]) =>
    matchPath({ path: chemin, end: true }, location.pathname)
  )
  const rolesAutorises = regle?.[1]

  if (!rolesAutorises || !userRole || !rolesAutorises.includes(userRole)) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

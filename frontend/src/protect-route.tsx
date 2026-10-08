import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation, matchPath } from "react-router-dom"
import type { RootState } from "@/redux/store"

// 🔐 Table de rôles par route
const routeRoleMap: Record<string, string[]> = {
  "/": ["admin","quai","securite"],
  "/zone": ["admin"],
  "/camera": ["admin"],
  "/users": ["admin"],
  "/mouvement":["admin","quai"],
  "/camion":["admin","quai","securite"],
  "/entrainement":["admin","quai"],
  "/surveillance":["admin","quai"],
}

const ProtectedRoute = () => {
  const { userToken } = useSelector((state: RootState) => state.auth)
  const userRole = userToken?.user?.role
  const location = useLocation()
  const path = location.pathname

  // Debug log to inspect auth state and path
  // eslint-disable-next-line no-console
  console.log('ProtectedRoute userToken:', userToken, 'userRole:', userRole, 'path:', path)

  // 🧱 1️⃣ Pas connecté → rediriger vers login
  if (!userToken) {
    return <Navigate to="/login" replace />
  }

  // 🔎 2️⃣ Trouver la route correspondante dans la map
  const matchedEntry = Object.entries(routeRoleMap).find(([pattern]) =>
    matchPath({ path: pattern, end: false }, path)
  )

  const allowedRoles = matchedEntry?.[1]

  // 🚫 3️⃣ Si aucune correspondance OU rôle non autorisé
  if (!allowedRoles || !allowedRoles.includes(userRole ||"")) {
    return <Navigate to="/forbidden" replace />
  }

  // ✅ 4️⃣ Accès autorisé
  return <Outlet />
}

export default ProtectedRoute

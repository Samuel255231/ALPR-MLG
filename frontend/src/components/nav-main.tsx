import { NavLink } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { LucideIcon } from "lucide-react"

// Exemple : le rôle actuel (tu peux le venir de Redux, Context, etc.)
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    role?: string[]
  }[]
}) {
  // Exemple : récupération du rôle depuis Redux
  const role = useSelector((state: RootState) => state.auth.userToken?.user?.role)  

  return (
    <SidebarGroup className="flex flex-col gap-2">
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items
            .filter((item) =>
              !item.role || item.role.includes(role ?? "")
            )
            .map((item) => (
              <SidebarMenuItem key={item.title}>
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

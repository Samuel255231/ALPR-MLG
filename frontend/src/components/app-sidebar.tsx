

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  ArrowRightLeft,
  BarChart3,
  Database,
  FileVideoCamera,
  MapPinPen,
  /*
  SwitchCamera,*/
  Truck,
  User
} from "lucide-react"

const data = {
  user: {
    // NavUser attend 'username' et 'role'
    username: "shadcn",
    email: "m@example.com",
    role: "admin",              // doit être "admin" | "user" | "programme"
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard ALPR",
      url: "/",
      icon: BarChart3,
      role: ['admin', 'quai', 'securite']
    },
    
    {
      title: "Historiques des détections",
      url: "/mouvement",
      icon: ArrowRightLeft,
      role: ['admin', 'quai']
    },
  
    {
      title: "Zone",
      url: "/zone",
      icon: MapPinPen,
      role: ['admin']
    },
    
    {
      title: "Gestion caméras",
      url: "/camera",
      icon: FileVideoCamera,
      role: ['admin']
    },
    {
      title: "Base de données véhicules",
      url: "/camion",
      icon: Truck,
      role: ['admin', 'quai', 'securite']
    },
    {
      title: "Analyse ALPR",
      url: "/analyse",
      icon: Database,
      role: ['admin', 'quai']
    },
    /*
    {
      title: "Monitoring & Logs",
      url: "/surveillance",
      icon: SwitchCamera,
      role: ['admin', 'quai']
    },
    */
    {
      title: "Utilisateurs",
      url: "/users",
      icon: User,
      role: ['admin']
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="mt-4 bg-white">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="mb-15">
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

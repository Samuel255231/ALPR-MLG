

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
  User
} from "lucide-react"

const data = {
  user: {
    // NavUser lit le vrai utilisateur dans le store ; ces valeurs ne servent qu'à satisfaire le typage
    username: "",
    email: "",
    role: "operateur" as const,
  },
  navMain: [
    {
      title: "Dashboard ALPR",
      url: "/",
      icon: BarChart3,
      role: ['admin', 'operateur']
    },

    {
      title: "Historiques des détections",
      url: "/detections",
      icon: ArrowRightLeft,
      role: ['admin', 'operateur']
    },

    {
      title: "Zone",
      url: "/zone",
      icon: MapPinPen,
      role: ['admin', 'operateur']
    },

    {
      title: "Gestion caméras",
      url: "/camera",
      icon: FileVideoCamera,
      role: ['admin', 'operateur']
    },
    {
      title: "Analyse ALPR",
      url: "/analyse",
      icon: Database,
      role: ['admin', 'operateur']
    },
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

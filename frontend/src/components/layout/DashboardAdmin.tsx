import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardAdmin() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 62)",
          "--header-height": "calc(var(--spacing) * 16)",
          
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" className="mt-[var(--header-height)]" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col pt-[var(--header-height)] ">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

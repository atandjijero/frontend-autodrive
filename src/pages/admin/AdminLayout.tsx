import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar avec largeur fixe */}
        <AppSidebar className="w-64" />

        {/* Zone centrale qui change */}
        <main className="flex-1 w-full min-h-screen p-6 bg-background text-foreground">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

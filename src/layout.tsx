import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main style={{ width: "100%" }}>
        <header className="flex items-center gap-2 border-b">
          <SidebarTrigger />
        </header>
        <section className="p-6">{children}</section>
      </main>
    </SidebarProvider>
  );
}

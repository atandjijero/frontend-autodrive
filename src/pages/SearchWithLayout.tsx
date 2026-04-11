import DashboardLayout from "@/layouts/DashboardLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import SearchPage from "@/pages/search";

interface SearchWithLayoutProps {
  role: "client" | "entreprise" | "touriste";
  title: string;
}

export default function SearchWithLayout({ role, title }: SearchWithLayoutProps) {
  return (
    <DashboardLayout>
      <Sidebar role={role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
        <main className="flex-1 p-6">
          <SearchPage />
        </main>
      </SidebarInset>
    </DashboardLayout>
  );
}

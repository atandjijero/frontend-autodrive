import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <InnerLayout>{children}</InnerLayout>
    </SidebarProvider>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isMobile } = useSidebar();
  console.log("Is mobile:", isMobile);

  return (
    <>
      {isMobile ? (
        <>
          <AppSidebar variant="inset" />
          <SidebarTrigger />
        </>
      ) : (
        <AppSidebar collapsible="none" variant="inset" />
      )}

      <SidebarInset>
        <main className="p-10 mx-auto">{children}</main>
      </SidebarInset>
    </>
  );
}

import { Home, Search, Settings } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
export const items = [
  {
    title: "Accueil",
    url: "/",
    icon: Home,
  },
  {
    title: "Vehicules",
    url: "/vehicules",
    icon: Search,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Settings,
  },
  {
    title: "Inscription",
    url: "/inscription",
    icon: Settings,
  },
  {
    title: "Connexion",
    url: "/connexion",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ModeToggle />
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

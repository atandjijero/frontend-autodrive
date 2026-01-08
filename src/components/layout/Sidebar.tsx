"use client";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { Home, Calendar, CreditCard, MessageSquare, User, LogOut, Settings, FileText } from "lucide-react";

const navItemsByRole = {
  client: [
    { label: "Dashboard", icon: Home, href: "/client/dashboard" },
    { label: "Réservations", icon: Calendar, href: "/client/reservations" },
    { label: "Paiements", icon: CreditCard, href: "/client/paiements" },
    { label: "Témoignages", icon: MessageSquare, href: "/client/temoignages" },
    //{ label: "Profil", icon: User, href: "/client/profil" },
  ],
  entreprise: [
    { label: "Dashboard", icon: Home, href: "/entreprise/dashboard" },
    { label: "Témoignages", icon: MessageSquare, href: "/entreprise/temoignages" },
    { label: "Réservations", icon: Calendar, href: "/entreprise/reservations" },
    { label: "Paiements", icon: CreditCard, href: "/entreprise/paiements" },
    { label: "Contrats", icon: FileText, href: "/entreprise/contrats" },
  ],
  touriste: [
    { label: "Dashboard", icon: Home, href: "/touriste/dashboard" },
    { label: "Réservations", icon: Calendar, href: "/touriste/reservations" },
    { label: "Paiements", icon: CreditCard, href: "/touriste/paiements" },
    { label: "Témoignages", icon: MessageSquare, href: "/touriste/temoignages" },
    //{ label: "Profil", icon: User, href: "/touriste/profil" },
  ],
};

export function Sidebar({ role = "client" }: { role?: "client" | "entreprise" | "touriste" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navItems = navItemsByRole[role] || navItemsByRole.client;

  return (
    <ShadSidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="px-3 py-2">
            <a href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold">AD</div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">Autodrive</span>
                <span className="text-xs text-muted-foreground">Espace {role}</span>
              </div>
            </a>
          </div>
          <div className="px-3 pb-2">
            <SidebarInput placeholder="Rechercher..." />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map(({ label, icon: Icon, href }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton asChild>
                    <a href={href} className="flex items-center gap-3 w-full">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="truncate">{label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Gestion</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/support" className="flex items-center gap-3 w-full">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <span>Support & paramètres</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarSeparator />
          <div className="p-3">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.email}</span>
                <span className="text-xs text-muted-foreground capitalize">{role}</span>
              </div>
            </div>
            <button onClick={() => navigate(`/${role}/profil`)} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted w-full text-left">
              <User className="w-5 h-5" />
              <span className="text-sm">Mon profil</span>
            </button>
            <button onClick={() => { logout(); navigate("/"); }} className="mt-2 flex items-center gap-3 rounded-md px-2 py-2 text-destructive hover:bg-destructive/10 w-full text-left">
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Déconnexion</span>
            </button>
          </div>
        </SidebarFooter>
      </ShadSidebar>
  );
}

export default Sidebar;

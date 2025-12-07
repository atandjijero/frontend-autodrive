import * as React from "react";
import {
  IconCar,
  IconCalendar,
  IconDashboard,
  IconCreditCard,
  IconDiscount,
  IconArticle,
  IconMapPin,
  IconSettings,
  IconUsers,
  IconHelp,
  IconSearch,
  IconPlus,
  IconEye,
  IconX,
  IconCheck,
  IconChevronDown,
  type Icon,
} from "@tabler/icons-react";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

import { getProfile } from "@/api/apiClient";
import type { UserProfile } from "@/api/apiClient";

// Définition du type NavItem
export type NavItem = {
  title: string;
  url: string;
  icon: Icon;
  children?: NavItem[];
};

//  Composant Dropdown pour gérer les children
function SidebarDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <item.icon className="!size-5" />
          <span>{item.title}</span>
        </div>
        <IconChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </SidebarMenuButton>

      {open && (
        <div className="ml-6 mt-2 flex flex-col gap-1">
          {item.children?.map((child: NavItem) => (
            <Link
              key={child.url}
              to={child.url}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
            >
              <child.icon className="!size-4" />
              <span>{child.title}</span>
            </Link>
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
      }
    };
    fetchProfile();
  }, []);

  const navItems: NavItem[] = [
    {
      title: "Tableau de bord",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Véhicules",
      url: "/admin/vehicules",
      icon: IconCar,
      children: [
        { title: "Ajouter", url: "/admin/vehicules/ajouter", icon: IconPlus },
        { title: "Afficher", url: "/admin/vehicules/liste", icon: IconEye },
        { title: "Indisponible", url: "/admin/vehicules/indisponible", icon: IconX },
        { title: "Disponible", url: "/admin/vehicules/disponible", icon: IconCheck },
      ],
    },
    {
    title: "Réservations",
    url: "/admin/reservations",
    icon: IconCalendar,
    children: [
      {
        title: "Toutes les réservations",
        url: "/admin/reservations/liste", // correspond à GET /reservations
        icon: IconEye,
      },
      {
        title: "Supprimer une réservation",
        url: "/admin/reservations/supprimer", // correspond à DELETE /reservations/:id
        icon: IconX,
      },
    ],
  },
    { title: "Clients", url: "/admin/clients", icon: IconUsers },
    {
   title: "Paiements",
   url: "/admin/paiements",
   icon: IconCreditCard,
   children: [
    {
      title: "Voir les paiements",
      url: "/admin/paiements/liste",
      icon: IconEye,
     },
    ],
    },

    { title: "Promotions", url: "/admin/promotions", icon: IconDiscount },
    { title: "Blog / Actualités", url: "/admin/blog", icon: IconArticle },
    { title: "Agences", url: "/admin/agences", icon: IconMapPin },
    { title: "Paramètres", url: "/admin/settings", icon: IconSettings },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* En-tête */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/admin/dashboard">
                <IconDashboard className="!size-5" />
                <span className="text-base font-semibold">AutoDrive Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Contenu principal */}
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item: NavItem) =>
            item.children ? (
              <SidebarDropdown key={item.title} item={item} />
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon className="!size-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>

        <NavSecondary
          items={[
            { title: "Aide", url: "/help", icon: IconHelp },
            { title: "Recherche", url: "/search", icon: IconSearch },
          ]}
          className="mt-auto"
        />
      </SidebarContent>

      {/* Pied de sidebar avec utilisateur */}
      <SidebarFooter>
        <NavUser
          user={
            user
              ? {
                  name: `${user.prenom} ${user.nom}`,
                  email: user.email,
                  avatar: "/avatars/admin.jpg",
                  role: user.role,
                }
              : {
                  name: "Invité",
                  email: "inconnu@example.com",
                  avatar: "/avatars/default.jpg",
                }
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}

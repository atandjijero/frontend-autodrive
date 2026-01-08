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
  IconNotification,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";

import { getProfile, getUnreadNotifications } from "@/api/apiClient";
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
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <item.icon className="!size-5" />
              <span>{item.title}</span>
            </div>
            <IconChevronDown
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-6 mt-1 space-y-1">
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
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Ne pas essayer de récupérer le profil si pas de token

      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err: any) {
        console.error("Erreur lors de la récupération du profil :", err);
        // En cas d'erreur 401 ou 400, vider le user et ne pas afficher d'erreur
        if (err.response?.status === 401 || err.response?.status === 400) {
          setUser(null);
          // Optionnel: déconnecter l'utilisateur si le token est invalide
          // localStorage.removeItem("token");
        }
      }
    };
    fetchProfile();
  }, []);

  React.useEffect(() => {
    const fetchUnread = async () => {
      try {
        if (!user || user.role !== 'admin') return;
        const res = await getUnreadNotifications();
        setUnreadCount(res.data?.length || 0);
      } catch (e) {
        console.error('Erreur récupération notifications non-lues', e);
      }
    };
    fetchUnread();
  }, [user]);

  const navItems: NavItem[] = [
    {
      title: "Notifications",
      url: "/admin/notifications",
      icon: IconNotification,
    },
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
    ],
  },
    {
    title: "Clients",
    url: "/admin/clients",
    icon: IconUsers,
    children: [
      {
        title: "Liste des clients",
        url: "/admin/clients/liste",
        icon: IconEye,
      },
    ],
  },
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

    {
  title: "Promotions",
  url: "/admin/promotions",
  icon: IconDiscount,
  children: [
    {
      title: "Ajouter une promotion",
      url: "/admin/promotions/ajouter",
      icon: IconPlus,
    },
    {
      title: "Toutes les promotions",
      url: "/admin/promotions/liste",
      icon: IconEye,
    },
    {
      title: "Promotions actives",
      url: "/admin/promotions/actives",
      icon: IconCheck,
    },
    /*{
      title: "Supprimer une promotion",
      url: "/admin/promotions/delete",
      icon: IconX,
    },*/
    {
      title: "Appliquer une promotion",
      url: "/admin/promotions/appliquer",
      icon: IconDiscount,
    },
  ],
}
,
    {
      title: "Blog et Actualités",
      url: "/admin/blog",
      icon: IconArticle,
      children: [
        {
          title: "Tous les articles",
          url: "/admin/blog",
          icon: IconEye,
        },
        {
          title: "Créer un article",
          url: "/admin/blog/create",
          icon: IconPlus,
        },
        {
          title: "Articles publiés",
          url: "/admin/blog/published",
          icon: IconCheck,
        },
        {
          title: "Brouillons",
          url: "/admin/blog/drafts",
          icon: IconX,
        },
      ],
    },
    {
      title: "Agences",
      url: "/admin/agences",
      icon: IconMapPin,
      children: [
        {
          title: "Liste des agences",
          url: "/admin/agences/liste",
          icon: IconEye,
        },
        {
          title: "Ajouter une agence",
          url: "/admin/agences/ajouter",
          icon: IconPlus,
        },
        {
          title: "Importer des agences",
          url: "/admin/agences/importer",
          icon: IconPlus,
        },
      ],
    },
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
          unreadCount={unreadCount}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

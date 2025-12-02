import * as React from "react"
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
  IconEdit,
  IconTrash,
  IconX,
  IconCheck,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

import { getProfile } from "@/api/apiClient"
import type { UserProfile } from "@/api/apiClient"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<UserProfile | null>(null)

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile()
        setUser(res.data)
      } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err)
      }
    }
    fetchProfile()
  }, [])

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
        <NavMain
          items={[
            { title: "Tableau de bord", url: "/admin/dashboard", icon: IconDashboard },
            {
            title: "Véhicules",
             url: "/admin/vehicules",
             icon: IconCar,
             children: [
              { title: "Ajouter", url: "/admin/vehicules/ajouter", icon: IconPlus },
              { title: "Afficher", url: "/admin/vehicules/liste", icon: IconEye },
              { title: "Modifier", url: "/admin/vehicules/modifier", icon: IconEdit },
              { title: "Supprimer", url: "/admin/vehicules/supprimer", icon: IconTrash },
              { title: "Indisponible", url: "/admin/vehicules/indisponible", icon: IconX },
              { title: "Disponible", url: "/admin/vehicules/disponible", icon: IconCheck },
              ],
               }
              ,
            { title: "Réservations", url: "/admin/reservations", icon: IconCalendar },
            { title: "Clients", url: "/admin/clients", icon: IconUsers },
            { title: "Paiements", url: "/admin/paiements", icon: IconCreditCard },
            { title: "Promotions", url: "/admin/promotions", icon: IconDiscount },
            { title: "Blog / Actualités", url: "/admin/blog", icon: IconArticle },
            { title: "Agences", url: "/admin/agences", icon: IconMapPin },
            { title: "Paramètres", url: "/admin/settings", icon: IconSettings },
          ]}
        />

        <NavSecondary
          items={[
            { title: "Aide", url: "/help", icon: IconHelp },
            { title: "Recherche", url: "/search", icon: IconSearch },
            //{ title: "Déconnexion", url: "/", icon: IconLogout },
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
  )
}

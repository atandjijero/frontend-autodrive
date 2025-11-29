import {
  Home,
  Car,
  Users,
  CalendarDays,
  CreditCard,
  User,
  MoreVertical,
  LogOut,
} from "lucide-react"
import { Outlet, useNavigate, NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export default function AdminLayout() {
  const navigate = useNavigate()
  const userEmail = localStorage.getItem("email") || ""

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    navigate("/connexion")
  }

  const menuItems = [
    { label: "Tableau de bord", icon: Home, path: "/admin/dashboard" },
    { label: "Véhicules", icon: Car, path: "/admin/vehicules" },
    { label: "Clients", icon: Users, path: "/admin/clients" },
    { label: "Réservations", icon: CalendarDays, path: "/admin/reservations" },
    { label: "Paiements", icon: CreditCard, path: "/admin/paiements" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-black">
      {/* Navbar */}
      <header className="h-16 bg-white dark:bg-black border-b flex items-center px-6">
        <h1 className="text-lg font-bold text-black dark:text-white">
          Espace Admin
        </h1>
      </header>

      {/* Sidebar + Main */}
      <div className="flex flex-1">
        <aside className="w-64 flex flex-col bg-white dark:bg-black text-black dark:text-white border-r border-gray-300 dark:border-gray-700">
          <div className="p-4 font-bold text-xl">AutoDrive Admin 🚗</div>

          <Separator />

          <nav className="flex flex-col gap-1 p-4 flex-1">
            {menuItems.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md ${
                    isActive
                      ? "bg-black text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`
                }
              >
                <Icon className="h-5 w-5" /> {label}
              </NavLink>
            ))}
          </nav>

          <Separator />

          {/* Footer du sidebar */}
          <div className="flex items-center justify-between text-sm p-4 bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center gap-2 max-w-[150px] overflow-hidden">
              <User className="h-4 w-4 flex-shrink-0" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="truncate cursor-default">
                      {userEmail || "Email non disponible"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{userEmail}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuItem onClick={() => navigate("/admin/profil")}>
                  Compte (Profil)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-6 overflow-y-auto bg-white dark:bg-black text-black dark:text-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

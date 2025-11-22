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

export default function AdminLayout() {
  const navigate = useNavigate()
  const adminEmail = "admin@autodrive.com"

  const handleLogout = () => {
    navigate("/connexion")
  }

  const menuItems = [
    { label: "Tableau de bord", icon: Home, path: "/admin" },
    { label: "Véhicules", icon: Car, path: "/admin/vehicules" },
    { label: "Clients", icon: Users, path: "/admin/clients" },
    { label: "Réservations", icon: CalendarDays, path: "/admin/reservations" },
    { label: "Paiements", icon: CreditCard, path: "/admin/paiements" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-black">
      {/* Navbar en haut */}
      <header className="h-16 bg-white dark:bg-black border-b flex items-center px-6">
        <h1 className="text-lg font-bold text-black dark:text-white">
          Espace Admin
        </h1>
      </header>

      {/* Sidebar + Dashboard côte à côte */}
      <div className="flex flex-1">
        {/* Sidebar avec scrollbar + ligne séparatrice */}
        <aside className="w-64 flex-shrink-0 flex flex-col bg-white text-black dark:bg-black dark:text-white overflow-y-auto border-r border-gray-300 dark:border-gray-700">
          <div className="p-4 font-bold text-xl">AutoDrive Admin 🚗</div>

          <nav className="flex flex-col gap-2 p-4 flex-1">
            {menuItems.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-black text-white dark:bg-black dark:text-white"
                      : "text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`
                }
              >
                <Icon className="h-5 w-5" /> {label}
              </NavLink>
            ))}
          </nav>

          {/* Footer du sidebar */}
          <div className="flex items-center justify-between text-sm p-4 bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{adminEmail}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
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

        {/* Dashboard avec scrollbar */}
        <main className="flex-1 p-6 overflow-y-auto bg-white dark:bg-black text-black dark:text-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

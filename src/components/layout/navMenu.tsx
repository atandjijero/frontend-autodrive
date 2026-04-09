import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/lang-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowLeft } from "lucide-react"; // icônes
import { cn } from "@/lib/utils";

export const items = [
  { key: "home", url: "/" },
  { key: "login", url: "/connexion" },
  { key: "about", url: "/about" },
  { key: "contact", url: "/contact" },
  { key: "faq", url: "/faq" },
  { key: "blog", url: "/blog" },
];

export function NavMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isHome = location.pathname === "/";

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center border-b px-6 bg-white dark:bg-black text-gray-900 dark:text-white z-50">
        {/* Bouton retour + Logo */}
        <div className="flex items-center gap-2">
          {!isHome && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Retour"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link
            to="/"
            aria-label="Accueil"
            className="flex items-center gap-2 px-2 transition-transform hover:scale-105 active:scale-95 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-blue-500/25 transition-all">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">AutoDrive</h1>
          </Link>
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex ml-auto">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-8 items-center">
              {items.map((item) => (
                <NavigationMenuItem key={item.key}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "px-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                        location.pathname === item.url &&
                          "font-semibold text-blue-600 dark:text-blue-400"
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <ModeToggle />
              <LanguageSwitcher />
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Menu mobile */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Ouvrir le menu de navigation"
                className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              aria-label="Menu de navigation mobile"
              className="p-6 bg-white dark:bg-black text-gray-900 dark:text-white"
            >
              <nav className="flex flex-col gap-4">
                {items.map((item) => (
                  <Link
                    key={item.key}
                    to={item.url}
                    className={cn(
                      "text-lg transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                      location.pathname === item.url &&
                        "font-semibold text-blue-600 dark:text-blue-400"
                    )}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
                <ModeToggle />
                <LanguageSwitcher />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Décalage du contenu principal */}
      <div className="pt-16">{/* Ici tu mets ton contenu principal */}</div>
    </>
  );
}

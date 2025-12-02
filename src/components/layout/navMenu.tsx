import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react"; // icône hamburger
export const items = [
  { title: "Accueil", url: "/" },
  { title: "Connexion", url: "/connexion" },
  { title: "À propos", url: "/about" },
  { title: "Contact", url: "/contact" },
  { title: "FAQ", url: "/faq" },
];

export function NavMenu() {
  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center border-b px-6 bg-white dark:bg-black text-gray-900 dark:text-white z-50">
        {/* Logo */}
        <Link
          to="/"
          className="px-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          <h1 className="text-xl font-bold">AutoDrive 🚗</h1>{" "}
        </Link>

        {/* Menu desktop */}
        <nav className="hidden md:flex ml-auto">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-8 items-center">
              {items.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.url}
                      className="px-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <ModeToggle />
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
                className="text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-6 bg-white dark:bg-black text-gray-900 dark:text-white"
            >
              <nav className="flex flex-col gap-4">
                {items.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className="text-lg transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {item.title}
                  </Link>
                ))}
                <ModeToggle />
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

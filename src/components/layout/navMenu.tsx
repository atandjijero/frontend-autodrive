import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";

export const items = [
  {
    title: "Accueil",
    url: "/",
  },
  {
    title: "Vehicules",
    url: "/vehicules",
  },
  {
    title: "Admin",
    url: "/admin",
  },
  {
    title: "Inscription",
    url: "/inscription",
  },
  {
    title: "Connexion",
    url: "/connexion",
  },
];

export function NavMenu() {
  return (
    <header className="flex items-center gap-2 border-b m-3">
      <NavigationMenu>
        <NavigationMenuList>
          {items.map((item) => (
            <NavigationMenuItem key={item.title}>
              <Separator orientation="vertical" />
              <NavigationMenuLink>
                <Link to={item.url}>
                  <span>{item.title}</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <ModeToggle />
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

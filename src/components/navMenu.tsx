import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { items } from "./app-sidebar";

export function NavMenu() {
  return (
    <header className="flex items-center gap-2 border-b m-3">
      <NavigationMenu>
        <NavigationMenuList>
          {items.map((item) => (
            <NavigationMenuItem key={item.title}>
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

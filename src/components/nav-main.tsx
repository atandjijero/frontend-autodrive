import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Définition du type NavItem
export type NavItem = {
  title: string
  url: string
  icon?: Icon
  children?: NavItem[]   
}

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Bloc Quick Create + Inbox */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Création rapide"
              className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Création rapide</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Boîte de réception</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Bloc navigation principale */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.url}>
                  {item.icon && <item.icon className="size-5" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>

              {/*  gestion des sous-menus */}
              {item.children && (
                <SidebarMenu className="ml-4">
                  {item.children.map((child) => (
                    <SidebarMenuItem key={child.title}>
                      <SidebarMenuButton asChild tooltip={child.title}>
                        <Link to={child.url}>
                          {child.icon && <child.icon className="size-4" />}
                          <span>{child.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Bouton pour ouvrir/fermer la sidebar */}
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Titre du projet */}
        <h1 className="text-base font-semibold text-primary">
          AutoDrive – Location de véhicules
        </h1>

        {/* Actions à droite */}
        <div className="ml-auto flex items-center gap-2">
          {/* Exemple : lien vers la documentation interne */}
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="/docs"
              rel="noopener noreferrer"
              className="dark:text-foreground"
            >
              Profil
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}

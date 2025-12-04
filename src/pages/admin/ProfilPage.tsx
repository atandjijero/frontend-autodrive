import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ProfilPage() {
  const adminEmail = "admin@autodrive.com" //  à remplacer par ton auth réel

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>

          <div className="text-center">
            <CardTitle className="text-xl font-bold">Profil Admin 👤</CardTitle>
            <p className="text-sm text-muted-foreground">{adminEmail}</p>
            <Badge variant="outline" className="mt-2">
              Administrateur
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 mt-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{adminEmail}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Rôle</p>
            <p>Administrateur</p>
          </div>
          <div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Modifier le profil
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

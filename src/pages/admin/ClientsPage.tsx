import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Clients 👥</h1>
      <p className="text-gray-600">Gestion des clients et contrats associés.</p>

      {/* Bouton ajouter */}
      <Button className="bg-blue-600 text-white hover:bg-blue-700">
        ➕ Ajouter un client
      </Button>

      {/* Tableau des clients */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Jean Dupont</TableCell>
                <TableCell>jean.dupont@email.com</TableCell>
                <TableCell>+228 90 12 34 56</TableCell>
                <TableCell>Actif</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Awa Konaté</TableCell>
                <TableCell>awa.konate@email.com</TableCell>
                <TableCell>+228 91 23 45 67</TableCell>
                <TableCell>En attente</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mike Johnson</TableCell>
                <TableCell>mike.johnson@email.com</TableCell>
                <TableCell>+228 92 34 56 78</TableCell>
                <TableCell>Résilié</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

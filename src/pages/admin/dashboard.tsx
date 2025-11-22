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

export default function DashboardOnly() {
  return (
    <main className="flex-1 p-6 overflow-y-auto bg-white text-gray-900 dark:bg-black dark:text-white">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord 📊</h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Véhicules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">120</p>
              <p className="text-sm text-muted-foreground">Total enregistrés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">85</p>
              <p className="text-sm text-muted-foreground">Actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42</p>
              <p className="text-sm text-muted-foreground">En cours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">15 000 €</p>
              <p className="text-sm text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des réservations */}
        <Card>
          <CardHeader>
            <CardTitle>📅 Prochaines réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Date début</TableHead>
                  <TableHead>Date fin</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Jean Dupont</TableCell>
                  <TableCell>Peugeot 208</TableCell>
                  <TableCell>22/11/2025</TableCell>
                  <TableCell>25/11/2025</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-green-100 text-green-700">
                      Confirmée
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Awa K.</TableCell>
                  <TableCell>Toyota RAV4</TableCell>
                  <TableCell>23/11/2025</TableCell>
                  <TableCell>28/11/2025</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700">
                      En attente
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

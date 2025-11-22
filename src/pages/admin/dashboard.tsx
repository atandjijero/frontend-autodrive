import { useEffect } from "react";
import { vehicules } from "./vehiculesListe";
import { contrats } from "./contrats";
import { clients } from "./clientsListe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Tableau de bord - Admin – AutoDrive";
  }, []);

  const totalVehicles = Object.keys(vehicules).length;
  const totalClients = Object.keys(clients).length;
  const totalReservations = Object.keys(contrats).length;

  const upcomingReservations = Object.entries(contrats)
    .filter(([, contrat]) => {
      const reservFrom = new Date(contrat.reservation.from);
      return reservFrom >= new Date();
    })
    .sort(
      ([, a], [, b]) =>
        new Date(a.reservation.from).getTime() -
        new Date(b.reservation.from).getTime()
    )
    .slice(0, 5);

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Véhicules totaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVehicles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clients totaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReservations}</div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Prochaines réservations</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingReservations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Date de fin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingReservations.map(([, contrat]) => {
                    const client = clients[Number(contrat.idClient)];
                    const vehicule = vehicules[Number(contrat.idVehicule)];
                    return (
                      <TableRow key={contrat.idClient}>
                        <TableCell>
                          {client?.nom} {client?.prenom}
                        </TableCell>
                        <TableCell>
                          {vehicule?.marque} - {vehicule?.immatriculation}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            contrat.reservation.from
                          ).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          {new Date(contrat.reservation.to).toLocaleDateString(
                            "fr-FR"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">
                Aucune réservation à venir
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

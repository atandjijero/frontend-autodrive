import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconSearch, IconCar, IconUsers, IconFileText } from "@tabler/icons-react";
import { getUsers, getVehicles, getReservations } from "@/api/apiClient";

type SearchResult = {
  type: "vehicle" | "user" | "reservation";
  title: string;
  description: string;
  category: string;
};

const normalize = (value: string) => value.toLowerCase();

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildVehicleResults = (vehicles: any[], queryLower: string): SearchResult[] =>
    vehicles
      .filter((vehicle) =>
        [vehicle.modele, vehicle.marque, vehicle.carrosserie, vehicle.immatriculation]
          .filter(Boolean)
          .some((value) => normalize(value).includes(queryLower))
      )
      .map((vehicle) => ({
        type: "vehicle",
        title: `${vehicle.marque} ${vehicle.modele}`,
        description: `${vehicle.carrosserie} - immatriculation ${vehicle.immatriculation}`,
        category: "Véhicules",
      }));

  const buildUserResults = (users: any[], queryLower: string): SearchResult[] =>
    users
      .filter((user) =>
        [user.nom, user.prenom, user.email, user.role]
          .filter(Boolean)
          .some((value) => normalize(value).includes(queryLower))
      )
      .map((user) => ({
        type: "user",
        title: `${user.nom} ${user.prenom}`,
        description: `${user.email} — ${user.role}`,
        category: "Utilisateurs",
      }));

  const buildReservationResults = (reservations: any[], queryLower: string): SearchResult[] =>
    reservations
      .filter((reservation) => {
        const vehicle = reservation.vehicle || {};
        const client = reservation.client || {};
        return [
          reservation.numeroReservation,
          reservation.statut,
          vehicle.modele,
          vehicle.marque,
          client.nom,
          client.prenom,
          client.email,
        ]
          .filter(Boolean)
          .some((value) => normalize(value).includes(queryLower));
      })
      .map((reservation) => ({
        type: "reservation",
        title: reservation.numeroReservation || `Réservation ${reservation.id}`,
        description: `Client: ${reservation.client?.nom || "-"} ${reservation.client?.prenom || ""} — Véhicule: ${reservation.vehicle?.marque || ""} ${reservation.vehicle?.modele || ""}`,
        category: "Réservations",
      }));

  const handleSearch = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    const queryTrimmed = query.trim();
    if (!queryTrimmed) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const queryLower = normalize(queryTrimmed);

    try {
      const [vehiclesRes, reservationsRes, usersRes] = await Promise.allSettled([
        getVehicles(),
        getReservations(),
        getUsers(),
      ]);

      const vehicleResults =
        vehiclesRes.status === "fulfilled" ? buildVehicleResults(vehiclesRes.value.data, queryLower) : [];
      const reservationResults =
        reservationsRes.status === "fulfilled" ? buildReservationResults(reservationsRes.value.data, queryLower) : [];
      const userResults =
        usersRes.status === "fulfilled" ? buildUserResults(usersRes.value.data, queryLower) : [];

      setResults([...vehicleResults, ...userResults, ...reservationResults]);

      if (vehiclesRes.status === "rejected" && reservationsRes.status === "rejected" && usersRes.status === "rejected") {
        setError("Impossible de récupérer les données de recherche, veuillez réessayer plus tard.");
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue pendant la recherche.");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "vehicle":
        return IconCar;
      case "user":
        return IconUsers;
      default:
        return IconFileText;
    }
  };

  return (
    <div className="p-6 container mx-auto max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Recherche</h1>
        <p className="text-muted-foreground">
          Recherchez dans tous les éléments de l'application
        </p>
      </div>

      {/* Barre de recherche */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Rechercher véhicules, utilisateurs, réservations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <IconSearch className="h-4 w-4 mr-2" />
              {loading ? "Recherche..." : "Rechercher"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de recherche</CardTitle>
            <CardDescription>
              {results.length} résultat(s) trouvé(s) pour "{query}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tous ({results.length})</TabsTrigger>
                <TabsTrigger value="vehicles">
                  Véhicules ({results.filter(r => r.type === 'vehicle').length})
                </TabsTrigger>
                <TabsTrigger value="users">
                  Utilisateurs ({results.filter(r => r.type === 'user').length})
                </TabsTrigger>
                <TabsTrigger value="reservations">
                  Réservations ({results.filter(r => r.type === 'reservation').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="space-y-3">
                  {results.map((result, index) => {
                    const IconComponent = getIcon(result.type);
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <IconComponent className="h-5 w-5 mt-0.5 text-primary" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{result.title}</h4>
                            <Badge variant="outline">{result.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="vehicles" className="mt-4">
                <div className="space-y-3">
                  {results.filter(r => r.type === 'vehicle').map((result, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <IconCar className="h-5 w-5 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium">{result.title}</h4>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-4">
                <div className="space-y-3">
                  {results.filter(r => r.type === 'user').map((result, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <IconUsers className="h-5 w-5 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium">{result.title}</h4>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reservations" className="mt-4">
                <div className="space-y-3">
                  {results.filter(r => r.type === 'reservation').map((result, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <IconFileText className="h-5 w-5 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium">{result.title}</h4>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* État vide */}
      {query && !loading && results.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <IconSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground">
              Essayez avec des termes différents ou vérifiez l'orthographe.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
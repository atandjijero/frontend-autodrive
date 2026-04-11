import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconSearch, IconCar, IconUsers, IconFileText } from "@tabler/icons-react";
import { getVehicles, getUsers, getReservations, type Vehicle, type AdminUser, type Reservation } from "@/api/apiClient";

type SearchResult = {
  type: "vehicle" | "user" | "reservation";
  title: string;
  description: string;
  category: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setLoading(true);
    setResults([]);

    const normalizedQuery = trimmedQuery.toLowerCase();

    try {
      const [vehiclesRes, usersRes, reservationsRes] = await Promise.allSettled([
        getVehicles(),
        getUsers(),
        getReservations(),
      ]);

      const collectedResults: SearchResult[] = [];

      if (vehiclesRes.status === "fulfilled") {
        vehiclesRes.value.data
          .filter((vehicle: Vehicle) =>
            [vehicle.marque, vehicle.modele, vehicle.immatriculation]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery)
          )
          .forEach((vehicle: Vehicle) => {
            collectedResults.push({
              type: "vehicle",
              title: `${vehicle.marque} ${vehicle.modele}`,
              description: `Immatriculation ${vehicle.immatriculation} - ${vehicle.disponible ? "Disponible" : "Indisponible"}`,
              category: "Véhicules",
            });
          });
      }

      if (usersRes.status === "fulfilled") {
        usersRes.value.data
          .filter((user: AdminUser) =>
            [user.nom, user.prenom, user.email, user.role]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery)
          )
          .forEach((user: AdminUser) => {
            collectedResults.push({
              type: "user",
              title: `${user.prenom} ${user.nom}`,
              description: `${user.email} — rôle ${user.role}`,
              category: "Utilisateurs",
            });
          });
      }

      if (reservationsRes.status === "fulfilled") {
        reservationsRes.value.data
          .filter((reservation: Reservation) =>
            [
              reservation.numeroReservation,
              reservation.statut,
              reservation.vehicle?.modele,
              reservation.vehicle?.marque,
              reservation.client?.nom,
              reservation.client?.prenom,
              reservation.client?.email,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery)
          )
          .forEach((reservation: Reservation) => {
            collectedResults.push({
              type: "reservation",
              title: `Réservation #${reservation.numeroReservation}`,
              description: `Client ${reservation.client.prenom} ${reservation.client.nom} — ${reservation.vehicle.marque} ${reservation.vehicle.modele}`,
              category: "Réservations",
            });
          });
      }

      setResults(collectedResults);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "vehicle": return IconCar;
      case "user": return IconUsers;
      default: return IconFileText;
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
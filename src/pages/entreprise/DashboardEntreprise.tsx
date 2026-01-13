import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { getDashboard, getUserTemoignages, getContracts, apiClient } from "@/api/apiClient"; 
import generateContractPdf from "@/lib/generateContractPdf";
import { toast } from "sonner";
import type { DashboardResponse, Temoignage, Contract } from "@/api/apiClient";
import { useAuth } from "@/context/AuthContext";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

// Icons
import { Calendar, CreditCard, MessageSquare, AlertCircle, Plus, Eye, TrendingUp } from "lucide-react";

// Fonction utilitaire pour formater les dates
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function DashboardEntreprise() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTestimonials, setUserTestimonials] = useState<Temoignage[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardRes, userTestimonialsRes, contractsRes] = await Promise.all([
          getDashboard(),
          getUserTemoignages(), // récupère directement les témoignages du user connecté
          getContracts(),
        ]);

        setData(dashboardRes.data);
        setUserTestimonials(userTestimonialsRes.data);
        setContracts(contractsRes.data || []);

        setLoading(false);
      } catch (err) {
        setError("Impossible de charger le dashboard entreprise");
        setLoading(false);
        console.error(err);
      }
    };

    loadData();
  }, [user]);

  return (
    <DashboardLayout>
      <Sidebar role="entreprise" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Espace Entreprise</h1>
        </header>

        <main className="flex-1 space-y-6 p-6 container mx-auto max-w-6xl bg-background">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-64" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {data && (
            <>
              {/* Welcome Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Bienvenue, {data.profil.prenom} {data.profil.nom}
                  </h2>
                  <p className="text-muted-foreground">
                    Gérez votre flotte de véhicules et vos réservations d'entreprise.
                  </p>
                </div>
                <Link to="/vehicules">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle réservation
                  </Button>
                </Link>
              </div>

              {/* Stats Cards */}
              <div className={`grid grid-cols-1 md:grid-cols-${data.paiements.length > 0 ? 3 : 2} gap-4`}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Réservations actives</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data.reservations.filter(r => r.statut === "en cours").length}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      +2 depuis le mois dernier
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Paiements</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.paiements.length}</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      €{data.paiements.reduce((sum, p) => sum + p.montant, 0)} total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mes témoignages</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userTestimonials.length}</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      Partagés publiquement
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Réservations Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Réservations récentes</h3>
                  <Link to="/entreprise/reservations">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Voir tout
                    </Button>
                  </Link>
                </div>
                {data.reservations.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Aucune réservation pour l'instant.</p>
                      <Link to="/vehicules">
                        <Button className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          Nouvelle réservation
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.reservations.map((r) => (
                      <Card key={r._id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              {r.vehicleId.marque} {r.vehicleId.modele}
                            </CardTitle>
                            <Badge variant={r.statut === "en cours" ? "default" : "secondary"}>
                              {r.statut}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-2 h-4 w-4" />
                              Du {formatDate(r.dateDebut)}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-2 h-4 w-4" />
                                                            Au {formatDate(r.dateFin)}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-4">
                            Voir détails
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Section Mes témoignages détaillés */}
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold">Mes témoignages</h3>
                {userTestimonials.length === 0 ? (
                  <Card>
                    <CardContent className="py-6 text-center text-muted-foreground">
                      Vous n'avez pas encore partagé de témoignage.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userTestimonials.map((t, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {t.prenom} {t.nom}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{t.message}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Contrats approuvés */}
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold">Contrats approuvés</h3>
                {contracts.filter(c => c.statut === 'Approved').length === 0 ? (
                  <Card>
                    <CardContent className="py-6 text-center text-muted-foreground">
                      Aucun contrat approuvé pour le moment.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contracts.filter(c => c.statut === 'Approved').map((c) => (
                      <Card key={c._id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-base">{c.vehicleId ? `${c.vehicleId.marque} ${c.vehicleId.modele}` : 'Véhicule'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">Montant: {c.montantTotal} €</p>
                            <div className="mt-3">
                              <Button variant="outline" size="sm" onClick={async () => {
                                try {
                                  const resp = await apiClient.get(`/contracts/${c._id}/download`);
                                  let contract = resp.data;
                                  let agency: any = null;
                                  try {
                                    const agencyId = contract.agencyId || contract.agenceId || contract.agence?._id;
                                    if (agencyId) {
                                      const agencyResp = await apiClient.get(`/agencies/${agencyId}`);
                                      agency = agencyResp.data;
                                    }
                                  } catch (e) {
                                    console.warn('Unable to fetch agency by id', e);
                                  }
                                  if (!agency) {
                                    try {
                                      const activeRes = await apiClient.get('/agencies/agencies/active/all?limit=1');
                                      if ((activeRes as any).data && (activeRes as any).data.length) {
                                        agency = (activeRes as any).data[0];
                                      }
                                    } catch (e) {
                                      console.warn('Unable to fetch active agency', e);
                                    }
                                  }
                                  const logoFieldCandidates = [agency?.logo, contract.agenceLogo, contract.logo, contract.agencyLogo, contract.agenceLogoPath];
                                  const logoCandidate = logoFieldCandidates.find(Boolean) as string | undefined;
                                  const doc = await generateContractPdf(contract, { agency: agency || undefined, agencyLogoUrl: logoCandidate || undefined });
                                  const blob = doc.output('blob');
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.setAttribute('download', `contrat-${c._id}.pdf`);
                                  document.body.appendChild(link);
                                  link.click();
                                  link.parentNode?.removeChild(link);
                                  window.URL.revokeObjectURL(url);
                                } catch (err) {
                                  console.error('Erreur téléchargement contrat:', err);
                                  toast.error('Impossible de télécharger le reçu');
                                }
                              }}>Télécharger le reçu</Button>
                            </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </SidebarInset>
    </DashboardLayout>
  );
}


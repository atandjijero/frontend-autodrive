import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, FileText, Plus, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getContracts, apiClient } from "@/api/apiClient";
import generateContractPdf from "@/lib/generateContractPdf";
import { toast } from "sonner";

interface Contract {
  _id: string;
  userId: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  vehicleId?: {
    marque: string;
    modele: string;
    immatriculation: string;
    prix: number;
  };
  dateDebut: string;
  dateFin: string;
  montantTotal: number;
  acompteVerse: number;
  conditionsSpeciales?: string;
  statut: 'Pending' | 'Approved' | 'Rejected';
  dateValidation?: string;
  validePar?: {
    nom: string;
    prenom: string;
  };
}

export default function ContratsEntreprise() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadContracts();
  }, []);

  // Poll periodically to pick up admin validations so users see the download button
  useEffect(() => {
    const interval = setInterval(() => {
      loadContracts();
    }, 20000); // every 20s
    return () => clearInterval(interval);
  }, []);

  const loadContracts = async () => {
    try {
      // TODO: Implement API call to get contracts
      const response = await getContracts();
      setContracts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadContract = async (contractId: string) => {
    try {
      setDownloadingId(contractId);
      const resp = await apiClient.get(`/contracts/${contractId}/download`);
      let contract = resp.data;
      // Fetch agency details: first try by contract.agencyId, then fallback to active agency
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
      // Fallback: fetch active agency if not found by ID
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
      const agencyLogoUrl = logoCandidate || undefined;

      // Ensure agency info has sensible defaults when fields are missing
      const agencyWithDefaults = {
        name: agency?.name || 'AutoDrive',
        address: agency?.address || 'Non spécifiée',
        phone: agency?.phone || 'Non spécifié',
        email: agency?.email || 'Non spécifié',
        logo: agency?.logo || agencyLogoUrl,
      };

      const doc = await generateContractPdf(contract, { agency: agencyWithDefaults, agencyLogoUrl: agencyWithDefaults.logo });
      const blob = doc.output('blob');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contrat-${contractId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloadingId(null);
    } catch (error: any) {
      setDownloadingId(null);
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Impossible de télécharger le reçu.');
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'Approved':
        return <Badge variant="secondary" className="bg-green-500">Approuvé</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Sidebar role="entreprise" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Mes Contrats</h1>
          </header>
          <main className="flex-1 space-y-6 p-6 container mx-auto max-w-6xl bg-background">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Chargement des contrats...</div>
            </div>
          </main>
        </SidebarInset>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Sidebar role="entreprise" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Mes Contrats</h1>
        </header>

        <main className="flex-1 space-y-6 p-6 container mx-auto max-w-6xl bg-background">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Mes Contrats</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={loadContracts} title="Rafraîchir la liste">
                <RefreshCw className="mr-2 h-4 w-4" />
                Rafraîchir
              </Button>
              <Link to="/entreprise/contrats/nouveau">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Contrat
                </Button>
              </Link>
            </div>
          </div>

          {contracts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun contrat
                </h3>
                <p className="text-gray-500 mb-4">
                  Vous n'avez pas encore créé de contrat de location.
                </p>
                <Link to="/entreprise/contrats/nouveau">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Créer votre premier contrat
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {contracts.map((contract) => (
                <Card key={contract._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {contract.vehicleId
                            ? `${contract.vehicleId.marque} ${contract.vehicleId.modele}`
                            : 'Véhicule à définir'
                          }
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {contract.vehicleId
                            ? `Immatriculation: ${contract.vehicleId.immatriculation}`
                            : 'Véhicule sera sélectionné lors de la réservation'
                          }
                        </p>
                      </div>
                      {getStatusBadge(contract.statut)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Période de location</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="mr-2 h-4 w-4" />
                          Du {new Date(contract.dateDebut).toLocaleDateString('fr-FR')}
                          au {new Date(contract.dateFin).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Montant</h4>
                        <p className="text-lg font-semibold text-blue-600">
                          {contract.montantTotal} €
                        </p>
                        <p className="text-sm text-gray-600">
                          Acompte: {contract.acompteVerse} €
                        </p>
                      </div>
                    </div>

                    {contract.conditionsSpeciales && (
                      <div className="mb-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <h4 className="font-medium mb-2 text-gray-900">Conditions spéciales</h4>
                        <p className="text-sm text-gray-700">{contract.conditionsSpeciales}</p>
                      </div>
                    )}

                    {contract.statut === 'Approved' && contract.dateValidation && (
                      <div className="mb-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm flex items-start gap-3">
                        <div className="w-1 h-10 bg-green-500 rounded" aria-hidden />
                        <div>
                          <p className="text-sm text-gray-900 font-medium">Contrat approuvé</p>
                          <p className="text-sm text-gray-700">
                            ✅ Approuvé le {new Date(contract.dateValidation).toLocaleDateString('fr-FR')}
                            {contract.validePar && ` par ${contract.validePar.prenom} ${contract.validePar.nom}`}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {contract.statut === 'Approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadContract(contract._id)}
                          disabled={downloadingId === contract._id}
                          className={downloadingId === contract._id ? 'opacity-70' : ''}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {downloadingId === contract._id ? 'Téléchargement...' : 'Télécharger le reçu'}
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </DashboardLayout>
  );
}
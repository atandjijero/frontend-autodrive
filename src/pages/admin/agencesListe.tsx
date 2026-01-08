import { useEffect, useState } from "react";
import { getAgencies, deleteAgency, toggleAgencyActive, resolveUrl } from "@/api/apiClient";
import type { Agency } from "@/api/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import {
  IconEdit,
  IconTrash,
  IconDownload,
  IconCheck,
  IconX,
  IconPlus,
  IconMapPin,
  IconPhone,
  IconMail,
  IconUser,
  IconAlertCircle,
  IconRefresh,
  IconDotsVertical
} from "@tabler/icons-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

export default function AgencesListe() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgencies = () => {
    getAgencies()
      .then((res) => {
        setAgencies(res.data.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des agences :", err);
        setError("Impossible de charger les agences.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleDelete = async (agency: Agency) => {
    const agencyId = agency.id || agency._id;
    if (!agencyId) {
      toast.error("ID de l'agence manquant");
      return;
    }
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette agence ?")) {
      try {
        await deleteAgency(agencyId);
        toast.success("Agence supprimée avec succès");
        fetchAgencies(); // Recharger la liste
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        toast.error("Erreur lors de la suppression de l'agence");
      }
    }
  };

  const handleToggleActive = async (agency: Agency) => {
    const agencyId = agency.id || agency._id;
    if (!agencyId) {
      toast.error("ID de l'agence manquant");
      return;
    }
    try {
      await toggleAgencyActive(agencyId);
      toast.success("Statut de l'agence modifié");
      fetchAgencies(); // Recharger la liste
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err);
      toast.error("Erreur lors du changement de statut");
    }
  };

  const handleExportPdf = async (agency: Agency) => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Add logo if available
      if (agency.logo) {
        const logoUrl = resolveUrl(agency.logo);
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = logoUrl;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 10, yPosition, 50, 50);
          yPosition += 60; // Space below logo
        } catch (error) {
          console.warn('Could not load logo:', error);
          yPosition += 10;
        }
      }

      // Add agency details
      doc.setFontSize(18);
      doc.text(`Agence: ${agency.name}`, 10, yPosition);
      yPosition += 20;

      doc.setFontSize(12);
      doc.text(`Adresse: ${agency.address}, ${agency.city}, ${agency.postalCode}, ${agency.country}`, 10, yPosition);
      yPosition += 10;

      doc.text(`Téléphone: ${agency.phone}`, 10, yPosition);
      yPosition += 10;

      doc.text(`Email: ${agency.email}`, 10, yPosition);
      yPosition += 10;

      if (agency.manager) {
        doc.text(`Manager: ${agency.manager}`, 10, yPosition);
        yPosition += 10;
      }

      if (agency.description) {
        doc.text(`Description: ${agency.description}`, 10, yPosition);
        yPosition += 10;
      }

      doc.text(`Statut: ${agency.isActive ? 'Actif' : 'Inactif'}`, 10, yPosition);

      // Save the PDF
      doc.save(`agence-${agency.name.replace(/\s+/g, '-')}.pdf`);
      toast.success("PDF exporté avec succès");
    } catch (err) {
      console.error("Erreur lors de l'export PDF :", err);
      toast.error("Erreur lors de l'export PDF");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pl-4 md:pl-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-16" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pl-4 md:pl-6">
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAgencies}
              className="ml-4"
            >
              <IconRefresh className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (agencies.length === 0) {
    return (
      <div className="text-center py-12 pl-4 md:pl-6">
        <IconMapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune agence trouvée</h3>
        <p className="text-gray-500 mb-6">Commencez par créer votre première agence.</p>
        <Button asChild>
          <Link to="/admin/agences/ajouter">
            <IconPlus className="h-4 w-4 mr-2" />
            Ajouter une agence
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pl-4 md:pl-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agences</h1>
          <p className="text-muted-foreground">
            Gérez vos agences et leurs informations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/agences/importer">
              <IconDownload className="h-4 w-4 mr-2" />
              Importer
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/agences/ajouter">
              <IconPlus className="h-4 w-4 mr-2" />
              Ajouter une agence
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agencies.map((agency, index) => (
          <Card key={agency.id || agency._id || `agency-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              {agency.logo && (
                <div className="flex justify-center mb-3">
                  <img
                    src={resolveUrl(agency.logo)}
                    alt={`Logo ${agency.name}`}
                    className="h-20 w-20 object-contain rounded-lg border bg-white"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold leading-tight">
                    {agency.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <IconMapPin className="h-3 w-3" />
                    {agency.city}, {agency.country}
                  </div>
                </div>
                <Badge variant={agency.isActive ? "default" : "secondary"} className="shrink-0">
                  {agency.isActive ? (
                    <>
                      <IconCheck className="h-3 w-3 mr-1" />
                      Actif
                    </>
                  ) : (
                    <>
                      <IconX className="h-3 w-3 mr-1" />
                      Inactif
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconMapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{agency.address}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconPhone className="h-4 w-4 shrink-0" />
                  <span>{agency.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconMail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{agency.email}</span>
                </div>
                {agency.manager && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconUser className="h-4 w-4 shrink-0" />
                    <span>{agency.manager}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <IconDotsVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/agences/modifier/${agency.id || agency._id}`} className="cursor-pointer">
                        <IconEdit className="h-4 w-4 mr-2" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleActive(agency)}>
                      {agency.isActive ? (
                        <>
                          <IconX className="h-4 w-4 mr-2" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <IconCheck className="h-4 w-4 mr-2" />
                          Activer
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleExportPdf(agency)}>
                      <IconDownload className="h-4 w-4 mr-2" />
                      Exporter PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(agency)}
                      className="text-destructive focus:text-destructive"
                    >
                      <IconTrash className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
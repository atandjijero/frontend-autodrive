import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { createContract, getVehicles } from "@/api/apiClient";

interface Vehicle {
  _id: string;
  marque: string;
  modele: string;
  immatriculation: string;
  prix: number;
  disponible: boolean;
}

export default function NouveauContrat() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleId: '',
    dateDebut: undefined as Date | undefined,
    dateFin: undefined as Date | undefined,
    montantTotal: '',
    acompteVerse: '',
    conditionsSpeciales: ''
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      // TODO: Implement API call to get available vehicles
      const response = await getVehicles();
      setVehicles(response.data.filter(vehicle => vehicle.disponible));
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
    }
  };

  const calculateTotal = () => {
    if (!formData.dateDebut || !formData.dateFin) return 0;

    // Si aucun véhicule n'est sélectionné, retourner 0 (sera saisi manuellement)
    if (!formData.vehicleId) return 0;

    const vehicle = vehicles.find(v => v._id === formData.vehicleId);
    if (!vehicle) return 0;

    const days = Math.ceil((formData.dateFin.getTime() - formData.dateDebut.getTime()) / (1000 * 60 * 60 * 24));
    return vehicle.prix * days;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.dateDebut || !formData.dateFin) {
        throw new Error('Les dates de début et fin sont requises');
      }

      const contractData = {
        vehicleId: formData.vehicleId || undefined,
        dateDebut: formData.dateDebut.toISOString(),
        dateFin: formData.dateFin.toISOString(),
        montantTotal: formData.vehicleId ? calculateTotal() : parseFloat(formData.montantTotal),
        acompteVerse: formData.acompteVerse ? parseFloat(formData.acompteVerse) : undefined,
        conditionsSpeciales: formData.conditionsSpeciales || undefined,
      };

      // TODO: Uncomment when API is ready
      console.log('Creating contract with data:', contractData);
      await createContract(contractData);
      console.log('Contract created successfully');

      console.log('Contract data:', contractData);
      navigate('/entreprise/contrats');
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedVehicle = vehicles.find(v => v._id === formData.vehicleId);

  return (
    <DashboardLayout>
      <Sidebar role="entreprise" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Nouveau Contrat</h1>
        </header>

        <main className="flex-1 space-y-6 p-6 container mx-auto max-w-4xl bg-background">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Nouveau Contrat de Location</h1>
            <p className="text-gray-600 mt-2">
              Créez un contrat de location. Le véhicule peut être sélectionné maintenant ou lors de la réservation.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Sélection du véhicule (optionnel) */}
              <Card>
                <CardHeader>
                  <CardTitle>Sélection du véhicule (optionnel)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Véhicule disponible</Label>
                    <Select
                      value={formData.vehicleId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez un véhicule (optionnel)" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle._id} value={vehicle._id}>
                            {vehicle.marque} {vehicle.modele} - {vehicle.immatriculation} ({vehicle.prix}€/jour)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedVehicle && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium">Véhicule sélectionné</h4>
                      <p className="text-sm text-gray-600">
                        {selectedVehicle.marque} {selectedVehicle.modele} - {selectedVehicle.immatriculation}
                      </p>
                      <p className="text-sm text-gray-600">
                        Prix journalier: {selectedVehicle.prix} €
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dates de location */}
              <Card>
                <CardHeader>
                  <CardTitle>Période de location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de début</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !formData.dateDebut && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dateDebut ? (
                              format(formData.dateDebut, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.dateDebut}
                            onSelect={(date) => setFormData(prev => ({ ...prev, dateDebut: date }))}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Date de fin</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !formData.dateFin && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dateFin ? (
                              format(formData.dateFin, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.dateFin}
                            onSelect={(date) => setFormData(prev => ({ ...prev, dateFin: date }))}
                            disabled={(date) => !formData.dateDebut || date <= formData.dateDebut}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Montant et acompte */}
              <Card>
                <CardHeader>
                  <CardTitle>Montant et paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="montantTotal">
                        {formData.vehicleId ? 'Montant total calculé' : 'Montant total (à saisir manuellement)'}
                      </Label>
                      {formData.vehicleId ? (
                        <Input
                          id="montantTotal"
                          value={`${calculateTotal()} €`}
                          readOnly
                          className="bg-gray-50"
                        />
                      ) : (
                        <Input
                          id="montantTotal"
                          type="number"
                          placeholder="Montant total"
                          value={formData.montantTotal}
                          onChange={(e) => setFormData(prev => ({ ...prev, montantTotal: e.target.value }))}
                          required
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="acompteVerse">Acompte versé (optionnel)</Label>
                      <Input
                        id="acompteVerse"
                        type="number"
                        placeholder="0"
                        value={formData.acompteVerse}
                        onChange={(e) => setFormData(prev => ({ ...prev, acompteVerse: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conditions spéciales */}
              <Card>
                <CardHeader>
                  <CardTitle>Conditions spéciales (optionnel)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="conditionsSpeciales">Conditions spéciales</Label>
                    <Textarea
                      id="conditionsSpeciales"
                      placeholder="Ex: Kilométrage illimité, assurance complémentaire..."
                      value={formData.conditionsSpeciales}
                      onChange={(e) => setFormData(prev => ({ ...prev, conditionsSpeciales: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Boutons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/entreprise/contrats')}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.dateDebut || !formData.dateFin || (!formData.vehicleId && !formData.montantTotal)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Création...' : 'Créer le contrat'}
                </Button>
              </div>
            </div>
          </form>
        </main>
      </SidebarInset>
    </DashboardLayout>
  );
}
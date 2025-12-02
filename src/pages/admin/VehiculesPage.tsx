import VehiculesListe from "@/pages/admin/vehiculesListe";

export default function VehiculesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Véhicules 🚗</h1>
      <p className="mb-6">Gestion des véhicules (ajout, modification, suppression)...</p>

      {/* Ici on affiche la liste */}
      <VehiculesListe />
    </div>
  );
}

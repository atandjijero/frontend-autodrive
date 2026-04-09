import { useEffect, useMemo, useRef, useState } from "react";
import { getReservations, updateReservationStatus } from "@/api/apiClient";
import type { Reservation } from "@/api/apiClient";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { XCircle, Clock, Check, CreditCard } from "lucide-react";

export default function ReservationDashboard() {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Pour export PDF via print d'une section
  const printRef = useRef<HTMLDivElement | null>(null);

  const fetchReservations = () => {
    setLoading(true);
    getReservations()
      .then((res) => setReservations(res.data))
      .catch(() => setError("Impossible de charger les réservations."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const total = reservations.length;
  const enAttente = reservations.filter((r) => r.statut === "en_attente").length;
  const validees = reservations.filter((r) => r.statut === "validee").length;
  const enCours = reservations.filter((r) => r.statut === "en_cours").length;
  const terminees = reservations.filter((r) => r.statut === "terminee").length;
  const annulees = reservations.filter((r) => r.statut === "annulee").length;

  const monthlyData = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString("fr", { month: "short" }),
        count: reservations.filter(
          (r) => new Date(r.dateDebut).getMonth() === i
        ).length,
      })),
    [reservations]
  );


  const statusData = [
    { name: "En attente", value: enAttente },
    { name: "Validées", value: validees },
    { name: "En cours", value: enCours },
    { name: "Terminées", value: terminees },
    { name: "Annulées", value: annulees },
  ];

  const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#22c55e", "#ef4444"];

  // ---------------- ACTIONS ----------------

  const handleValidate = async (id: string | number) => {
    try {
      await updateReservationStatus(id, "validee");
      toast.success("Réservation validée avec succès ! Le client peut maintenant payer.");
      fetchReservations();
    } catch (err) {
      toast.error("Erreur lors de la validation de la réservation.");
    }
  };

  const handleCancel = async (id: string | number) => {
    try {
      await updateReservationStatus(id, "annulee");
      toast.success("Réservation annulée.");
      fetchReservations();
    } catch (err) {
      toast.error("Erreur lors de l'annulation.");
    }
  };

  // ---------------- EXPORTS ----------------

  const buildFlatReservations = () =>
    reservations.map((r) => ({
      Numero: r.numeroReservation,
      Vehicule: r.vehicle
        ? `${r.vehicle.marque} ${r.vehicle.modele}`
        : "Véhicule supprimé",
      Immatriculation: r.vehicle?.immatriculation ?? "",
      Client: r.client ? `${r.client.nom} ${r.client.prenom}` : "",
      Email: r.client?.email ?? "",
      Telephone: r.client?.telephone ?? "",
      DateDebut: new Date(r.dateDebut).toLocaleString(),
      DateFin: new Date(r.dateFin).toLocaleString(),
      Statut: r.statut,
      MontantParJour: r.vehicle?.prix ?? "",
    }));

  const handleExportCSV = () => {
    const data = buildFlatReservations();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reservations");
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "reservations.csv");
  };

  const handleExportExcel = () => {
    const data = buildFlatReservations();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reservations");
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "reservations.xlsx");
  };

  const handleExportPDF = () => {
    if (!printRef.current) return;

    const content = printRef.current.innerHTML;
    const original = document.body.innerHTML;

    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  };

  if (loading && reservations.length === 0) return <p className="text-muted-foreground p-6 text-center">Chargement des réservations...</p>;
  if (error) return <p className="text-destructive p-6 text-center">{error}</p>;

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestion des Réservations</h2>
          <p className="text-muted-foreground">Suivez et validez les réservations des clients.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Connecté en tant que: <span className="font-semibold">{user?.role || 'Non connecté'}</span>
            {isAdmin && <span className="ml-2 text-emerald-600">✓ Admin</span>}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={fetchReservations}>
            Actualiser
          </Button>
        </div>
      </div>

      <Separator />

      <div ref={printRef} className="space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{total}</CardContent>
          </Card>
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400 uppercase font-bold">À Valider</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-amber-600 dark:text-amber-400">{enAttente}</CardContent>
          </Card>
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase font-bold">Validées</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{validees}</CardContent>
          </Card>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase font-bold">Payées</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-blue-600 dark:text-blue-400">{enCours}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Terminées</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{terminees}</CardContent>
          </Card>
          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400 uppercase font-bold">Annulées</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-red-600 dark:text-red-400">{annulees}</CardContent>
          </Card>
        </div>

        {/* GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Volume mensuel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des statuts</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* TABLEAU RÉSERVATIONS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Liste des réservations</CardTitle>
            {loading && <Clock className="animate-spin h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-3 font-semibold">Référence</th>
                    <th className="p-3 font-semibold">Véhicule</th>
                    <th className="p-3 font-semibold">Client</th>
                    <th className="p-3 font-semibold">Période</th>
                    <th className="p-3 font-semibold">Statut</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations
                    .filter(r => !statusFilter || r.statut === statusFilter)
                    .sort((a, b) => new Date(b.createdAt || b.dateDebut).getTime() - new Date(a.createdAt || a.dateDebut).getTime())
                    .slice(0, itemsToShow)
                    .map((res) => (
                      <tr key={res.id} className="border-b hover:bg-muted/50 transition-colors group">
                        <td className="p-3 font-mono text-xs font-bold text-primary">
                          {res.numeroReservation}
                        </td>
                        <td className="p-3 items-center gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={res.vehicle?.photos?.[0] || "/placeholder.png"}
                              alt="vehicule"
                              className="w-12 h-10 rounded object-cover shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-sm">
                                {res.vehicle
                                  ? `${res.vehicle.marque} ${res.vehicle.modele}`
                                  : "Véhicule supprimé"}
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                {res.vehicle?.immatriculation}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <p className="font-semibold text-sm">
                            {res.client
                              ? `${res.client.nom} ${res.client.prenom}`
                              : "Client inconnu"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {res.client?.email}
                          </p>
                        </td>

                        <td className="p-3 text-xs">
                          <div className="flex flex-col">
                            <span>{new Date(res.dateDebut).toLocaleDateString()}</span>
                            <span className="text-muted-foreground"> au {new Date(res.dateFin).toLocaleDateString()}</span>
                          </div>
                        </td>

                        <td className="p-3 text-xs">
                          <Badge
                            variant={
                              res.statut === "en_cours" ? "default" :
                                res.statut === "validee" ? "outline" :
                                  res.statut === "en_attente" ? "secondary" :
                                    res.statut === "terminee" ? "outline" : "destructive"
                            }
                            className={
                              res.statut === "validee" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" :
                                res.statut === "en_attente" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" : ""
                            }
                          >
                            {res.statut === "en_attente" ? "En attente" :
                             res.statut === "validee" ? "Validée" :
                             res.statut === "en_cours" ? "En cours" :
                             res.statut === "terminee" ? "Terminée" :
                             res.statut === "annulee" ? "Annulée" : res.statut}
                          </Badge>
                        </td>

                        {/* ACTIONS COLUMN */}
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2 transition-opacity">
                            {isAdmin ? (
                              <>
                                {res.statut === "en_attente" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-200"
                                    onClick={() => handleValidate(res.id)}
                                    title="Valider la réservation"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                {(res.statut === "en_attente" || res.statut === "validee") && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 border-destructive/20"
                                    onClick={() => handleCancel(res.id)}
                                    title="Annuler"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            ) : (
                              <>
                                {res.statut === "validee" && (
                                  <Link to={`/paiement/${res.id}`}>
                                    <Button
                                      size="sm"
                                      className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                    >
                                      <CreditCard className="h-3 w-3" />
                                      Payer
                                    </Button>
                                  </Link>
                                )}
                                {res.statut !== "validee" && (
                                  <span className="text-xs text-muted-foreground">En attente de validation</span>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-muted-foreground italic">
                        Aucune réservation trouvée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {reservations.length > itemsToShow && (
              <div className="flex justify-center mt-6 pt-4 border-t border-dashed">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-8 font-semibold text-primary hover:bg-primary/5 border-primary/20"
                  onClick={() => setItemsToShow(prev => prev + 5)}
                >
                  Voir plus de réservations ({reservations.length - itemsToShow} restantes)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

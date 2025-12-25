import { useEffect, useMemo, useRef, useState } from "react";
import { getReservations } from "@/api/apiClient";
import type { Reservation } from "@/api/apiClient";

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

export default function ReservationDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pour export PDF via print d'une section
  const printRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getReservations()
      .then((res) => setReservations(res.data))
      .catch(() => setError("Impossible de charger les réservations."))
      .finally(() => setLoading(false));
  }, []);

  const total = reservations.length;
  const enCours = reservations.filter((r) => r.statut === "en cours").length;
  const terminees = reservations.filter((r) => r.statut === "terminée").length;
  const annulees = reservations.filter((r) => r.statut === "annulée").length;

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

  const vehicleData = useMemo(() => {
    const vehicleCount: Record<string, number> = {};
    reservations.forEach((r) => {
      if (!r.vehicleId) return;
      const name = `${r.vehicleId.marque} ${r.vehicleId.modele}`;
      vehicleCount[name] = (vehicleCount[name] || 0) + 1;
    });
    return Object.entries(vehicleCount).map(([vehicle, count]) => ({
      vehicle,
      count,
    }));
  }, [reservations]);

  const statusData = [
    { name: "En cours", value: enCours },
    { name: "Terminées", value: terminees },
    { name: "Annulées", value: annulees },
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#ef4444"];

  // ---------------- EXPORTS ----------------

  const buildFlatReservations = () =>
    reservations.map((r) => ({
      Numero: r.numeroReservation,
      Vehicule: r.vehicleId
        ? `${r.vehicleId.marque} ${r.vehicleId.modele}`
        : "Véhicule supprimé",
      Immatriculation: r.vehicleId?.immatriculation ?? "",
      Client: r.clientId ? `${r.clientId.nom} ${r.clientId.prenom}` : "",
      Email: r.clientId?.email ?? "",
      Telephone: r.clientId?.telephone ?? "",
      DateDebut: new Date(r.dateDebut).toLocaleString(),
      DateFin: new Date(r.dateFin).toLocaleString(),
      Statut: r.statut,
      MontantParJour: r.vehicleId?.prix ?? "",
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

  if (loading) return <p className="text-muted-foreground">Chargement du dashboard...</p>;
  if (error) return <p className="text-destructive">{error}</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-foreground">Dashboard des Réservations</h2>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            Export PDF
          </Button>
        </div>
      </div>

      <Separator />

      <div ref={printRef} className="space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{total}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>En cours</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{enCours}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Terminées</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {terminees}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Annulées</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{annulees}</CardContent>
          </Card>
        </div>

        {/* GRAPHIQUE PAR MOIS */}
        <Card>
          <CardHeader>
            <CardTitle>Réservations par mois</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* VEHICULES LES PLUS RÉSERVÉS */}
        <Card>
          <CardHeader>
            <CardTitle>Véhicules les plus réservés</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleData}>
                <XAxis dataKey="vehicle" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RÉPARTITION DES STATUTS */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des statuts</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* TABLEAU DERNIÈRES RÉSERVATIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Dernières réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Véhicule</th>
                    <th className="p-2">Client</th>
                    <th className="p-2">Période</th>
                    <th className="p-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.slice(0, 10).map((res) => (
                    <tr key={res._id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-2 flex items-center gap-3">
                        <img
                          src={res.vehicleId?.photos?.[0] || "/placeholder.png"}
                          alt="vehicule"
                          className="w-16 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold">
                            {res.vehicleId
                              ? `${res.vehicleId.marque} ${res.vehicleId.modele}`
                              : "Véhicule supprimé"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {res.vehicleId?.immatriculation}
                          </p>
                        </div>
                      </td>

                      <td className="p-2">
                        <p className="font-semibold">
                          {res.clientId
                            ? `${res.clientId.nom} ${res.clientId.prenom}`
                            : "Client inconnu"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {res.clientId?.email}
                        </p>
                      </td>

                      <td className="p-2">
                        {new Date(res.dateDebut).toLocaleDateString()} →{" "}
                        {new Date(res.dateFin).toLocaleDateString()}
                      </td>

                      <td className="p-2">
                        <Badge
                          variant={
                            res.statut === "en cours"
                              ? "secondary"
                              : res.statut === "terminée"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {res.statut}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

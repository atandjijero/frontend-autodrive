import { useEffect, useState } from "react";
import { getPaiements } from "@/api/apiClient";
import type { Paiement } from "@/api/apiClient";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
} from "recharts";


export default function PaiementsList() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [filteredPaiements, setFilteredPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [dateFilter, setDateFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Stats
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalPaiements, setTotalPaiements] = useState(0);

  // Graph data
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [monthlyPaiements, setMonthlyPaiements] = useState<any[]>([]);
  const [revenueByVehicleChart, setRevenueByVehicleChart] = useState<any[]>([]);

  // Vehicles list
  const [vehicles, setVehicles] = useState<string[]>([]);

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const res = await getPaiements();
        const data = res.data;

        setPaiements(data);
        setFilteredPaiements(data);
        setTotalPaiements(data.length);

        // Clients uniques
        const uniqueClients = new Set(data.map((p) => p.email));
        setTotalClients(uniqueClients.size);

        // Total revenue
        const revenue = data
          .filter((p) => p.statut === "reussi")
          .reduce((sum, p) => sum + p.montant, 0);
        setTotalRevenue(revenue);

        // List of vehicles
        const vehList = Array.from(
          new Set(
            data
              .filter((p) => p.reservationId?.vehicleId)
              .map(
                (p) =>
                  `${p.reservationId.vehicleId.marque} ${p.reservationId.vehicleId.modele}`
              )
          )
        );
        setVehicles(vehList);

        // Graph: revenue par mois
        const revenueByMonth: any = {};
        const paiementsByMonth: any = {};
        const revenueByVehicle: any = {};

        data.forEach((p) => {
          const date = new Date(p.createdAt);
          const month = date.toLocaleString("fr-FR", { month: "short" });

          if (!revenueByMonth[month]) revenueByMonth[month] = 0;
          if (!paiementsByMonth[month]) paiementsByMonth[month] = 0;

          if (p.statut === "reussi") {
            revenueByMonth[month] += p.montant;
          }

          paiementsByMonth[month] += 1;

          // Revenu par véhicule
          if (p.statut === "reussi" && p.reservationId?.vehicleId) {
            const veh = p.reservationId.vehicleId;
            const key = `${veh.marque} ${veh.modele}`;

            if (!revenueByVehicle[key]) revenueByVehicle[key] = 0;
            revenueByVehicle[key] += p.montant;
          }
        });

        setMonthlyRevenue(
          Object.keys(revenueByMonth).map((m) => ({
            month: m,
            revenue: revenueByMonth[m],
          }))
        );

        setMonthlyPaiements(
          Object.keys(paiementsByMonth).map((m) => ({
            month: m,
            count: paiementsByMonth[m],
          }))
        );

        setRevenueByVehicleChart(
          Object.keys(revenueByVehicle).map((v) => ({
            vehicle: v,
            revenue: revenueByVehicle[v],
          }))
        );
      } catch (err) {
        setError("Impossible de charger les paiements.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaiements();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...paiements];

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();

      filtered = filtered.filter((p) => {
        const d = new Date(p.createdAt);

        if (dateFilter === "day")
          return d.toDateString() === now.toDateString();

        if (dateFilter === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return d >= weekAgo;
        }

        if (dateFilter === "month")
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );

        if (dateFilter === "year")
          return d.getFullYear() === now.getFullYear();

        return true;
      });
    }

    // Filter by vehicle
    if (vehicleFilter !== "all") {
      filtered = filtered.filter((p) => {
        const veh = p.reservationId?.vehicleId;
        if (!veh) return false;
        const name = `${veh.marque} ${veh.modele}`;
        return name === vehicleFilter;
      });
    }

    setFilteredPaiements(filtered);
    setPage(1);
  }, [dateFilter, vehicleFilter, paiements]);

  //  Pagination
  const start = (page - 1) * itemsPerPage;
  const paginated = filteredPaiements.slice(start, start + itemsPerPage);

  // Export CSV
  const exportCSV = () => {
    const rows = filteredPaiements.map((p) => ({
      Client: p.nom,
      Email: p.email,
      Montant: p.montant,
      Statut: p.statut,
      Reservation: p.reservationId?.numeroReservation || "Aucune",
      Date: new Date(p.createdAt).toLocaleDateString("fr-FR"),
    }));

    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((r) => Object.values(r).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "paiements.csv";
    a.click();
  };

    //  Export Excel
const exportExcel = () => {
  const rows = filteredPaiements.map((p) => ({
    Client: p.nom,
    Email: p.email,
    Montant: p.montant,
    Statut: p.statut,
    Reservation: p.reservationId?.numeroReservation || "Aucune",
    Date: new Date(p.createdAt).toLocaleDateString("fr-FR"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Paiements");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "paiements.xlsx");
};

//  Export PDF
const exportPDF = () => {
  const doc = new jsPDF();

  doc.text("Liste des paiements", 14, 15);

  const rows = filteredPaiements.map((p) => [
    p.nom,
    p.email,
    p.montant + " €",
    p.statut,
    p.reservationId?.numeroReservation || "Aucune",
    new Date(p.createdAt).toLocaleDateString("fr-FR"),
  ]);

  doc.autoTable({
    head: [["Client", "Email", "Montant", "Statut", "Réservation", "Date"]],
    body: rows,
    startY: 25,
  });

  doc.save("paiements.pdf");
};

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center mt-4 text-lg">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
  <h1 className="text-3xl font-bold">Dashboard Paiements</h1>

  <div className="flex gap-3">
    <Button variant="outline" onClick={exportCSV}>CSV</Button>
    <Button variant="outline" onClick={exportExcel}>Excel</Button>
    <Button variant="outline" onClick={exportPDF}>PDF</Button>
  </div>
</div>


      {/* Filters */}
      <div className="flex gap-4">
        <select
          className="border rounded px-3 py-2"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">Toutes les dates</option>
          <option value="day">Aujourd’hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>

        <select
          className="border rounded px-3 py-2"
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
        >
          <option value="all">Tous les véhicules</option>
          {vehicles.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 shadow-md">
          <CardTitle className="text-sm text-gray-500">Revenu total</CardTitle>
          <p className="text-3xl font-bold mt-2">{totalRevenue} €</p>
        </Card>

        <Card className="p-5 shadow-md">
          <CardTitle className="text-sm text-gray-500">Clients uniques</CardTitle>
          <p className="text-3xl font-bold mt-2">{totalClients}</p>
        </Card>

        <Card className="p-5 shadow-md">
          <CardTitle className="text-sm text-gray-500">Paiements</CardTitle>
          <p className="text-3xl font-bold mt-2">{totalPaiements}</p>
        </Card>
      </div>

      {/* Graphique revenu mensuel */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Revenu mensuel</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Graphique nombre de paiements */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Nombre de paiements par mois</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyPaiements}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Graphique camembert */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Répartition des paiements</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "Réussi", value: paiements.filter(p => p.statut === "reussi").length },
                  { name: "Échoué", value: paiements.filter(p => p.statut === "echoue").length },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#4f46e5"
                dataKey="value"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/*  Graphique revenu par véhicule */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Revenu par véhicule</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByVehicleChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/*  Tableau Paiements */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Liste des paiements</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Réservation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.nom}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.montant} €</TableCell>
                    <TableCell>
                      <Badge variant={p.statut === "reussi" ? "default" : "destructive"}>
                        {p.statut === "reussi" ? "Réussi" : "Échoué"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {p.reservationId?.numeroReservation || "Aucune"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">Voir</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Précédent
            </Button>

            <Button
              disabled={start + itemsPerPage >= filteredPaiements.length}
              onClick={() => setPage(page + 1)}
            >
              Suivant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

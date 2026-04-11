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
  Cell,
  Legend,
} from "recharts";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


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

  // Modal state
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);

  const monthOrder = [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
  const [averagePayment, setAveragePayment] = useState(0);

  const statusColors = ["#22c55e", "#f59e0b", "#ef4444"];

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const res = await getPaiements();
        const data = res.data;
        
        // Debug: Log the actual structure
        console.log("Raw API Response:", data);
        if (data && data.length > 0) {
          console.log("First paiement:", data[0]);
          console.log("First reservation:", data[0].reservation);
          console.log("First client:", data[0].reservation?.client);
        }

        // Enhance paiements with client info - now stored directly on paiement
        const enhancedData: Paiement[] = data.map((p) => {
          // Use direct fields from paiement record, fallback to nested if needed
          const nom = p.nom || p.reservation?.client?.nom || "Client inconnu";
          const email = p.email || p.reservation?.client?.email || "";
          
          return {
            ...p,
            nom,
            email,
          } as Paiement;
        });

        setPaiements(enhancedData);
        setFilteredPaiements(enhancedData);
        setTotalPaiements(enhancedData.length);

        // Clients uniques - count unique non-empty emails
        const uniqueClients = new Set(
          enhancedData
            .map((p) => p.email)
            .filter((email) => email && email.trim() !== "" && email !== "Client inconnu")
        );
        setTotalClients(uniqueClients.size);

        // Total revenue
        const revenue = enhancedData
          .filter((p) => p.statut === "reussi")
          .reduce((sum, p) => sum + p.montant, 0);
        setTotalRevenue(revenue);

        // List of vehicles
        const vehList = Array.from(
          new Set(
            enhancedData
              .filter((p) => p.reservation?.vehicle)
              .map(
                (p) =>
                  `${p.reservation.vehicle.marque} ${p.reservation.vehicle.modele}`
              )
          )
        );
        setVehicles(vehList);

        // Graph: revenue par mois
        const revenueByMonth: any = {};
        const paiementsByMonth: any = {};
        const revenueByVehicle: any = {};

        enhancedData.forEach((p) => {
          const date = new Date(p.createdAt);
          const month = date.toLocaleString("fr-FR", { month: "short" });

          if (!revenueByMonth[month]) revenueByMonth[month] = 0;
          if (!paiementsByMonth[month]) paiementsByMonth[month] = 0;

          if (p.statut === "reussi") {
            revenueByMonth[month] += p.montant;
          }

          paiementsByMonth[month] += 1;

          // Revenu par véhicule
          if (p.statut === "reussi" && p.reservation?.vehicle) {
            const veh = p.reservation.vehicle;
            const key = `${veh.marque} ${veh.modele}`;

            if (!revenueByVehicle[key]) revenueByVehicle[key] = 0;
            revenueByVehicle[key] += p.montant;
          }
        });

        setMonthlyRevenue(
          Object.keys(revenueByMonth)
            .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
            .map((m) => ({
              month: m,
              revenue: revenueByMonth[m],
            }))
        );

        setMonthlyPaiements(
          Object.keys(paiementsByMonth)
            .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
            .map((m) => ({
              month: m,
              count: paiementsByMonth[m],
            }))
        );

        setRevenueByVehicleChart(
          Object.keys(revenueByVehicle)
            .sort((a, b) => revenueByVehicle[b] - revenueByVehicle[a])
            .map((v) => ({
              vehicle: v,
              revenue: revenueByVehicle[v],
            }))
        );

        setStatusDistribution([
          { name: "Réussi", value: enhancedData.filter((p) => p.statut === "reussi").length },
          { name: "Échoué", value: enhancedData.filter((p) => p.statut === "echoue").length },
        ]);

        setAveragePayment(enhancedData.length > 0 ? Math.round(revenue / enhancedData.length) : 0);
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
        const veh = p.reservation?.vehicle;
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

  console.log("Pagination debug:", {
    page,
    itemsPerPage,
    start,
    filteredPaiementsLength: filteredPaiements.length,
    paginatedLength: paginated.length,
    hasNextPage: start + itemsPerPage < filteredPaiements.length,
    hasPrevPage: page > 1
  });

  // Export CSV
  const exportCSV = () => {
    const rows = filteredPaiements.map((p) => ({
      Client: p.nom,
      Email: p.email,
      Montant: p.montant,
      Statut: p.statut,
      Reservation: p.reservation?.numeroReservation || "Aucune",
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
    Reservation: p.reservation?.numeroReservation || "Aucune",
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
    p.reservation?.numeroReservation || "Aucune",
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
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Paiements</h1>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="text-xs sm:text-sm">
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportExcel} className="text-xs sm:text-sm">
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportPDF} className="text-xs sm:text-sm">
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <select
            className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">Toutes les dates</option>
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>

          <select
            className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
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
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 shadow-md">
          <CardTitle className="text-sm text-gray-500">Revenu total</CardTitle>
          <p className="text-2xl sm:text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</p>
        </Card>

        <Card className="p-4 sm:p-5 shadow-md">
          <CardTitle className="text-sm text-gray-500">Clients uniques</CardTitle>
          <p className="text-2xl sm:text-3xl font-bold mt-2">{totalClients}</p>
        </Card>

        <Card className="p-4 sm:p-5 shadow-md">
          <CardTitle className="text-sm text-gray-500">Paiements</CardTitle>
          <p className="text-2xl sm:text-3xl font-bold mt-2">{totalPaiements}</p>
        </Card>

        <Card className="p-4 sm:p-5 shadow-md">
          <CardTitle className="text-sm text-gray-500">Moyenne par paiement</CardTitle>
          <p className="text-2xl sm:text-3xl font-bold mt-2">{formatCurrency(averagePayment)}</p>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 lg:gap-4">
        {/* Graphique revenu mensuel */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Revenu mensuel</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="top" height={24} />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique nombre de paiements */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Nombre de paiements par mois</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPaiements}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `${value} paiements`} />
                <Legend verticalAlign="top" height={24} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]}>
                  {monthlyPaiements.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#10b981" : "#22c55e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Graphique camembert */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Répartition des paiements</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#4f46e5"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusDistribution.map((_, index) => (
                    <Cell key={`slice-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} paiements`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique revenu par véhicule */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Revenu par véhicule</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByVehicleChart.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vehicle" height={80} interval={0} tick={{ dy: 8, fontSize: 10 }} angle={-45} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="top" height={24} />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]}>
                  {revenueByVehicleChart.slice(0, 8).map((_, index) => (
                    <Cell key={`veh-${index}`} fill={index % 2 === 0 ? "#f59e0b" : "#fb923c"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tableau Paiements */}
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Liste des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Version mobile - Cartes */}
          <div className="block md:hidden space-y-4">
            {paginated.map((p) => (
              <Card key={p.id} className="p-4 border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-base">{p.nom}</h4>
                    <p className="text-sm text-gray-600">{p.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{p.montant} €</p>
                    <Badge variant={p.statut === "reussi" ? "default" : "destructive"} className="text-xs">
                      {p.statut === "reussi" ? "Réussi" : "Échoué"}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Réservation: {p.reservation?.numeroReservation || "Aucune"}</span>
                  <span>{new Date(p.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="mt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedPaiement(p)}
                      >
                        Voir détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md sm:max-w-2xl mx-4">
                      <DialogHeader>
                        <DialogTitle className="text-lg">Détails du paiement #{selectedPaiement?.id}</DialogTitle>
                      </DialogHeader>
                      {selectedPaiement && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">Client</h4>
                              <p>{selectedPaiement.nom}</p>
                              <p className="text-sm text-gray-600">{selectedPaiement.email}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Montant</h4>
                              <p className="text-2xl font-bold">{selectedPaiement.montant} €</p>
                              <Badge variant={selectedPaiement.statut === "reussi" ? "default" : "destructive"}>
                                {selectedPaiement.statut === "reussi" ? "Réussi" : "Échoué"}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">Méthode de paiement</h4>
                              <p>{selectedPaiement.methodePaiement}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Date</h4>
                              <p>{new Date(selectedPaiement.createdAt).toLocaleDateString("fr-FR")}</p>
                            </div>
                          </div>

                          {selectedPaiement.reservation && (
                            <div>
                              <h4 className="font-semibold">Réservation associée</h4>
                              <p>N° {selectedPaiement.reservation.numeroReservation}</p>
                              <p className="text-sm text-gray-600">
                                Véhicule: {selectedPaiement.reservation.vehicle?.marque} {selectedPaiement.reservation.vehicle?.modele}
                              </p>
                              <p className="text-sm text-gray-600">
                                Période: {new Date(selectedPaiement.reservation.dateDebut).toLocaleDateString("fr-FR")} - {new Date(selectedPaiement.reservation.dateFin).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>

          {/* Version desktop - Table */}
          <div className="hidden md:block overflow-x-auto rounded-md border">
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
                  <TableRow key={p.id}>
                    <TableCell>{p.nom}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.montant} €</TableCell>
                    <TableCell>
                      <Badge variant={p.statut === "reussi" ? "default" : "destructive"}>
                        {p.statut === "reussi" ? "Réussi" : "Échoué"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {p.reservation?.numeroReservation || "Aucune"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPaiement(p)}
                          >
                            Voir
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails du paiement #{selectedPaiement?.id}</DialogTitle>
                          </DialogHeader>
                          {selectedPaiement && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Client</h4>
                                  <p>{selectedPaiement.nom}</p>
                                  <p className="text-sm text-gray-600">{selectedPaiement.email}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Montant</h4>
                                  <p className="text-2xl font-bold">{selectedPaiement.montant} €</p>
                                  <Badge variant={selectedPaiement.statut === "reussi" ? "default" : "destructive"}>
                                    {selectedPaiement.statut === "reussi" ? "Réussi" : "Échoué"}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Méthode de paiement</h4>
                                  <p>{selectedPaiement.methodePaiement}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Date</h4>
                                  <p>{new Date(selectedPaiement.createdAt).toLocaleDateString("fr-FR")}</p>
                                </div>
                              </div>

                              {selectedPaiement.reservation && (
                                <div>
                                  <h4 className="font-semibold">Réservation associée</h4>
                                  <p>N° {selectedPaiement.reservation.numeroReservation}</p>
                                  <p className="text-sm text-gray-600">
                                    Véhicule: {selectedPaiement.reservation.vehicle?.marque} {selectedPaiement.reservation.vehicle?.modele}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Période: {new Date(selectedPaiement.reservation.dateDebut).toLocaleDateString("fr-FR")} - {new Date(selectedPaiement.reservation.dateFin).toLocaleDateString("fr-FR")}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <Button
              disabled={page === 1}
              onClick={() => {
                console.log("Previous button clicked, current page:", page);
                setPage(page - 1);
              }}
              size="sm"
              className="w-full sm:w-auto"
            >
              Précédent
            </Button>

            <span className="text-sm text-gray-600 text-center">
              Page {page} sur {Math.ceil(filteredPaiements.length / itemsPerPage)}
            </span>

            <Button
              disabled={start + itemsPerPage >= filteredPaiements.length}
              onClick={() => {
                console.log("Next button clicked, current page:", page);
                setPage(page + 1);
              }}
              size="sm"
              className="w-full sm:w-auto"
            >
              Suivant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getClientStats } from "@/api/apiClient";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function DashboardClients() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getClientStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Chargement...</p>;

  //  Données graphiques
  const roleData = [
    { name: "Client", value: stats.totalClientsByRole.client },
    { name: "Entreprise", value: stats.totalClientsByRole.entreprise },
    { name: "Tourist", value: stats.totalClientsByRole.tourist },
  ];

  const COLORS = ["#4ade80", "#60a5fa", "#facc15"];

  const lineData = [
    {
      name: "Activité",
      réservations: stats.clientsWithReservations,
      paiements: stats.clientsWithPayments,
    },
  ];

  //  EXPORT CSV
  const exportCSV = () => {
    const rows = [
      ["Statistique", "Valeur"],
      ["Total Clients", stats.totalClients],
      ["Clients (Client)", stats.totalClientsByRole.client],
      ["Clients (Entreprise)", stats.totalClientsByRole.entreprise],
      ["Clients (Tourist)", stats.totalClientsByRole.tourist],
      ["Clients avec réservations", stats.clientsWithReservations],
      ["Clients avec paiements", stats.clientsWithPayments],
    ];

    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stats_clients.csv";
    a.click();
  };

  //  EXPORT EXCEL
  const exportExcel = () => {
    const data = [
      {
        "Total Clients": stats.totalClients,
        "Client": stats.totalClientsByRole.client,
        "Entreprise": stats.totalClientsByRole.entreprise,
        "Tourist": stats.totalClientsByRole.tourist,
        "Avec Réservations": stats.clientsWithReservations,
        "Avec Paiements": stats.clientsWithPayments,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Stats Clients");
    XLSX.writeFile(workbook, "stats_clients.xlsx");
  };

  //  EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Statistiques Clients", 14, 15);

    const tableData = [
      ["Total Clients", stats.totalClients],
      ["Clients (Client)", stats.totalClientsByRole.client],
      ["Clients (Entreprise)", stats.totalClientsByRole.entreprise],
      ["Clients (Tourist)", stats.totalClientsByRole.tourist],
      ["Clients avec réservations", stats.clientsWithReservations],
      ["Clients avec paiements", stats.clientsWithPayments],
    ];

    autoTable(doc, {
      head: [["Statistique", "Valeur"]],
      body: tableData,
      startY: 25,
    });

    doc.save("stats_clients.pdf");
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Clients</h1>
          <p className="text-muted-foreground">
            Vue d’ensemble des clients, réservations et paiements.
          </p>
        </div>

        {/*  MENU EXPORT INTÉGRÉ */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={18} />
              Exporter
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={exportCSV}>Exporter en CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={exportExcel}>Exporter en Excel</DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDF}>Exporter en PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/*  STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>Total Clients</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            {stats.totalClients}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réservations</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-blue-600">
            {stats.clientsWithReservations}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paiements</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-yellow-600">
            {stats.clientsWithPayments}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rôles</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            Client: {stats.totalClientsByRole.client} <br />
            Entreprise: {stats.totalClientsByRole.entreprise} <br />
            Touriste: {stats.totalClientsByRole.tourist}
          </CardContent>
        </Card>

      </div>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/*  BAR CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Clients par rôle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/*  PIE CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des rôles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {roleData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/*  LINE CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Réservations vs Paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="réservations" stroke="#60a5fa" strokeWidth={3} />
              <Line type="monotone" dataKey="paiements" stroke="#facc15" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}

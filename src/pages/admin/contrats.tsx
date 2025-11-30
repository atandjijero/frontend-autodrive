import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Contrats = {
  [id: string]: {
    idClient: string;
    idVehicule: string;
    reservation: { from: string; to: string };
    montant: string;
  };
};

export const contrats: Contrats = {
  1: {
    idClient: "C001",
    idVehicule: "3",
    reservation: { from: "2025-11-30", to: "2025-12-03" },
    montant: "150000",
  },
  2: {
    idClient: "C002",
    idVehicule: "7",
    reservation: { from: "2025-12-01", to: "2025-12-05" },
    montant: "220000",
  },
  3: {
    idClient: "C003",
    idVehicule: "12",
    reservation: { from: "2025-12-02", to: "2025-12-04" },
    montant: "130000",
  },
  4: {
    idClient: "C004",
    idVehicule: "1",
    reservation: { from: "2025-12-05", to: "2025-12-10" },
    montant: "260000",
  },
  5: {
    idClient: "C005",
    idVehicule: "3",
    reservation: { from: "2025-12-08", to: "2025-12-12" },
    montant: "200000",
  },
  6: {
    idClient: "C006",
    idVehicule: "4",
    reservation: { from: "2025-12-10", to: "2025-12-11" },
    montant: "50000",
  },
  7: {
    idClient: "C007",
    idVehicule: "6",
    reservation: { from: "2025-12-12", to: "2025-12-15" },
    montant: "140000",
  },
  8: {
    idClient: "C008",
    idVehicule: "2",
    reservation: { from: "2025-12-14", to: "2025-12-18" },
    montant: "210000",
  },
  9: {
    idClient: "C009",
    idVehicule: "15",
    reservation: { from: "2025-12-15", to: "2025-12-16" },
    montant: "45000",
  },
  10: {
    idClient: "C010",
    idVehicule: "19",
    reservation: { from: "2025-12-16", to: "2025-12-20" },
    montant: "180000",
  },
  11: {
    idClient: "C011",
    idVehicule: "8",
    reservation: { from: "2025-12-18", to: "2025-12-22" },
    montant: "160000",
  },
  12: {
    idClient: "C012",
    idVehicule: "5",
    reservation: { from: "2025-12-20", to: "2025-12-23" },
    montant: "120000",
  },
  13: {
    idClient: "C013",
    idVehicule: "10",
    reservation: { from: "2025-12-22", to: "2025-12-26" },
    montant: "200000",
  },
  14: {
    idClient: "C014",
    idVehicule: "14",
    reservation: { from: "2025-12-24", to: "2025-12-25" },
    montant: "60000",
  },
  15: {
    idClient: "C015",
    idVehicule: "13",
    reservation: { from: "2025-12-26", to: "2025-12-29" },
    montant: "150000",
  },
  16: {
    idClient: "C016",
    idVehicule: "11",
    reservation: { from: "2025-12-28", to: "2026-01-01" },
    montant: "240000",
  },
  17: {
    idClient: "C017",
    idVehicule: "17",
    reservation: { from: "2025-12-30", to: "2026-01-02" },
    montant: "170000",
  },
  18: {
    idClient: "C018",
    idVehicule: "18",
    reservation: { from: "2026-01-02", to: "2026-01-06" },
    montant: "220000",
  },
  19: {
    idClient: "C019",
    idVehicule: "20",
    reservation: { from: "2026-01-05", to: "2026-01-07" },
    montant: "80000",
  },
  20: {
    idClient: "C020",
    idVehicule: "16",
    reservation: { from: "2026-01-10", to: "2026-01-15" },
    montant: "190000",
  },
};

export default function ContratsListe() {
  return (
    <>
      <title>Liste des contrats - Admin – AutoDrive</title>

      <h1 className="text-2xl font-bold">Liste des contrats</h1>

      <Table>
        <TableCaption>Liste des contrats.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID Client</TableHead>
            <TableHead className="w-[100px]">ID Vehicule</TableHead>
            <TableHead>Date Debut</TableHead>
            <TableHead>Date Fin</TableHead>
            <TableHead>Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(contrats).map(([id, contrat]) => (
            <TableRow key={id}>
              <TableCell>{contrat.idClient}</TableCell>
              <TableCell className="font-medium">
                {contrat.idVehicule}
              </TableCell>
              <TableCell>{contrat.reservation.from}</TableCell>
              <TableCell>{contrat.reservation.to}</TableCell>
              <TableCell>{contrat.montant}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              {contrats ? Object.keys(contrats).length : 0} contrats
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

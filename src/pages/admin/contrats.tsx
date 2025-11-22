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
  [id: number]: {
    idClient: string;
    idVehicule: string;
    reservation: { from: string; to: string };
    montant: string;
  };
};

export const contrats: Contrats = {
  1: {
    idClient: "1",
    idVehicule: "3",
    reservation: { from: "2025-11-16", to: "2025-11-22" },
    montant: "500",
  },
  2: {
    idClient: "2",
    idVehicule: "6",
    reservation: { from: "2025-11-22", to: "2025-11-27" },
    montant: "300",
  },
  3: {
    idClient: "3",
    idVehicule: "2",
    reservation: { from: "2025-12-10", to: "2025-12-10" },
    montant: "800",
  },
  4: {
    idClient: "3",
    idVehicule: "1",
    reservation: { from: "2025-11-19", to: "2025-12-10" },
    montant: "800",
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

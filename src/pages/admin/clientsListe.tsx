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
import { Link } from "react-router-dom";

type Clients = {
  [id: number]: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    dateInscription: string;
  };
};

export const clients: Clients = {
  1: {
    nom: "Doe",
    prenom: "John",
    email: "john.doe@example.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "10 Rue de Paris, 75001 Paris, France",
    dateInscription: "2024-01-15",
  },
  2: {
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@example.com",
    telephone: "+33 7 98 76 54 32",
    adresse: "25 Avenue Victor Hugo, 69002 Lyon, France",
    dateInscription: "2023-11-02",
  },
  3: {
    nom: "Kouassi",
    prenom: "Adama",
    email: "adama.kouassi@example.com",
    telephone: "+225 01 23 45 67",
    adresse: "Cocody Riviera, Abidjan, Côte d'Ivoire",
    dateInscription: "2024-03-20",
  },
  4: {
    nom: "Smith",
    prenom: "Emma",
    email: "emma.smith@example.com",
    telephone: "+44 7400 123456",
    adresse: "12 Baker Street, London, UK",
    dateInscription: "2024-02-10",
  },
  5: {
    nom: "Mensah",
    prenom: "Kwame",
    email: "kwame.mensah@example.com",
    telephone: "+233 55 667 8899",
    adresse: "Osu Oxford Street, Accra, Ghana",
    dateInscription: "2024-04-05",
  },
};

export default function ClientsListe() {
  return (
    <>
      <title>Liste des clients - Admin – AutoDrive</title>

      <h1 className="text-2xl font-bold">Liste des clients</h1>

      <Table>
        <TableCaption>Liste des clients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="w-[100px]">Prenom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telephone</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Date Inscription</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(clients).map(([id, client]) => (
            <TableRow key={id}>
              <TableCell>{client.nom}</TableCell>
              <TableCell className="font-medium">{client.prenom}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.telephone}</TableCell>
              <TableCell>{client.adresse}</TableCell>
              <TableCell>{client.dateInscription}</TableCell>
              <TableCell>
                <Link
                  to={`/admin/clientsModif/${id}`}
                  className="text-blue-500 hover:underline"
                >
                  Modifier
                </Link>
                <Link
                  to={`/admin/clientsSuppr/${id}`}
                  className="text-red-500 hover:underline ml-4"
                >
                  Supprimer
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total</TableCell>
            <TableCell className="text-right">
              {clients ? Object.keys(clients).length : 0} clients
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

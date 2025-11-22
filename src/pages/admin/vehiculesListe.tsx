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

type Vehicules = {
  [id: string]: {
    carrosserie: string;
    marque: string;
    transmission: "manuelle" | "automatique";
    prix: number;
    imageUrl: string;
    immatriculation: string;
  };
};

export const vehicules: Vehicules = {
  1: {
    carrosserie: "berline",
    marque: "Peugeot",
    transmission: "manuelle",
    prix: 50, // prix location / jour
    imageUrl: "/peugeot-308.jpg",
    immatriculation: "AA-123-BB",
  },
  2: {
    carrosserie: "SUV",
    marque: "Toyota",
    transmission: "automatique",
    prix: 80, // prix location / jour
    imageUrl: "/toyota-rav4.jpg",
    immatriculation: "BC-456-CD",
  },
  3: {
    carrosserie: "moto",
    marque: "Honda",
    transmission: "manuelle",
    prix: 30, // prix location / jour
    imageUrl: "/honda-cb500.jpg",
    immatriculation: "DD-789-EE",
  },
  4: {
    carrosserie: "camion",
    marque: "Mercedes",
    transmission: "manuelle",
    prix: 110, // prix location / jour
    imageUrl: "/mercedes-actros.jpg",
    immatriculation: "EF-910-FG",
  },
  5: {
    carrosserie: "citadine",
    marque: "Renault",
    transmission: "manuelle",
    prix: 35, // prix location / jour
    imageUrl: "/renault-clio.jpg",
    immatriculation: "GH-112-IJ",
  },
  6: {
    carrosserie: "citadine",
    marque: "Renault",
    transmission: "manuelle",
    prix: 35, // prix location / jour
    imageUrl: "/renault-clio.jpg",
    immatriculation: "GH-112-IJ",
  },
  7: {
    carrosserie: "citadine",
    marque: "Renault",
    transmission: "manuelle",
    prix: 35, // prix location / jour
    imageUrl: "/renault-clio.jpg",
    immatriculation: "GH-112-IJ",
  },
  8: {
    carrosserie: "citadine",
    marque: "Renault",
    transmission: "manuelle",
    prix: 35, // prix location / jour
    imageUrl: "/renault-clio.jpg",
    immatriculation: "GH-112-IJ",
  },
  9: {
    carrosserie: "citadine",
    marque: "Renault",
    transmission: "manuelle",
    prix: 35, // prix location / jour
    imageUrl: "/renault-clio.jpg",
    immatriculation: "GH-112-IJ",
  },
  10: {
    carrosserie: "citadine",
    marque: "Renault",
    transmission: "manuelle",
    prix: 35, // prix location / jour
    imageUrl: "/renault-clio.jpg",
    immatriculation: "GH-112-IJ",
  },
  11: {
    carrosserie: "citadine",
    marque: "Renault",
    transmission: "manuelle",
    prix: 35, // prix location / jour
    imageUrl: "/renault-clio.jpg",
    immatriculation: "GH-112-IJ",
  },
  12: {
    carrosserie: "citadine",
    marque: "Renault",
    transmission: "manuelle",
    prix: 35, // prix location / jour
    imageUrl: "/renault-clio.jpg",
    immatriculation: "GH-112-IJ",
  },
};

export default function VehiculesListe() {
  return (
    <>
      <title>Liste des vehicules - Admin – AutoDrive</title>

      <h1 className="text-2xl font-bold">Liste des vehicules</h1>

      <Table>
        <TableCaption>Liste des vehicules.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Marque</TableHead>
            <TableHead>Carrosserie</TableHead>
            <TableHead>Transmission</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>imageUrl</TableHead>
            <TableHead>Immatriculation</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(vehicules).map(([id, vehicule]) => (
            <TableRow key={id}>
              <TableCell>{vehicule.marque}</TableCell>
              <TableCell>{vehicule.carrosserie}</TableCell>
              <TableCell>{vehicule.transmission}</TableCell>
              <TableCell>{vehicule.prix}</TableCell>
              <TableCell>{vehicule.imageUrl}</TableCell>
              <TableCell>{vehicule.immatriculation}</TableCell>
              <TableCell>
                <Link
                  to={`/admin/vehiculesModif/${id}`}
                  className="text-blue-500 hover:underline"
                >
                  Modifier
                </Link>
                <Link
                  to={`/admin/vehiculesSuppr/${id}`}
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
              {vehicules ? Object.keys(vehicules).length : 0} véhicules
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

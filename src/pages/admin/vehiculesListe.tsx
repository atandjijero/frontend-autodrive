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
    modele: string;
    transmission: "manuelle" | "automatique";
    prix: number;
    imageUrl: string;
    immatriculation: string;
  };
};

export const vehicules: Vehicules = {
  "1": {
    carrosserie: "SUV",
    marque: "Toyota",
    modele: "RAV4",
    transmission: "automatique",
    prix: 65,
    imageUrl: "https://example.com/toyota_rav4.jpg",
    immatriculation: "AA-123-AA",
  },
  "2": {
    carrosserie: "berline",
    marque: "Honda",
    modele: "Civic",
    transmission: "manuelle",
    prix: 45,
    imageUrl: "https://example.com/honda_civic.jpg",
    immatriculation: "BB-456-BB",
  },
  "3": {
    carrosserie: "SUV",
    marque: "Hyundai",
    modele: "Tucson",
    transmission: "automatique",
    prix: 60,
    imageUrl: "https://example.com/hyundai_tucson.jpg",
    immatriculation: "CC-789-CC",
  },
  "4": {
    carrosserie: "citadine",
    marque: "Renault",
    modele: "Clio",
    transmission: "manuelle",
    prix: 35,
    imageUrl: "https://example.com/renault_clio.jpg",
    immatriculation: "DD-321-DD",
  },
  "5": {
    carrosserie: "pickup",
    marque: "Ford",
    modele: "Ranger",
    transmission: "automatique",
    prix: 95,
    imageUrl: "https://example.com/ford_ranger.jpg",
    immatriculation: "EE-654-EE",
  },
  "6": {
    carrosserie: "berline",
    marque: "BMW",
    modele: "320i",
    transmission: "automatique",
    prix: 100,
    imageUrl: "https://example.com/bmw_320i.jpg",
    immatriculation: "FF-987-FF",
  },
  "7": {
    carrosserie: "SUV",
    marque: "Mercedes",
    modele: "GLA 200",
    transmission: "automatique",
    prix: 110,
    imageUrl: "https://example.com/mercedes_gla200.jpg",
    immatriculation: "GG-741-GG",
  },
  "8": {
    carrosserie: "citadine",
    marque: "Peugeot",
    modele: "208",
    transmission: "manuelle",
    prix: 38,
    imageUrl: "https://example.com/peugeot_208.jpg",
    immatriculation: "HH-852-HH",
  },
  "9": {
    carrosserie: "berline",
    marque: "Audi",
    modele: "A4",
    transmission: "automatique",
    prix: 105,
    imageUrl: "https://example.com/audi_a4.jpg",
    immatriculation: "II-963-II",
  },
  "10": {
    carrosserie: "SUV",
    marque: "Kia",
    modele: "Sportage",
    transmission: "manuelle",
    prix: 55,
    imageUrl: "https://example.com/kia_sportage.jpg",
    immatriculation: "JJ-147-JJ",
  },
  "11": {
    carrosserie: "monospace",
    marque: "Volkswagen",
    modele: "Touran",
    transmission: "automatique",
    prix: 70,
    imageUrl: "https://example.com/vw_touran.jpg",
    immatriculation: "KK-258-KK",
  },
  "12": {
    carrosserie: "pickup",
    marque: "Nissan",
    modele: "Navara",
    transmission: "manuelle",
    prix: 90,
    imageUrl: "https://example.com/nissan_navara.jpg",
    immatriculation: "LL-369-LL",
  },
  "13": {
    carrosserie: "SUV",
    marque: "Mazda",
    modele: "CX-5",
    transmission: "automatique",
    prix: 70,
    imageUrl: "https://example.com/mazda_cx5.jpg",
    immatriculation: "MM-951-MM",
  },
  "14": {
    carrosserie: "berline",
    marque: "Toyota",
    modele: "Corolla",
    transmission: "manuelle",
    prix: 40,
    imageUrl: "https://example.com/toyota_corolla.jpg",
    immatriculation: "NN-753-NN",
  },
  "15": {
    carrosserie: "citadine",
    marque: "Fiat",
    modele: "500",
    transmission: "automatique",
    prix: 32,
    imageUrl: "https://example.com/fiat_500.jpg",
    immatriculation: "OO-852-OO",
  },
  "16": {
    carrosserie: "SUV",
    marque: "Jeep",
    modele: "Renegade",
    transmission: "manuelle",
    prix: 50,
    imageUrl: "https://example.com/jeep_renegade.jpg",
    immatriculation: "PP-159-PP",
  },
  "17": {
    carrosserie: "berline",
    marque: "Tesla",
    modele: "Model 3",
    transmission: "automatique",
    prix: 120,
    imageUrl: "https://example.com/tesla_model3.jpg",
    immatriculation: "QQ-357-QQ",
  },
  "18": {
    carrosserie: "SUV",
    marque: "Volvo",
    modele: "XC60",
    transmission: "automatique",
    prix: 120,
    imageUrl: "https://example.com/volvo_xc60.jpg",
    immatriculation: "RR-468-RR",
  },
  "19": {
    carrosserie: "pickup",
    marque: "Mitsubishi",
    modele: "L200",
    transmission: "manuelle",
    prix: 85,
    imageUrl: "https://example.com/mitsubishi_l200.jpg",
    immatriculation: "SS-579-SS",
  },
  "20": {
    carrosserie: "citadine",
    marque: "Citroën",
    modele: "C3",
    transmission: "manuelle",
    prix: 34,
    imageUrl: "https://example.com/citroen_c3.jpg",
    immatriculation: "TT-680-TT",
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

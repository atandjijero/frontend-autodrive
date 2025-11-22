import { CarouselPlugin } from "@/components/carouselPlugin";
import { Separator } from "@/components/ui/separator";
import { vehicules } from "./admin/vehiculesListe";
import { contrats } from "./admin/contrats";
import { type DateRange } from "react-day-picker";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const rangesOverlap = (a: DateRange, b: DateRange) => {
    if (!a.from || !a.to || !b.from || !b.to) return false;
    return a.from <= b.to && b.from <= a.to;
  };

  const newRange: DateRange = {
    from: new Date(),
    to: new Date(),
  };

  const dispos = Object.fromEntries(
    Object.entries(vehicules).filter(([id]) => {
      const reserved = Object.values(contrats).some((c) => {
        if (String(c.idVehicule) !== String(id)) return false;

        const reserv = c.reservation; // ONE reservation object

        const reservRange: DateRange = {
          from: new Date(reserv.from),
          to: new Date(reserv.to),
        };

        return rangesOverlap(newRange, reservRange);
      });

      return !reserved;
    })
  );

  return (
    <>
      <title>AutoDrive</title>
      <div className="p-0">
        <CarouselPlugin />
        <h1 className="text-2xl font-bold">AutoDrive</h1>
        <p className="mt-2 text-lg">
          Bienvenue sur Auto Drive, votre plateforme de location de véhicules de
          confiance. Découvrez notre large gamme de voitures adaptées à tous vos
          besoins, que ce soit pour un voyage d'affaires, des vacances en
          famille ou une escapade le temps d'un week-end. Profitez de nos tarifs
          compétitifs et de notre service client exceptionnel pour une
          expérience de location sans souci.
        </p>
        <Separator className="my-4" />
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Parcourez les vehicules disponibles aujourd'hui
          </h2>
          <div className="mt-8 flex" style={{ overflow: "auto" }}>
            {Object.entries(dispos).map(([id, dispo]) => (
              <Link
                to={`/vehicules/${id}`}
                key={id}
                className="no-underline text-inherit"
              >
                <Card className="m-4 pb-4 w-60">
                  <img
                    src={dispo.imageUrl}
                    alt={`${dispo.marque} image`}
                    className="mt-2 h-40 w-auto object-cover"
                  />
                  <h2 className="text-xl font-semibold">
                    {dispo.marque} - {dispo.immatriculation}
                  </h2>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold">
            Parcourez les vehicule en promotion
          </h2>
          <div className="mt-8 flex" style={{ overflow: "auto" }}>
            {Object.entries(dispos).map(([id, dispo]) => (
              <Link
                to={`/vehicules/${id}`}
                key={id}
                className="no-underline text-inherit"
              >
                <Card className="m-4 pb-4 w-60">
                  <img
                    src={dispo.imageUrl}
                    alt={`${dispo.marque} image`}
                    className="mt-2 h-40 w-auto object-cover"
                  />
                  <h2 className="text-xl font-semibold">
                    {dispo.marque} - {dispo.immatriculation}
                  </h2>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

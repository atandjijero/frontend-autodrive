import { useEffect, useState } from "react";
import { getVehicles } from "@/api/apiClient";
import type { Vehicle } from "@/api/apiClient";
import { Helmet } from "react-helmet-async";

import { CarouselPlugin } from "@/components/carouselPlugin";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HomePage() {
  const [vehicules, setVehicules] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger uniquement les véhicules
  useEffect(() => {
    getVehicles()
      .then((vehiculesRes) => {
        setVehicules(vehiculesRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les véhicules.");
        setLoading(false);
      });
  }, []);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-lg font-semibold text-muted-foreground">
        Chargement des véhicules...
      </p>
    </div>
  );
  if (vehicules.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-semibold text-muted-foreground">
          Aucun véhicule disponible pour le moment.
        </p>
      </div>
    );
  }

  // Filtrer les véhicules disponibles
  const dispos = vehicules.filter((v) => v.disponible);

  return (
    <>
      <Helmet>
        <title>AutoDrive - Location de Véhicules | Louez Facilement</title>
        <meta name="description" content="Louez facilement votre véhicule pour vos voyages d'affaires, vacances ou escapades avec AutoDrive. Service de location de voitures fiable, GPS intégré, assurance complète." />
        <meta name="keywords" content="location voiture, location véhicule, AutoDrive, location vacances, location affaires, GPS intégré, assurance complète, assistance 24/7" />
        <meta property="og:title" content="AutoDrive - Location de Véhicules" />
        <meta property="og:description" content="Louez facilement votre véhicule pour vos voyages d'affaires, vacances ou escapades avec AutoDrive." />
        <meta property="og:image" content="/vite.svg" />
        <meta property="og:url" content="https://autodrive.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="p-0">
        {/* Hero Section */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white animate-fade-in">
          <h1 className="text-4xl font-extrabold">Bienvenue sur AutoDrive</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Louez facilement votre véhicule pour vos voyages d’affaires, vacances ou escapades.
          </p>
        </div>

        {/* Section Publicité */}
        <div className="py-8 bg-muted animate-fade-in animation-delay-100">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Nos Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-lg font-semibold">Assurance Complète</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Protégez votre location avec notre assurance tous risques incluse.
                  </p>
                  <Button className="mt-4" variant="outline">En savoir plus</Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <h3 className="text-lg font-semibold">GPS Intégré</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Naviguez facilement avec notre système GPS gratuit et illimité.
                  </p>
                  <Button className="mt-4" variant="outline">Découvrir</Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-400">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛠️</span>
                  </div>
                  <h3 className="text-lg font-semibold">Assistance 24/7</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Service d'assistance routière disponible à tout moment.
                  </p>
                  <Button className="mt-4" variant="outline">Contacter</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Section Témoignages */}
        <div className="py-12 bg-background animate-fade-in animation-delay-500">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-center mb-8">Ce que disent nos clients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 animate-slide-in-up animation-delay-600">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Jean Dupont</p>
                      <p className="text-sm text-muted-foreground">Paris</p>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    "Service excellent, voiture impeccable et prise en charge rapide. Je recommande vivement AutoDrive !"
                  </p>
                  <div className="flex mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 animate-slide-in-up animation-delay-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>ML</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Marie Leroy</p>
                      <p className="text-sm text-muted-foreground">Lyon</p>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    "Location simple et rapide. Le véhicule était propre et en parfait état. Prix compétitifs."
                  </p>
                  <div className="flex mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 animate-slide-in-up animation-delay-800">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>PM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Pierre Martin</p>
                      <p className="text-sm text-muted-foreground">Marseille</p>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    "Équipe sympathique et professionnelle. J'ai pu changer de véhicule en cours de route sans problème."
                  </p>
                  <div className="flex mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <CarouselPlugin />
        <Separator className="my-6" />

        {/* Liste des véhicules disponibles */}
        <div className="space-y-4 px-6 animate-fade-in animation-delay-900">
          <h2 className="text-2xl font-semibold text-center">
            Véhicules disponibles aujourd'hui
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dispos.map((vehicule, index) => (
              <Link
                to={`/vehicules/${vehicule._id}`}
                key={vehicule._id}
                className="no-underline text-inherit"
              >
                <Card className={`hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-${(index % 6) * 100 + 1000}`}>
                  <CardHeader>
                    <CardTitle>
                      {vehicule.marque} - {vehicule.immatriculation}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={vehicule.photos?.[0] || "/placeholder.png"}
                        alt={`${vehicule.marque} ${vehicule.modele}`}
                        className="rounded-md object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                        loading="lazy"
                      />
                    </AspectRatio>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-lg font-semibold">
                        {vehicule.prix} € / jour
                      </p>
                      {vehicule.prix < 50 && (
                        <Badge variant="destructive">Promo</Badge>
                      )}
                      {vehicule.disponible ? (
                        <Badge variant="secondary">Disponible</Badge>
                      ) : (
                        <Badge variant="outline">Indisponible</Badge>
                      )}
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-sm text-muted-foreground">Détails</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Transmission : {vehicule.transmission}</p>
                        <p>Carrosserie : {vehicule.carrosserie}</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Section promo */}
        <div className="mt-10 px-6 animate-fade-in animation-delay-1100">
          <h2 className="text-2xl font-semibold text-center">
            Véhicules en promotion
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dispos
              .filter((v) => v.prix < 50)
              .map((vehicule, index) => (
                <Link
                  to={`/vehicules/${vehicule._id}`}
                  key={vehicule._id}
                  className="no-underline text-inherit"
                >
                  <Card className={`hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-${(index % 6) * 100 + 1200}`}>
                    <CardHeader>
                      <CardTitle>
                        {vehicule.marque} - {vehicule.immatriculation}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={vehicule.photos?.[0] || "/placeholder.png"}
                          alt={`${vehicule.marque} ${vehicule.modele}`}
                          className="rounded-md object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                          loading="lazy"
                        />
                      </AspectRatio>
                      <p className="mt-2 text-lg font-semibold">
                        {vehicule.prix} € / jour
                      </p>
                      <Badge variant="destructive">Promo</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 bg-muted py-8 text-center animate-fade-in animation-delay-1300">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AutoDrive. Tous droits réservés.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <Link to="/about" className="text-primary hover:underline transition-colors duration-300">À propos</Link>
            <Link to="/contact" className="text-primary hover:underline transition-colors duration-300">Contact</Link>
            <Link to="/faq" className="text-primary hover:underline transition-colors duration-300">FAQ</Link>
          </div>
        </footer>
      </div>
    </>
  );
}

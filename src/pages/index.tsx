import { useEffect, useState } from "react";
import { getVehicles, getPromotions, getTemoignages, getNearbyAgencies, resolveUrl } from "@/api/apiClient";
import type { Vehicle, Promotion, Temoignage, Agency } from "@/api/apiClient";

import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

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
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Loader2, MapPin, Phone, AlertCircle } from "lucide-react";

export default function HomePage() {
  const { t } = useTranslation();
  const [vehicules, setVehicules] = useState<Vehicle[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [vehiculesEnPromo, setVehiculesEnPromo] = useState<Vehicle[]>([]);
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [nearbyAgencies, setNearbyAgencies] = useState<Agency[]>([]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les véhicules
  useEffect(() => {
    getVehicles()
      .then((res) => {
        setVehicules(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les véhicules.");
        setLoading(false);
      });
  }, []);

  // Charger les promotions actives
  useEffect(() => {
    getPromotions(true)
      .then((res) => setPromotions(res.data))
      .catch(() => setError("Impossible de charger les promotions."));
  }, []);

  // Charger les témoignages
  useEffect(() => {
    getTemoignages()
      .then((res) => setTemoignages(res.data))
      .catch(() => setError("Impossible de charger les témoignages."));
  }, []);

  // Construire la liste des véhicules en promotion
  useEffect(() => {
    if (vehicules.length && promotions.length) {
      const enPromo = vehicules.filter((v) =>
        promotions.some((p) => p.vehiculeId === v._id)
      );
      setVehiculesEnPromo(enPromo);
    }
  }, [vehicules, promotions]);

  // Fonction pour trouver les agences proches
  const findNearbyAgencies = async () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par ce navigateur");
      return;
    }

    setGpsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      try {
        const agencies = await getNearbyAgencies({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          maxDistance: 50000, // 50km
          limit: 5
        });

        setNearbyAgencies(agencies.data);
        setError(null); // Clear any previous errors on success
      } catch (apiError: any) {
        console.error("Erreur API agences:", apiError);
        setError("Erreur lors de la recherche d'agences proches");
      }
    } catch (geoError: any) {
      // Only log if it's not a permission denied error (which is expected)
      if (geoError.code !== 1) {
        console.error("Erreur de géolocalisation:", geoError);
      }
      
      setError(
        geoError.code === 1 ? "Veuillez autoriser l'accès à votre position pour trouver les agences proches" :
        geoError.code === 2 ? "Position indisponible. Vérifiez votre connexion GPS" :
        geoError.code === 3 ? "Timeout de géolocalisation. Réessayez plus tard" :
        "Erreur lors de l'obtention de votre position"
      );
    } finally {
      setGpsLoading(false);
    }
  };

  // Gestion des états de chargement et d'erreur
  if (error) {
    return (
      <p className="text-red-500 text-center">
        {error}
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-semibold text-muted-foreground">
          Chargement des véhicules...
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
          <h1 className="text-4xl font-extrabold">{t('hero.title')}</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">{t('hero.subtitle')}</p>
        </div>

        {/* Section Publicité */}
        <div className="py-12 bg-background animate-fade-in animation-delay-500">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-center mb-6">{t('services.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-lg font-semibold">{t('services.assurance.title')}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{t('services.assurance.desc')}</p>
                  <Button className="mt-4" variant="outline">{t('buttons.learn_more')}</Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-center">{t('services.gps.title')}</h3>
                  <p className="text-sm text-muted-foreground mt-2 text-center">{t('services.gps.desc')}</p>

                  <div className="mt-4 space-y-4">
                    <Button
                      onClick={findNearbyAgencies}
                      disabled={gpsLoading}
                      className="w-full"
                      variant="outline"
                    >
                      {gpsLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Recherche en cours...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Trouver les agences proches
                        </>
                      )}
                    </Button>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">{error}</AlertDescription>
                      </Alert>
                    )}

                    {nearbyAgencies.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-center">Agences proches :</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {nearbyAgencies.map((agency) => (
                            <div key={agency._id} className="flex items-center gap-2 p-2 border rounded text-xs">
                              {agency.logo && (
                                <img
                                  src={resolveUrl(agency.logo)}
                                  alt={agency.name}
                                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{agency.name}</p>
                                <p className="text-muted-foreground truncate">{agency.address}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 flex-shrink-0"
                                onClick={() => window.open(`tel:${agency.phone}`, '_blank')}
                              >
                                <Phone className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-400">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛠️</span>
                  </div>
                  <h3 className="text-lg font-semibold">{t('services.assistance.title')}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{t('services.assistance.desc')}</p>
                  <Button className="mt-4" variant="outline">{t('buttons.contact')}</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Section Témoignages */}
        <div className="py-12 bg-background animate-fade-in animation-delay-500">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-center mb-8">{t('testimonials.heading')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {temoignages.slice(0, 3).map((temoignage, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 animate-slide-in-up" style={{ animationDelay: `${600 + index * 100}ms` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>{temoignage.prenom[0]}{temoignage.nom[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{temoignage.prenom} {temoignage.nom}</p>
                        <p className="text-sm text-muted-foreground">Client</p>
                      </div>
                    </div>
                    <p className="text-sm italic">
                      "{temoignage.message}"
                    </p>
                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <CarouselPlugin />
        <Separator className="my-6" />

        {/* Liste des véhicules disponibles */}
        <div className="space-y-4 px-6 animate-fade-in animation-delay-900">
          <h2 className="text-2xl font-semibold text-center">{t('vehicles.available_heading')}</h2>
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

        {/* Section Promo */}
<div className="mt-10 px-6 animate-fade-in animation-delay-1100">
  <h2 className="text-2xl font-semibold text-center">{t('vehicles.promo_heading')}</h2>

  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {vehiculesEnPromo.map((vehicule, index) => (
      <Link
        to={`/vehicules/${vehicule._id}`}
        key={vehicule._id}
        className="no-underline text-inherit"
      >
        <Card
          className={`hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-${(index % 6) * 100 + 1200}`}
        >
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
              />
            </AspectRatio>

            <div className="mt-2 flex items-center gap-2">
              <p className="text-lg font-semibold">
                {vehicule.prix} € / jour
              </p>
              <Badge variant="destructive">Promo</Badge>
            </div>
            {(() => {
              const matchingPromotions = promotions.filter(p => p.vehiculeId === vehicule._id);
              const allCodes = matchingPromotions.flatMap(p => p.codesPromo).filter(code => code && code.trim());
              if (allCodes.length > 0) {
                return (
                  <p className="text-sm text-muted-foreground mt-1">
                    Codes promo: <strong>{allCodes.join(', ')}</strong>
                  </p>
                );
              }
              return null;
            })()}
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
</div>


        {/* Footer */}
          <footer className="mt-16 bg-muted py-8 text-center animate-fade-in animation-delay-1300">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AutoDrive. {t('footer.copyright')}</p>
          <div className="mt-4 flex justify-center gap-100">
            <Link to="/about" className="text-primary hover:underline transition-colors duration-300">{t('footer.about')}</Link>
            <Link to="/contact" className="text-primary hover:underline transition-colors duration-300">{t('footer.contact')}</Link>
            <Link to="/faq" className="text-primary hover:underline transition-colors duration-300">{t('footer.faq')}</Link>
          </div>
        </footer>
      </div>
    </>
  );
}

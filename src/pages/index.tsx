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
import { Skeleton } from "@/components/ui/skeleton";

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
          timeout: 30000, // Increased from 10000 to 30000 ms
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
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center py-20 px-6">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/vehicules">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  Voir les véhicules
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Publicité */}
        <div className="py-20 bg-gray-50 dark:bg-gray-900 animate-fade-in animation-delay-500">
          <div className="px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('services.title')}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Découvrez nos services complets pour une expérience de location exceptionnelle
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white dark:bg-gray-800 animate-slide-in-up animation-delay-200">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('services.assurance.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('services.assurance.desc')}</p>
                  <Button className="mt-6 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300" variant="outline">
                    {t('buttons.learn_more')}
                  </Button>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white dark:bg-gray-800 animate-slide-in-up animation-delay-300">
                <CardContent id="nearest-agencies" className="p-8">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">🗺️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">{t('services.gps.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center mb-6">{t('services.gps.desc')}</p>

                  <div className="mt-4 space-y-4">
                    <Button
                      onClick={findNearbyAgencies}
                      disabled={gpsLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
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
                      <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                      </Alert>
                    )}

                    {gpsLoading && nearbyAgencies.length === 0 && (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2 p-2 border rounded">
                              <Skeleton className="w-6 h-6 rounded-full" />
                              <div className="flex-1 space-y-1">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-3 w-16" />
                              </div>
                              <Skeleton className="w-6 h-6 rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {nearbyAgencies.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">Agences proches :</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {nearbyAgencies.map((agency) => (
                            <div key={agency._id} className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs shadow-sm">
                              {agency.logo && (
                                <img
                                  src={resolveUrl(agency.logo)}
                                  alt={agency.name}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate text-gray-900 dark:text-white">{agency.name}</p>
                                <p className="text-gray-600 dark:text-gray-300 truncate">{agency.address}</p>
                                {agency.distance && (
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                                    📍 {(agency.distance / 1000).toFixed(1)} km
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(agency.address)}`, '_blank')}
                                >
                                  <MapPin className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                                  onClick={() => window.open(`tel:${agency.phone}`, '_blank')}
                                >
                                  <Phone className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white dark:bg-gray-800 animate-slide-in-up animation-delay-400">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">🛠️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('services.assistance.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('services.assistance.desc')}</p>
                  <Link to="/contact">
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      {t('buttons.contact')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Section Témoignages */}
        <div className="py-20 bg-white dark:bg-gray-900 animate-fade-in animation-delay-500">
          <div className="px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('testimonials.heading')}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Découvrez ce que nos clients disent de leur expérience avec AutoDrive
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {temoignages.slice(0, 3).map((temoignage, index) => (
                <Card key={index} className="hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-gray-50 dark:bg-gray-800 animate-slide-in-up" style={{ animationDelay: `${600 + index * 100}ms` }}>
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Avatar className="w-12 h-12 mr-4 shadow-lg">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">{temoignage.prenom[0]}{temoignage.nom[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">{temoignage.prenom} {temoignage.nom}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Client satisfait</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed mb-4">
                      "{temoignage.message}"
                    </p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">⭐</span>
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
        <div className="py-20 bg-gray-50 dark:bg-gray-800 animate-fade-in animation-delay-900">
          <div className="px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('vehicles.available_heading')}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Choisissez parmi notre sélection de véhicules de qualité pour votre prochain voyage
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dispos.map((vehicule, index) => (
                <Link
                  to={`/vehicules/${vehicule._id}`}
                  key={vehicule._id}
                  className="no-underline text-inherit group"
                >
                  <Card className={`hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white dark:bg-gray-900 animate-slide-in-up animation-delay-${(index % 6) * 100 + 1000}`}>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {vehicule.marque} - {vehicule.immatriculation}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AspectRatio ratio={16 / 9} className="mb-4">
                        <img
                          src={vehicule.photos?.[0] || "/placeholder.png"}
                          alt={`${vehicule.marque} ${vehicule.modele}`}
                          className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 shadow-lg"
                        />
                      </AspectRatio>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {vehicule.prix} € / jour
                        </p>
                        {vehicule.prix < 50 && (
                          <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">Promo</Badge>
                        )}
                        {vehicule.disponible ? (
                          <Badge variant="secondary" className="bg-green-500 text-white">Disponible</Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300">Indisponible</Badge>
                        )}
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <p className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                            Détails techniques
                          </p>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white dark:bg-white dark:text-gray-900">
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
        </div>

        {/* Section Promo */}
        <div className="py-20 bg-gray-100 dark:bg-gray-800 animate-fade-in animation-delay-1100">
          <div className="px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('vehicles.promo_heading')}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Profitez de nos offres promotionnelles exceptionnelles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehiculesEnPromo.map((vehicule, index) => (
                <Link
                  to={`/vehicules/${vehicule._id}`}
                  key={vehicule._id}
                  className="no-underline text-inherit group"
                >
                  <Card
                    className={`hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white dark:bg-gray-900 animate-slide-in-up animation-delay-${(index % 6) * 100 + 1200}`}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {vehicule.marque} - {vehicule.immatriculation}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <AspectRatio ratio={16 / 9} className="mb-4">
                        <img
                          src={vehicule.photos?.[0] || "/placeholder.png"}
                          alt={`${vehicule.marque} ${vehicule.modele}`}
                          className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 shadow-lg"
                        />
                      </AspectRatio>

                      <div className="flex items-center justify-between mb-4">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {vehicule.prix} € / jour
                        </p>
                        <Badge variant="destructive" className="bg-gray-600 hover:bg-gray-700 text-white">Promo</Badge>
                      </div>
                      {(() => {
                        const matchingPromotions = promotions.filter(p => p.vehiculeId === vehicule._id);
                        const allCodes = matchingPromotions.flatMap(p => p.codesPromo).filter(code => code && code.trim());
                        if (allCodes.length > 0) {
                          return (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              Codes promo: <strong className="text-blue-600 dark:text-blue-400">{allCodes.join(', ')}</strong>
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
        </div>


        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 animate-fade-in animation-delay-1300">
          <div className="px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">AutoDrive</h3>
                <p className="text-gray-300 leading-relaxed">
                  Votre partenaire de confiance pour la location de véhicules. Service de qualité, tarifs compétitifs, assistance 24/7.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link to="/vehicules" className="hover:text-white transition-colors">Location automobile</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link to="/about" className="hover:text-white transition-colors">À propos</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Assistance</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <p className="text-gray-300 mb-2">📧 contact@autodrive.com</p>
                <p className="text-gray-300 mb-2">📞 +228 22 2267 89</p>
                <p className="text-gray-300">📍 Lomé, Togo</p>
              </div>
            </div>
            <Separator className="bg-gray-700 mb-8" />
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 text-sm">© {new Date().getFullYear()} AutoDrive. {t('footer.copyright')}</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">{t('footer.about')}</Link>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">{t('footer.contact')}</Link>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">{t('footer.faq')}</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

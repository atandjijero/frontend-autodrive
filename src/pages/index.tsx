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
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Loader2, MapPin, Phone, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DataLoadingState {
  vehicules: boolean;
  promotions: boolean;
  temoignages: boolean;
}

interface ErrorState {
  vehicules: string | null;
  promotions: string | null;
  temoignages: string | null;
  general: string | null;
}

const isNetworkError = (error: any): boolean => {
  return !error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error';
};

export default function HomePage() {
  const { t } = useTranslation();
  const [vehicules, setVehicules] = useState<Vehicle[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [vehiculesEnPromo, setVehiculesEnPromo] = useState<Vehicle[]>([]);
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [nearbyAgencies, setNearbyAgencies] = useState<Agency[]>([]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [loading, setLoading] = useState<DataLoadingState>({
    vehicules: true,
    promotions: true,
    temoignages: true
  });
  const [errors, setErrors] = useState<ErrorState>({
    vehicules: null,
    promotions: null,
    temoignages: null,
    general: null
  });
  const [retryCount, setRetryCount] = useState(0);

  // Charger les véhicules avec retry automatique
  useEffect(() => {
    let retryTimer: NodeJS.Timeout;
    const attemptLoad = () => {
      getVehicles()
        .then((res) => {
          setVehicules(res.data);
          setLoading(prev => ({ ...prev, vehicules: false }));
          setErrors(prev => ({ ...prev, vehicules: null }));
        })
        .catch((err) => {
          const isNetwork = isNetworkError(err);
          setErrors(prev => ({
            ...prev,
            vehicules: isNetwork ? null : "Impossible de charger les véhicules."
          }));
          setLoading(prev => ({ ...prev, vehicules: isNetwork })); // Keep loading if network error
          
          if (isNetwork && retryCount < 5) {
            retryTimer = setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 3000);
          } else if (!isNetwork) {
            setLoading(prev => ({ ...prev, vehicules: false }));
          }
        });
    };

    if (loading.vehicules || (errors.vehicules === null && retryCount > 0)) {
      attemptLoad();
    }

    return () => clearTimeout(retryTimer);
  }, [retryCount, loading.vehicules]);

  // Charger les promotions actives avec retry
  useEffect(() => {
    let retryTimer: NodeJS.Timeout;
    const attemptLoad = () => {
      getPromotions(true)
        .then((res) => {
          setPromotions(res.data);
          setLoading(prev => ({ ...prev, promotions: false }));
          setErrors(prev => ({ ...prev, promotions: null }));
        })
        .catch((err) => {
          const isNetwork = isNetworkError(err);
          setErrors(prev => ({
            ...prev,
            promotions: isNetwork ? null : "Impossible de charger les promotions."
          }));
          setLoading(prev => ({ ...prev, promotions: isNetwork }));
          
          if (isNetwork && retryCount < 5) {
            retryTimer = setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 3000);
          } else if (!isNetwork) {
            setLoading(prev => ({ ...prev, promotions: false }));
          }
        });
    };

    if (loading.promotions || (errors.promotions === null && retryCount > 0)) {
      attemptLoad();
    }

    return () => clearTimeout(retryTimer);
  }, [retryCount, loading.promotions]);

  // Charger les témoignages avec retry
  useEffect(() => {
    let retryTimer: NodeJS.Timeout;
    let pollInterval: NodeJS.Timeout;

    const loadTemoignages = () => {
      getTemoignages()
        .then((res) => {
          console.log("✅ Témoignages chargés:", res.data);
          setTemoignages(res.data);
          setLoading(prev => ({ ...prev, temoignages: false }));
          setErrors(prev => ({ ...prev, temoignages: null }));
        })
        .catch((err) => {
          const isNetwork = isNetworkError(err);
          console.error("❌ Erreur chargement témoignages:", err.message);
          setErrors(prev => ({
            ...prev,
            temoignages: isNetwork ? null : "Impossible de charger les témoignages."
          }));
          setLoading(prev => ({ ...prev, temoignages: isNetwork }));
          
          if (isNetwork && retryCount < 5) {
            retryTimer = setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 3000);
          } else if (!isNetwork) {
            setLoading(prev => ({ ...prev, temoignages: false }));
          }
        });
    };

    loadTemoignages();
    
    // Rafraîchir les témoignages toutes les 3 secondes une fois chargés
    if (!loading.temoignages) {
      pollInterval = setInterval(loadTemoignages, 3000);
    }
    
    return () => {
      clearTimeout(retryTimer);
      clearInterval(pollInterval);
    };
  }, [retryCount, loading.temoignages]);

  // Construire la liste des véhicules en promotion (uniquement disponibles)
  useEffect(() => {
    if (vehicules.length && promotions.length) {
      const enPromo = vehicules.filter((v) =>
        v.disponible && promotions.some((p) => p.vehiculesIds?.includes(v.id))
      );
      setVehiculesEnPromo(enPromo);
    }
  }, [vehicules, promotions]);

  // Fonction pour trouver les agences proches
  const findNearbyAgencies = async () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, general: "La géolocalisation n'est pas supportée par ce navigateur" }));
      return;
    }

    setGpsLoading(true);
    setErrors(prev => ({ ...prev, general: null }));

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
        setErrors(prev => ({ ...prev, general: null })); // Clear any previous errors on success
      } catch (apiError: any) {
        console.error("Erreur API agences:", apiError);
        setErrors(prev => ({ ...prev, general: "Erreur lors de la recherche d'agences proches" }));
      }
    } catch (geoError: any) {
      // Only log if it's not a permission denied error (which is expected)
      if (geoError.code !== 1) {
        console.error("Erreur de géolocalisation:", geoError);
      }
      
      setErrors(prev => ({
        ...prev,
        general: geoError.code === 1 ? "Veuillez autoriser l'accès à votre position pour trouver les agences proches" :
          geoError.code === 2 ? "Position indisponible. Vérifiez votre connexion GPS" :
          geoError.code === 3 ? "Timeout de géolocalisation. Réessayez plus tard" :
          "Erreur lors de l'obtention de votre position"
      }));
    } finally {
      setGpsLoading(false);
    }
  };

  // Gestion des états de chargement et d'erreur
  const hasAnyNetworkError = Object.values(errors).some(e => e === null) && (loading.vehicules || loading.promotions || loading.temoignages);
  const hasAnyError = Object.values(errors).some(e => e !== null);

  // Message d'attente professionnel quand le backend n'est pas accessible
  if (hasAnyNetworkError && !vehicules.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-1 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Démarrage du service
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Nous initialisons notre plateforme pour vous. Cela peut prendre quelques secondes.
          </p>
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
              <span>Connexion au serveur en cours</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errors.vehicules || errors.promotions || errors.temoignages) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {errors.vehicules || errors.promotions || errors.temoignages}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // État de chargement initial
  if (loading.vehicules || loading.promotions || loading.temoignages) {
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
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/hero-bg.png" alt="Hero background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/95 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 text-center px-6 max-w-6xl mx-auto w-full pt-10">
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 px-4 py-1.5 text-sm rounded-full backdrop-blur-md">✨ Premium Car Rental</Badge>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-50 to-blue-500 drop-shadow-lg">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed text-slate-300 font-medium">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-20">
              <Link
                to="/vehicules"
                className="inline-flex items-center justify-center h-14 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-[0_0_40px_-10px_rgba(37,99,235,0.8)] hover:shadow-[0_0_60px_-10px_rgba(37,99,235,1)] transition-all duration-300 transform hover:-translate-y-1"
              >
                Voir les véhicules
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center h-14 px-10 text-lg border-2 border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1"
              >
                Nous contacter
              </Link>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Section Publicité */}
        <div className="py-24 bg-gray-50 dark:bg-slate-950 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
          <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">{t('services.title')}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                Découvrez nos services complets pour une expérience de location exceptionnelle
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Assurance Card */}
              <Card className="group border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-10 text-center relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3 group-hover:rotate-6 transition-transform duration-300">
                    <span className="text-4xl grayscale brightness-110 group-hover:grayscale-0 transition-all duration-300">🛡️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('services.assurance.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{t('services.assurance.desc')}</p>
                  <Button className="mt-8 rounded-full border-2 border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-300 w-full" variant="ghost">
                    {t('buttons.learn_more')}
                  </Button>
                </CardContent>
              </Card>

              {/* GPS Card */}
              <Card className="group border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                <CardContent id="nearest-agencies" className="p-10 relative bg-white dark:bg-gray-900 h-full rounded-3xl z-10 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-blue-50 dark:from-emerald-900/40 dark:to-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner -rotate-3 group-hover:-rotate-6 transition-transform duration-300">
                    <span className="text-4xl grayscale brightness-110 group-hover:grayscale-0 transition-all duration-300">🗺️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('services.gps.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 font-medium">{t('services.gps.desc')}</p>

                  <div className="space-y-4">
                    <Button
                      onClick={findNearbyAgencies}
                      disabled={gpsLoading}
                      className="w-full rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-semibold py-6 shadow-md transition-all duration-300"
                    >
                      {gpsLoading ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          Recherche en cours...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-3 h-5 w-5" />
                          Trouver les agences proches
                        </>
                      )}
                    </Button>

                    {errors.general && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 rounded-xl">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm font-medium">{errors.general}</AlertDescription>
                      </Alert>
                    )}

                    {gpsLoading && nearbyAgencies.length === 0 && (
                      <div className="space-y-3 pt-4 text-left">
                        <Skeleton className="h-5 w-32 rounded-full" />
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-2xl">
                              <Skeleton className="w-10 h-10 rounded-full" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-40" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {nearbyAgencies.length > 0 && (
                      <div className="space-y-3 pt-4 text-left">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white px-2">Agences proches :</h4>
                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                          {nearbyAgencies.map((agency) => (
                            <div key={agency.id} className="group/agency flex items-center gap-3 p-4 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm">
                              {agency.logo ? (
                                <img
                                  src={resolveUrl(agency.logo)}
                                  alt={agency.name}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                                  {agency.name.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold truncate text-gray-900 dark:text-white text-sm">{agency.name}</p>
                                <p className="text-gray-500 dark:text-gray-400 truncate text-xs mt-0.5">{agency.address}</p>
                                {agency.distance && (
                                  <Badge variant="secondary" className="mt-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] px-1.5">
                                    {(agency.distance / 1000).toFixed(1)} km
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1.5 flex-col sm:flex-row opacity-80 group-hover/agency:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 rounded-full border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400"
                                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(agency.address)}`, '_blank')}
                                >
                                  <MapPin className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 rounded-full border-gray-200 dark:border-gray-700 hover:border-green-500 hover:text-green-600 dark:hover:border-green-400 dark:hover:text-green-400"
                                  onClick={() => window.open(`tel:${agency.phone}`, '_blank')}
                                >
                                  <Phone className="h-3.5 w-3.5" />
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

              {/* Assistance Card */}
              <Card className="group border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-10 text-center relative">
                  <div className="absolute top-0 right-0 w-1 h-0 bg-gradient-to-b from-orange-400 to-red-500 group-hover:h-full transition-all duration-700 delay-100"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-50 dark:from-orange-900/40 dark:to-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <span className="text-4xl grayscale brightness-110 group-hover:grayscale-0 transition-all duration-300">🛠️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('services.assistance.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{t('services.assistance.desc')}</p>
                  <Link to="/contact" className="block mt-8">
                    <Button className="w-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-6 shadow-lg hover:shadow-orange-500/25 transition-all duration-300">
                      {t('buttons.contact')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Section Témoignages */}
        <div className="py-24 bg-white dark:bg-slate-900 relative">
          <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
            <div className="text-center mb-20">
              <Badge className="mb-4 bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 border-teal-500/20 px-4 py-1.5 rounded-full">Avis Clients</Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">{t('testimonials.heading')}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                Découvrez ce que nos clients disent de leur expérience avec AutoDrive
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {temoignages.slice(-6).map((temoignage, index) => (
                <Card key={index} className="group hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2 border-0 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl" style={{ animationDelay: `${200 + index * 100}ms` }}>
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Avatar className="w-14 h-14 mr-4 border-2 border-white dark:border-gray-700 shadow-md">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">{temoignage.prenom[0]}{temoignage.nom[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">{temoignage.prenom} {temoignage.nom}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">⭐</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="text-6xl text-gray-200 dark:text-gray-700 absolute -top-6 -left-4 font-serif opacity-50 z-0">"</span>
                      <p className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed relative z-10 font-medium">
                        {temoignage.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="py-12 bg-gray-50 dark:bg-slate-950">
          <CarouselPlugin />
        </div>

        {/* Liste des véhicules disponibles */}
        <div className="py-24 bg-white dark:bg-slate-900 relative">
          <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
            <div className="flex flex-col items-center text-center mb-16">
              <Badge className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20 px-4 py-1.5 rounded-full">Flotte AutoDrive</Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">{t('vehicles.available_heading')}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                Choisissez parmi notre sélection premium
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {dispos.slice(0, 6).map((vehicule) => (
                <Link
                  to={`/vehicules/${vehicule.id}`}
                  key={vehicule.id}
                  className="no-underline text-inherit group block h-full"
                >
                  <Card className="h-full flex flex-col border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2">
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img
                        src={vehicule.photos?.[0] || "/placeholder.png"}
                        alt={`${vehicule.marque} ${vehicule.modele}`}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <h3 className="text-2xl font-bold text-white drop-shadow-md">
                          {vehicule.marque} <span className="font-light">{vehicule.modele || vehicule.immatriculation}</span>
                        </h3>
                      </div>
                      {vehicule.prix < 50 && (
                        <Badge variant="destructive" className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 shadow-lg px-3 py-1 font-bold">Promo</Badge>
                      )}
                    </div>
                    
                    <CardContent className="flex-1 p-6 flex flex-col justify-between">
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center font-medium capitalize bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg justify-center">
                          {vehicule.transmission}
                        </div>
                        <div className="flex items-center font-medium capitalize bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg justify-center">
                          {vehicule.carrosserie}
                        </div>
                      </div>
                      
                      <Separator className="mb-4" />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                            {vehicule.prix} € <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/ jour</span>
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                          →
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <Link to="/vehicules">
                <Button variant="outline" className="rounded-full px-10 py-6 text-base font-bold flex items-center gap-3 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all duration-300 shadow-[0_5px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-10px_rgba(37,99,235,0.3)]">
                  Voir tout le catalogue <span>→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Promo */}
        {vehiculesEnPromo.length > 0 && (
          <div className="py-24 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -m-32 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-20">
                <Badge className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border-purple-500/20 px-4 py-1.5 rounded-full text-sm">🔥 Offres Limitées</Badge>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">{t('vehicles.promo_heading')}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                  Profitez de nos offres promotionnelles exceptionnelles avant qu'elles n'expirent
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {vehiculesEnPromo.map((vehicule) => (
                  <Link
                    to={`/vehicules/${vehicule.id}`}
                    key={vehicule.id}
                    className="no-underline text-inherit group h-full block"
                  >
                    <Card
                      className="h-full flex flex-col border border-purple-100 dark:border-purple-900/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(147,51,234,0.2)] dark:hover:shadow-[0_20px_50px_-12px_rgba(147,51,234,0.4)] transition-all duration-500 hover:-translate-y-2 relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                      <div className="relative h-full bg-white dark:bg-gray-900 rounded-3xl flex flex-col overflow-hidden">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={vehicule.photos?.[0] || "/placeholder.png"}
                            alt={`${vehicule.marque} ${vehicule.modele}`}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge variant="destructive" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg border-0 px-3 py-1 font-bold tracking-wide">PROMO</Badge>
                          </div>
                        </div>

                        <CardContent className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {vehicule.marque} - {vehicule.modele || vehicule.immatriculation}
                            </h3>
                            {(() => {
                              const matchingPromotions = promotions.filter(p => p.vehiculesIds?.includes(vehicule.id));
                              const allCodes = matchingPromotions.flatMap(p => p.codesPromo).filter(code => code && code.trim());
                              if (allCodes.length > 0) {
                                return (
                                  <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50 rounded-xl inline-block w-full">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Code Promo :</p>
                                    <p className="font-mono font-bold text-lg text-purple-700 dark:text-purple-400">{allCodes.join(', ')}</p>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                          
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                              {vehicule.prix} € <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/ j</span>
                            </p>
                            <Button className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-105 transition-transform duration-300">
                              Voir l'Offre
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-800">
          <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">AutoDrive</h3>
                </div>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Votre partenaire de confiance pour la location de véhicules premium. Service de qualité, tarifs compétitifs, assurance totale.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-6 text-slate-100">Services Rapides</h4>
                <ul className="space-y-4 text-slate-400 font-medium">
                  <li><Link to="/vehicules" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Location automobile</Link></li>
                  <li><Link to="/vehicules" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Offres spéciales</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-6 text-slate-100">Navigation</h4>
                <ul className="space-y-4 text-slate-400 font-medium">
                  <li><Link to="/about" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>À propos de nous</Link></li>
                  <li><Link to="/faq" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Foire aux questions</Link></li>
                  <li><Link to="/contact" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Nous contacter</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-6 text-slate-100">Contact</h4>
                <div className="space-y-4 text-slate-400 font-medium">
                  <p className="flex items-center"><span className="mr-3 bg-slate-800 p-2 rounded-lg">📧</span> contact@autodrive.com</p>
                  <p className="flex items-center"><span className="mr-3 bg-slate-800 p-2 rounded-lg">📞</span> +228 22 22 67 89</p>
                  <p className="flex items-center"><span className="mr-3 bg-slate-800 p-2 rounded-lg">📍</span> Lomé, Togo</p>
                </div>
              </div>
            </div>
            
            <Separator className="bg-slate-800/50 mb-8" />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
              <p className="text-slate-500 text-sm font-medium text-center md:text-left">
                © {new Date().getFullYear()} AutoDrive. Tous droits réservés. {t('footer.copyright')}
              </p>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                <Link to="/about" className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium">{t('footer.about')}</Link>
                <Link to="/contact" className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium">{t('footer.contact')}</Link>
                <Link to="/faq" className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium">{t('footer.faq')}</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ar } from "date-fns/locale";
import { Link } from "react-router-dom";

type Articles = {
  [id: string]: {
    titre: string;
    categorie: "Actualité" | "Conseils" | "Promo";
    extrait: string;
    corps: string;
    photo?: string;
    idAdmin: string;
    dateRedaction: string;
  };
};

export const articles: Articles = {
  "1": {
    titre: "Nouveau modèle de BMW",
    categorie: "Actualité",
    extrait:
      "Découvrez le tout nouveau modèle BMW qui révolutionne le marché de l'automobile avec ses innovations technologiques.",
    corps: `La nouvelle BMW Series X arrive avec des caractéristiques impressionnantes qui redéfinissent le luxe automobile. Avec un moteur électrique de dernière génération, cette voiture combine performance et écologie. L'intérieur est équipé des dernières technologies d'assistance à la conduite et d'un système d'infodivertissement ultra-moderne.

Le constructeur allemand a mis les bouchées doubles pour offrir une expérience de conduite exceptionnelle. La puissance du moteur électrique atteint 530 chevaux, permettant d'accélérer de 0 à 100 km/h en seulement 3,9 secondes. L'autonomie annoncée est de 600 kilomètres selon le cycle WLTP, ce qui en fait l'une des voitures électriques les plus performantes de sa catégorie.

L'habitacle a été entièrement repensé pour offrir un confort maximal. Les sièges en cuir Nappa sont chauffants et ventilés, avec fonction massage intégrée. Le système audio Bowers & Wilkins Diamond Surround Sound dispose de 30 haut-parleurs pour une qualité sonore exceptionnelle. L'écran central de 14,9 pouces permet de contrôler toutes les fonctions du véhicule.

Côté technologie, BMW a intégré son dernier système d'assistance à la conduite de niveau 3. Le véhicule peut ainsi se conduire de manière autonome dans certaines conditions, notamment sur autoroute. Les caméras et capteurs permettent une surveillance à 360 degrés de l'environnement.

La recharge rapide est également au rendez-vous avec une capacité de charge de 200 kW, permettant de récupérer 80% de batterie en 30 minutes. Le système de charge bidirectionnelle permet même d'utiliser la batterie pour alimenter votre maison en cas de besoin.

Le design extérieur arbore la nouvelle signature lumineuse BMW avec des feux laser adaptatifs. La calandre iconique évolue avec un design plus épuré, intégrant des éléments lumineux. Les lignes sont fluides et aérodynamiques, avec un coefficient de traînée de seulement 0,23.

Prix de départ : 89 900 euros. Disponible en concession dès le mois prochain.`,
    idAdmin: "5",
    dateRedaction: "2025-12-01",
  },
  "2": {
    titre: "Comment changer de batterie",
    categorie: "Conseils",
    extrait:
      "Guide complet pour remplacer la batterie de votre véhicule en toute sécurité.",
    corps: `Changer une batterie de voiture est une opération simple si vous suivez les bonnes étapes. Assurez-vous d'avoir les bons outils et de débrancher d'abord la borne négative. Suivez notre guide détaillé pour effectuer cette opération sans risque.

Matériel nécessaire :
- Une clé à molette ou clé plate (généralement 10 ou 13mm)
- Des gants de protection
- Des lunettes de sécurité
- Une brosse métallique
- De la graisse diélectrique
- Un multimètre (optionnel mais recommandé)

Étape 1 : Préparation
Avant toute chose, assurez-vous que le contact est coupé et que tous les équipements électriques sont éteints (lumières, radio, climatisation). Retirez la clé du contact. Portez vos gants et lunettes de protection car les batteries contiennent de l'acide sulfurique.

Étape 2 : Localisation de la batterie
Dans la plupart des véhicules, la batterie se trouve sous le capot. Certains modèles la placent dans le coffre ou sous un siège. Consultez le manuel de votre véhicule si nécessaire.

Étape 3 : Déconnexion
ATTENTION : Commencez toujours par débrancher la borne négative (-), généralement de couleur noire. Cela évite tout risque de court-circuit. Utilisez votre clé pour desserrer l'écrou de la cosse, puis retirez-la délicatement. Faites de même avec la borne positive (+), rouge.

Étape 4 : Retrait de la batterie
Dévissez le système de fixation qui maintient la batterie en place. Soulevez la batterie avec précaution - elle peut peser entre 10 et 20 kg. Gardez-la bien droite pour éviter les fuites d'acide.

Étape 5 : Nettoyage
Profitez-en pour nettoyer le bac à batterie et les cosses avec une brosse métallique. Si vous constatez de la corrosion (dépôts blancs/verts), nettoyez avec un mélange d'eau et de bicarbonate de soude.

Étape 6 : Installation de la nouvelle batterie
Placez la nouvelle batterie dans le bon sens (vérifiez que les bornes correspondent). Fixez-la solidement avec le système de maintien. Nettoyez les bornes de la nouvelle batterie si nécessaire.

Étape 7 : Reconnexion
Connectez d'abord la borne POSITIVE (+), puis la borne négative (-). Serrez bien les écrous sans forcer excessivement. Appliquez une fine couche de graisse diélectrique sur les bornes pour prévenir la corrosion.

Étape 8 : Vérification
Démarrez le véhicule pour vérifier que tout fonctionne. Si vous avez un multimètre, vérifiez la tension : elle doit être entre 12,4 et 12,8V moteur éteint, et autour de 14V moteur tournant.

Recyclage : Ne jetez jamais votre ancienne batterie à la poubelle. Rapportez-la en magasin (souvent reprise gratuitement) ou en déchetterie. Les batteries contiennent des matériaux toxiques mais recyclables à 99%.

Conseils supplémentaires :
- Changez votre batterie tous les 4-5 ans en prévention
- Par temps froid, la batterie perd environ 30% de sa capacité
- Une batterie qui ne tient plus la charge peut endommager l'alternateur
- Conservez votre facture pour la garantie (généralement 2 ans)`,
    idAdmin: "6",
    dateRedaction: "2025-11-28",
  },
  "3": {
    titre: "Roulez 100km pour la moitié du prix",
    categorie: "Promo",
    extrait:
      "Offre exceptionnelle : réduction de 50% sur toutes nos locations longue durée ce mois-ci!",
    corps: `Profitez de notre promotion exclusive valable jusqu'à la fin du mois. Pour toute location de plus de 7 jours, bénéficiez de 50% de réduction sur le kilométrage supplémentaire. Une occasion unique de partir en voyage sans vous ruiner!

Cette offre s'inscrit dans notre volonté de rendre la location de véhicules accessible à tous. Nous savons que les longs trajets peuvent rapidement devenir coûteux, c'est pourquoi nous avons décidé de diviser par deux le prix du kilomètre supplémentaire pour toutes les locations d'une semaine ou plus.

Conditions de l'offre :
- Valable pour toute réservation effectuée avant le 31 décembre 2025
- Location minimum de 7 jours consécutifs
- Réduction de 50% sur les kilomètres au-delà du forfait inclus
- Applicable sur toutes nos catégories de véhicules
- Cumulable avec la carte de fidélité AutoDrive

Comment ça marche ?
Normalement, nos forfaits incluent un kilométrage de base (généralement 200 km/jour). Au-delà, chaque kilomètre supplémentaire est facturé 0,30€. Avec cette promotion, le kilomètre supplémentaire ne vous coûte que 0,15€ !

Exemple concret :
Vous louez une voiture pour 10 jours avec 2000 km inclus. Vous parcourez 3000 km.
- Sans promotion : 1000 km x 0,30€ = 300€ de surcoût
- Avec promotion : 1000 km x 0,15€ = 150€ de surcoût
Vous économisez 150€ !

Cette offre est parfaite pour :
- Les vacances en famille à l'autre bout du pays
- Les road trips entre amis
- Les déplacements professionnels longue distance
- La découverte de nouvelles régions sans contrainte

Nos clients témoignent :
"Grâce à cette promo, nous avons pu faire le tour de la France sans nous soucier du compteur kilométrique. Une vraie liberté !" - Marie, Lyon

"Pour mon déplacement professionnel de 15 jours, j'ai économisé plus de 400€. Je recommande vivement !" - Thomas, Paris

Toutes nos voitures sont :
- Régulièrement entretenues et vérifiées
- Assurées tous risques
- Équipées de GPS et climatisation
- Disponibles avec sièges bébé/enfant sur demande
- Livrables à votre domicile ou à l'aéroport

Catégories disponibles :
- Citadines économiques (Renault Clio, Peugeot 208...)
- Berlines confortables (Peugeot 508, Volkswagen Passat...)
- SUV spacieux (Peugeot 5008, Renault Austral...)
- Véhicules de luxe (BMW, Mercedes, Audi...)
- Utilitaires et monospaces pour les grands groupes

Réservation facile en 3 clics :
1. Choisissez vos dates et votre véhicule sur notre site
2. La réduction s'applique automatiquement
3. Confirmez et récupérez votre voiture

N'attendez plus ! Cette offre exceptionnelle se termine bientôt. Réservez dès maintenant sur autodrive.fr ou appelez-nous au 01 XX XX XX XX.

Service client disponible 7j/7 de 8h à 20h pour répondre à toutes vos questions.`,
    idAdmin: "7",
    dateRedaction: "2025-12-02",
  },
  "4": {
    titre: "Tesla Model 3 : Notre essai complet",
    categorie: "Actualité",
    extrait:
      "Nous avons testé la Tesla Model 3 pendant une semaine. Voici notre verdict sur cette voiture électrique populaire.",
    corps: `La Tesla Model 3 confirme son statut de référence dans le segment des berlines électriques. Avec une autonomie de 580 km, elle offre une expérience de conduite exceptionnelle grâce à son accélération instantanée et son système Autopilot avancé.

Notre essai s'est déroulé sur une semaine complète, avec des conditions de conduite variées : autoroute, ville, routes de campagne, par tous les temps. Voici notre analyse détaillée.

Design et premier contact :
La Model 3 arbore un design épuré et moderne. Les lignes sont fluides, le coefficient aérodynamique de 0,23 est excellent. L'absence de calandre frontale peut surprendre au début, mais on s'y habitue vite. Les jantes de 19 pouces de notre modèle d'essai lui donnent une vraie présence sur la route.

L'intérieur minimaliste :
En ouvrant la porte, on découvre un habitacle radicalement différent des voitures traditionnelles. Un seul écran central de 15 pouces domine la planche de bord. Pas de compteur devant le conducteur, pas de boutons physiques (ou presque). Tout se contrôle via l'écran tactile. Cette approche divise : certains adorent la simplicité, d'autres regrettent les commandes physiques.

Qualité de fabrication :
Tesla a fait d'énormes progrès sur ce point. Les ajustements sont corrects, les matériaux agréables au toucher. Les sièges en similicuir végétal sont confortables, même sur longs trajets. L'insonorisation est bonne, même si on entend davantage les bruits de roulement que dans une berline premium allemande.

Performances époustouflantes :
Notre version Long Range développe 366 chevaux et propulse les 1,8 tonnes de 0 à 100 km/h en 4,4 secondes. L'accélération linéaire et instantanée du moteur électrique procure des sensations grisantes. À chaque feu rouge, on se surprend à écraser l'accélérateur pour sentir cette poussée. La transmission intégrale assure une motricité parfaite en toutes circonstances.

Tenue de route et confort :
Le centre de gravité bas (batterie au plancher) confère une tenue de route remarquable. La Model 3 se comporte comme une propulsion sportive dans les virages. La direction est précise, peut-être un peu trop assistée à basse vitesse. Le mode "Sport" raffermit les suspensions pour une conduite plus dynamique. Le mode "Confort" adoucit l'ensemble, idéal pour les longs trajets.

Autonomie et recharge :
Tesla annonce 580 km d'autonomie WLTP. Dans les faits, nous avons obtenu environ 480 km en conditions mixtes (autoroute + ville, températures autour de 15°C). C'est très correct. Sur autoroute à 130 km/h constant, comptez plutôt 400 km. En ville, l'autonomie explose : nous avons dépassé les 600 km lors de notre test urbain grâce à la régénération au freinage.

La recharge sur Superchargeur Tesla est bluffante : 250 kW de puissance permettent de récupérer 275 km en 15 minutes. Le réseau de Superchargeurs est dense et fiable. Sur borne publique, la charge est plus lente mais reste acceptable (11 kW en AC, jusqu'à 170 kW en DC).

L'Autopilot :
Le système d'aide à la conduite de Tesla impressionne. Sur autoroute, il maintient la voiture dans sa voie, gère la distance de sécurité, change de file sur demande. Attention, ce n'est PAS une conduite autonome : le conducteur doit rester vigilant et garder les mains sur le volant. En ville, le système reconnaît les feux, les panneaux, les piétons. C'est bluffant technologiquement, même s'il faut rester prudent.

Technologies embarquées :
L'écran central gère tout : navigation, musique, climatisation, réglages du véhicule. Le système est fluide et réactif. Netflix, YouTube et jeux vidéo sont disponibles à l'arrêt. La mise à jour OTA (Over The Air) améliore régulièrement le véhicule, ajoutant de nouvelles fonctions. Notre Model 3 d'essai a reçu une mise à jour en pleine semaine, ajoutant de nouveaux jeux !

Coûts d'usage :
L'électricité coûte bien moins cher que l'essence. Rechargée à domicile en heures creuses, la Model 3 revient à environ 2€/100 km. L'entretien est minimal : pas de vidange, pas d'embrayage, pas de courroie de distribution. Tesla recommande une révision tous les 2 ans ou 40 000 km. Le coût d'entretien est divisé par 3 ou 4 par rapport à une thermique.

Points forts :
+ Performances exceptionnelles
+ Autonomie réelle très correcte
+ Réseau Superchargeur efficace
+ Technologie de pointe
+ Coûts d'usage faibles
+ Mises à jour régulières
+ Insonorisation correcte

Points faibles :
- Suspension ferme sur mauvais revêtement
- Ergonomie 100% tactile pas pour tout le monde
- Absence de CarPlay/Android Auto
- Finition intérieure encore perfectible
- Prix élevé (à partir de 42 990€)

Verdict :
La Tesla Model 3 mérite son succès. C'est une voiture électrique aboutie, performante, technologique et pratique au quotidien. Elle n'est pas parfaite (suspension, ergonomie), mais elle représente aujourd'hui la référence du segment. Si vous cherchez une berline électrique, c'est un choix difficile à contourner.

Note globale : 8,5/10`,
    idAdmin: "5",
    dateRedaction: "2025-11-30",
  },
  "5": {
    titre: "5 astuces pour économiser du carburant",
    categorie: "Conseils",
    extrait:
      "Réduisez votre consommation de carburant avec ces conseils pratiques et faciles à appliquer.",
    corps: `Pour économiser du carburant, adoptez une conduite souple en anticipant les freinages, maintenez une vitesse constante, vérifiez régulièrement la pression de vos pneus, retirez les charges inutiles et utilisez la climatisation avec modération.`,
    idAdmin: "6",
    dateRedaction: "2025-11-25",
  },
  "6": {
    titre: "Week-end prolongé à -30%",
    categorie: "Promo",
    extrait:
      "Réservez votre véhicule pour le prochain week-end prolongé et économisez 30%!",
    corps: `Planifiez votre escapade du week-end prochain avec notre offre spéciale. Toutes nos catégories de véhicules sont disponibles avec une réduction de 30% pour les réservations de 3 jours minimum ce week-end.`,
    idAdmin: "7",
    dateRedaction: "2025-12-03",
  },
  "7": {
    titre: "Mercedes EQS : Le luxe électrique",
    categorie: "Actualité",
    extrait:
      "Mercedes-Benz dévoile l'EQS, sa berline électrique de luxe qui rivalise avec les meilleures.",
    corps: `L'EQS de Mercedes représente le summum du luxe électrique. Avec son écran MBUX Hyperscreen de 141 cm, son autonomie de 780 km et son niveau de confort exceptionnel, elle redéfinit les standards de la catégorie premium électrique.`,
    idAdmin: "5",
    dateRedaction: "2025-11-29",
  },
  "8": {
    titre: "Entretien hivernal : Ce qu'il faut savoir",
    categorie: "Conseils",
    extrait:
      "Préparez votre voiture pour l'hiver avec notre checklist complète d'entretien.",
    corps: `L'hiver approche et votre véhicule nécessite une attention particulière. Vérifiez l'antigel, testez votre batterie, contrôlez l'état de vos pneus et assurez-vous que vos essuie-glaces sont en bon état. N'oubliez pas de préparer un kit d'urgence.`,
    idAdmin: "6",
    dateRedaction: "2025-11-26",
  },
  "9": {
    titre: "Clients fidèles : 40% de réduction",
    categorie: "Promo",
    extrait:
      "Vous êtes client AutoDrive depuis plus d'un an? Cette offre est pour vous!",
    corps: `Pour remercier nos clients fidèles, nous offrons 40% de réduction sur votre prochaine location. Cette promotion exclusive est réservée à nos membres qui nous font confiance depuis plus d'un an. Utilisez le code FIDELE40 lors de votre réservation.`,
    idAdmin: "7",
    dateRedaction: "2025-12-01",
  },
  "10": {
    titre: "Porsche Taycan : Performance électrique",
    categorie: "Actualité",
    extrait:
      "La Porsche Taycan prouve que performance et électrique peuvent faire bon ménage.",
    corps: `La Taycan Turbo S atteint les 100 km/h en 2,8 secondes tout en offrant 450 km d'autonomie. Porsche démontre qu'une voiture électrique peut procurer les mêmes sensations qu'une sportive thermique, avec le silence et l'efficacité en plus.`,
    idAdmin: "5",
    dateRedaction: "2025-11-27",
  },
  "11": {
    titre: "Comment bien vérifier ses pneus",
    categorie: "Conseils",
    extrait:
      "La sécurité commence par de bons pneus. Apprenez à les vérifier correctement.",
    corps: `Vérifiez régulièrement la pression de vos pneus (à froid), contrôlez la profondeur des sculptures (minimum 1,6mm légal, 3mm recommandé en hiver), inspectez les flancs pour détecter coupures ou hernies, et n'oubliez pas la roue de secours.`,
    idAdmin: "6",
    dateRedaction: "2025-11-24",
  },
  "12": {
    titre: "Black Friday : Jusqu'à -50%",
    categorie: "Promo",
    extrait:
      "Notre plus grosse promotion de l'année! Locations à -50% pendant le Black Friday!",
    corps: `Pour le Black Friday, toutes nos locations sont à -50% pour les réservations effectuées ce vendredi. Voitures citadines, SUV, véhicules de luxe... Tous nos véhicules sont concernés. Offre limitée aux 100 premières réservations!`,
    idAdmin: "7",
    dateRedaction: "2025-11-22",
  },
  "13": {
    titre: "Audi e-tron GT : L'élégance électrique",
    categorie: "Actualité",
    extrait:
      "Audi lance sa GT électrique, alliant design sublime et performances exceptionnelles.",
    corps: `L'e-tron GT combine l'élégance d'une GT avec la technologie électrique de pointe. Son design épuré cache une mécanique capable de délivrer jusqu'à 646 ch en version RS, pour un 0 à 100 en 3,3 secondes et 487 km d'autonomie.`,
    idAdmin: "5",
    dateRedaction: "2025-11-23",
  },
  "14": {
    titre: "Conduite sur neige : Les bons réflexes",
    categorie: "Conseils",
    extrait:
      "Apprenez à conduire en toute sécurité sur routes enneigées avec nos conseils d'experts.",
    corps: `Sur la neige, réduisez votre vitesse, augmentez les distances de sécurité, évitez les mouvements brusques, utilisez les rapports inférieurs pour freiner et équipez-vous de pneus hiver. En cas de dérapage, braquez dans le sens de la glissade.`,
    idAdmin: "6",
    dateRedaction: "2025-11-20",
  },
  "15": {
    titre: "Étudiants : -25% toute l'année",
    categorie: "Promo",
    extrait:
      "Vous êtes étudiant? Profitez de notre réduction permanente sur toutes nos locations!",
    corps: `AutoDrive soutient les étudiants avec une remise de 25% valable toute l'année sur présentation de votre carte étudiante. Que ce soit pour rentrer chez vos parents ou partir en week-end entre amis, louez moins cher!`,
    idAdmin: "7",
    dateRedaction: "2025-11-21",
  },
  "16": {
    titre: "Renault Mégane E-Tech : L'électrique française",
    categorie: "Actualité",
    extrait:
      "Renault dévoile sa nouvelle Mégane 100% électrique au design audacieux.",
    corps: `La Mégane E-Tech Electric marque un tournant pour Renault avec sa plateforme CMF-EV dédiée. Proposée avec des batteries de 40 ou 60 kWh, elle offre jusqu'à 470 km d'autonomie et se recharge à 80% en 30 minutes sur borne rapide.`,
    idAdmin: "5",
    dateRedaction: "2025-11-19",
  },
  "17": {
    titre: "Décrypter les voyants du tableau de bord",
    categorie: "Conseils",
    extrait:
      "Comprenez ce que signifient les différents voyants de votre tableau de bord.",
    corps: `Les voyants rouges indiquent un problème grave nécessitant un arrêt immédiat (température moteur, pression d'huile). Les voyants orange signalent un dysfonctionnement à surveiller. Les voyants verts ou bleus sont informatifs. Consultez votre manuel pour les symboles spécifiques.`,
    idAdmin: "6",
    dateRedaction: "2025-11-18",
  },
  "18": {
    titre: "Noël approche : Offrez des kilomètres!",
    categorie: "Promo",
    extrait:
      "Nouvelle idée cadeau : nos cartes cadeaux location valables un an!",
    corps: `Offrez la liberté de voyager avec nos cartes cadeaux AutoDrive. Disponibles de 50€ à 500€, elles sont valables un an sur toutes nos locations. Le cadeau parfait pour les amateurs de road trips et de liberté!`,
    idAdmin: "7",
    dateRedaction: "2025-12-04",
  },
  "19": {
    titre: "Hyundai Ioniq 5 : Le SUV électrique réinventé",
    categorie: "Actualité",
    extrait:
      "Le Ioniq 5 de Hyundai surprend par son design rétro-futuriste et ses technologies innovantes.",
    corps: `Avec son design inspiré des années 70, le Ioniq 5 ne passe pas inaperçu. Mais c'est sous le capot que l'innovation opère : charge ultra-rapide 800V (10 à 80% en 18 minutes), fonction V2L pour alimenter des appareils, et jusqu'à 481 km d'autonomie.`,
    idAdmin: "5",
    dateRedaction: "2025-11-17",
  },
  "20": {
    titre: "Préparer son véhicule avant un long trajet",
    categorie: "Conseils",
    extrait: "Checklist complète pour partir serein sur la route des vacances.",
    corps: `Avant un long trajet, vérifiez les niveaux (huile, liquide de refroidissement, lave-glace), contrôlez l'éclairage, testez les freins, ajustez la pression des pneus, préparez un kit de sécurité et planifiez vos pauses toutes les 2 heures.`,
    idAdmin: "6",
    dateRedaction: "2025-11-16",
  },
};

export default function Blog() {
  return (
    <>
      <title>Blog - AutoDrive</title>

      <h1 className="text-2xl font-bold">Blog</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(articles).map(([id, article]) => (
          <Card key={id} className="overflow-hidden pt-0">
            <CardHeader className={cn("relative p-0")}>
              <Badge
                className={cn(
                  "absolute top-1 left-1 z-10",
                  article.categorie === "Actualité" && "bg-blue-500 text-white",
                  article.categorie === "Conseils" && "bg-green-500 text-white",
                  article.categorie === "Promo" && "bg-yellow-500 text-white"
                )}
              >
                {article.categorie}
              </Badge>
              {article.photo ? (
                <img
                  src={article.photo[0]}
                  alt={`${article.photo}`}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                  Pas d'image
                </div>
              )}
              <CardTitle>{article.titre}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4 space-y-2 text-left">
                <p>{article.extrait}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Date de rédaction: {articles[String(id)]?.dateRedaction}
                </p>
                <Link to={`article/${id}`}>
                  <Button variant="outline">Lire</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

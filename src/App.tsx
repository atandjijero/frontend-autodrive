import "./App.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages";
import Vehicules from "@/pages/vehicules/vehicules";
import Vehicule from "./pages/vehicules/vehicule";
import Connexion from "@/pages/auth/connexion";
import { NavMenu } from "./components/layout/navMenu";
import Inscription from "@/pages/auth/inscription";
import { OtpForm } from "@/components/forms/otpform";
import PassOublieForm from "@/components/forms/passOublieForm";
import ForgotPasswordForm from "@/components/forms/forgotpasswordform";
import ReservationForm from "@/components/forms/ReservationForm";
import PaymentForm from "./components/forms/PaymentForm";
import DashboardClient from "@/pages/client/DashboardClient";
import DashboardEntreprise from "@/pages/entreprise/DashboardEntreprise";
import DashboardTouriste from "@/pages/touriste/DashboardTouriste";
import ProfileWithLayout from "@/pages/ProfileWithLayout";
import TemoignagesWithLayout from "@/pages/TemoignagesWithLayout";




import About from "@/pages/about";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import { Toaster } from "./components/ui/sonner";

//  Nouveau dashboard shadcn/ui
import DashboardPage from "@/app/dashboard/page";
import Profil from "@/pages/admin/Profil";
import VehiculesAjout from "./pages/admin/vehiculesAjout";
import VehiculesListe from "./pages/admin/vehiculesListe";
import VehiculesModif from "./pages/admin/vehiculesModif";
import ReservationList from "./pages/reservations/ReservationList";
import PaiementsList from "./pages/admin/paiements/paiementsListe";
import Admin from "./pages/admin/admin";

import Blog from "@/pages/blog/blog_new";
import Article from "./pages/blog/article";
import ClientsListe from "./pages/admin/clientsListe";
import PromotionsAjout from "./pages/admin/promotions/PromotionsAjout";
import PromotionsListe from "./pages/admin/promotions/PromotionsListe";
import PromotionsActives from "./pages/admin/promotions/PromotionsActives";
import PromotionsUpdate from "./pages/admin/promotions/PromotionsUpdate";
import PromotionsAppliquer from "./pages/admin/promotions/PromotionsAppliquer";
import AdminNotifications from "@/pages/admin/notifications";
import AdminContacts from "@/pages/admin/contacts";
import AgencesListe from "./pages/admin/agencesListe";
import AgencesAjout from "./pages/admin/agencesAjout";
import AgencesModif from "./pages/admin/agencesModif";
import AgencesImport from "./pages/admin/agencesImport";
import AdminBlog from "@/pages/admin/blog";



function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <NavMenu />
            <Toaster richColors closeButton />
            <div className="w-full min-h-screen">
              <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicules" element={<Vehicules />} />
            <Route path="/vehicules/:id" element={<Vehicule />} />
            <Route
              path="/reservation/:vehicleId"
              element={<ReservationForm />}
            />
            <Route path="/paiement/:reservationId" element={<PaymentForm />} />
            
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/otp" element={<OtpForm />} />
            <Route path="/reset-password/:token" element={<PassOublieForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            {/* Dashboards par rôle */}
            <Route path="/client/dashboard" element={<DashboardClient />} />
            <Route path="/client/profil" element={<ProfileWithLayout role="client" />} />
            <Route path="/client/temoignages" element={<TemoignagesWithLayout role="client" />} />
            <Route path="/client/reservations" element={<ReservationList />} />
            <Route path="/entreprise/dashboard" element={<DashboardEntreprise />} />
            <Route path="/entreprise/profil" element={<ProfileWithLayout role="entreprise" />} />
            <Route path="/entreprise/temoignages" element={<TemoignagesWithLayout role="entreprise" />} />
            <Route path="/entreprise/reservations" element={<ReservationList />} />
            <Route path="/touriste/dashboard" element={<DashboardTouriste />} />
            <Route path="/touriste/profil" element={<ProfileWithLayout role="touriste" />} />
            <Route path="/touriste/temoignages" element={<TemoignagesWithLayout role="touriste" />} />
            <Route path="/touriste/reservations" element={<ReservationList />} />
            {/* Routes admin avec le nouveau dashboard */}
            <Route path="/admin" element={<Admin />}>
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="blog/create" element={<AdminBlog />} />
            <Route path="blog/published" element={<AdminBlog />} />
            <Route path="blog/drafts" element={<AdminBlog />} />
            <Route path="profil" element={<Profil />} />
            <Route path="vehicules/ajouter" element={<VehiculesAjout />} />
            <Route path="vehicules/liste" element={<VehiculesListe />} />
            <Route path="vehicules/modifier/:id" element={<VehiculesModif />} />
            <Route path="reservations/liste" element={<ReservationList />} />
            <Route path="paiements/liste" element={<PaiementsList />} />
            <Route path="clients/liste" element={<ClientsListe />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/*  Routes Promotions */}
            <Route path="promotions/ajouter" element={<PromotionsAjout />} />
            <Route path="promotions/liste" element={<PromotionsListe />} />
            <Route path="promotions/actives" element={<PromotionsActives />} />
            <Route path="promotions/update/:id" element={<PromotionsUpdate />} />
            <Route path="promotions/appliquer" element={<PromotionsAppliquer />} />

            {/* Routes Agences */}
            <Route path="agences/liste" element={<AgencesListe />} />
            <Route path="agences/ajouter" element={<AgencesAjout />} />
            <Route path="agences/modifier/:id" element={<AgencesModif />} />
            <Route path="agences/importer" element={<AgencesImport />} />
            </Route>


            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Article />} />
            <Route path="/blog/article/:id" element={<Article />} />
            
            {/* correction */}
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
    </HelmetProvider>
    </AuthProvider>
  );
}

export default App;

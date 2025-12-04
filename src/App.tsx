import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
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

import About from "@/pages/about";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import { Toaster } from "./components/ui/sonner";

//  Nouveau dashboard shadcn/ui
import DashboardPage from "@/app/dashboard/page";
import Profil from "@/pages/admin/Profil";
import VehiculesAjout from "./pages/admin/vehiculesAjout";
import VehiculesListe from "./pages/admin/vehiculesListe";
import Admin from "./pages/admin/admin";

import Blog from "./pages/blog/blog";
import Article from "./pages/blog/article";

function App() {
  return (
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
            <Route path="/paiement" element={<PaymentForm />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/otp" element={<OtpForm />} />
            <Route path="/reset-password/:token" element={<PassOublieForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            {/* Routes admin avec le nouveau dashboard */}
            <Route path="/admin" element={<Admin />}>
              <Route path="profil" element={<Profil />} />
              <Route path="vehicules/ajouter" element={<VehiculesAjout />} />
              <Route path="vehicules/liste" element={<VehiculesListe />} />
              {/* Routes pour le dashboard */}
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>

            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/article/:id" element={<Article />} />

            {/* correction */}
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

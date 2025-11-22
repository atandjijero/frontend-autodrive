import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages";
import Vehicules from "@/pages/vehicules/vehicules";
import Vehicule from "./pages/vehicules/vehicule";
import Inscription from "@/pages/auth/inscription";
import Connexion from "@/pages/auth/connexion";
import PassOublie from "@/pages/auth/passOublie";
import { NavMenu } from "./components/layout/navMenu";

// 👉 Nouvelles pages
import About from "@/pages/about";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";

// 👉 Admin layout + pages
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/dashboard";
import ReservationsPage from "@/pages/admin/ReservationsPage";
import VehiculesPage from "@/pages/admin/VehiculesPage";
import ClientsPage from "@/pages/admin/ClientsPage";
import PaiementsPage from "@/pages/admin/PaiementsPage";
import ProfilPage from "@/pages/admin/ProfilPage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavMenu />
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicules" element={<Vehicules />} />
          <Route path="/vehicules/:id" element={<Vehicule />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/passOublie" element={<PassOublie />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Routes Admin avec layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="vehicules" element={<VehiculesPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="paiements" element={<PaiementsPage />} />
            <Route path="profil" element={<ProfilPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

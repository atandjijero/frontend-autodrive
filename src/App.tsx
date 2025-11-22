import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages";
import Vehicules from "@/pages/vehicules/vehicules";
import Admin from "@/pages/admin/admin";
import VehiculesListe from "./pages/admin/vehiculesListe";
import Inscription from "@/pages/auth/inscription";
import Connexion from "@/pages/auth/connexion";
import PassOublie from "@/pages/auth/passOublie";
import { NavMenu } from "./components/layout/navMenu";
import AdminDashboard from "./pages/admin/dashboard";
import VehiculesAjout from "./pages/admin/vehiculesAjout";
import VehiculesModif from "./pages/admin/vehiculesModif";
import VehiculesSuppr from "./pages/admin/vehiculesSuppr";
import ClientsListe from "./pages/admin/clientsListe";
import ClientsModif from "./pages/admin/clientsModif";
import ClientsSuppr from "./pages/admin/clientsSuppr";
import ContratsListe from "./pages/admin/contrats";
import Vehicule from "./pages/vehicules/vehicule";

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <NavMenu />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicules" element={<Vehicules />} />
            <Route path="/vehicules/:id" element={<Vehicule />} />
            <Route path="/admin" element={<Admin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="vehiculesListe" element={<VehiculesListe />} />
              <Route path="vehiculesAjout" element={<VehiculesAjout />} />
              <Route path="vehiculesModif/:id" element={<VehiculesModif />} />
              <Route path="vehiculesSuppr/:id" element={<VehiculesSuppr />} />
              <Route path="clientsListe" element={<ClientsListe />} />
              <Route path="clientsModif/:id" element={<ClientsModif />} />
              <Route path="clientsSuppr/:id" element={<ClientsSuppr />} />
              <Route path="contrats" element={<ContratsListe />} />
            </Route>
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/passOublie" element={<PassOublie />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;

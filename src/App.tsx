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
import Dashboard from "@/pages/admin/dashboard";
import AdminLayout from "@/pages/admin/AdminLayout";
import Profil from "@/pages/admin/Profil";
import PassOublieForm from "@/components/forms/passOublieForm";
import ForgotPasswordForm from "@/components/forms/forgotpasswordform";

import About from "@/pages/about";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavMenu />
        <Toaster richColors closeButton />{" "}
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicules" element={<Vehicules />} />
          <Route path="/vehicules/:id" element={<Vehicule />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/otp" element={<OtpForm />} />
          <Route path="/reset-password/:token" element={<PassOublieForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />

          {/* Routes admin imbriquées */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profil" element={<Profil />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

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

import About from "@/pages/about";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="w-full min-h-screen">
          <NavMenu />
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
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

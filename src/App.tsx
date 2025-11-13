import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import Vehicules from "@/pages/vehicules";
import Admin from "@/pages/admin";
import Inscription from "@/pages/inscription";
import Connexion from "@/pages/connexion";
import { NavMenu } from "./components/navMenu";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavMenu />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicules" element={<Vehicules />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

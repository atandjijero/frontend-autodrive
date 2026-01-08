import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type User = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: "admin" | "client" | "entreprise" | "tourist";
  token: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: Omit<User, "token">, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Vérifie si un token est en localStorage
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("userRole");
    const id = localStorage.getItem("userId");
    const nom = localStorage.getItem("userNom");
    const prenom = localStorage.getItem("userPrenom");

    if (token && email && id && role && nom && prenom) {
      setUser({ id, email, nom, prenom, role: role as User["role"], token });
    }
  }, []);

  const login = (userData: Omit<User, "token">, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userNom", userData.nom);
    localStorage.setItem("userPrenom", userData.prenom);
    localStorage.setItem("userRole", userData.role);
    setUser({ ...userData, token });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

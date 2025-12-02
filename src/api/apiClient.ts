import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// ---------------- DTOs ----------------
export interface CreateUserDto {
  nom: string;
  prenom: string;
  email: string;
  motPasse: string;
  telephone: string;
  telephoneSecondaire?: string;
  adresse?: string;
  role?: "admin" | "client" | "entreprise" | "tourist";
}

export interface LoginDto {
  email: string;
  motPasse: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfile {
  id: string; // ⚠️ ton backend renvoie "id" et non "_id"
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  role: "admin" | "client" | "entreprise" | "tourist";
  dateInscription?: string;
  avatar?: string;
}

// ---------------- Axios Config ----------------
const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:9000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.error("Non authentifié : veuillez vous connecter.");
      } else if (status === 403) {
        console.error("Accès interdit : rôle insuffisant ou token invalide.");
      } else if (status >= 500) {
        console.error("Erreur serveur :", error.response.data);
      }
    } else {
      console.error("Erreur réseau ou serveur injoignable :", error.message);
    }
    return Promise.reject(error);
  }
);

// ---------------- AUTH ----------------
export const register = (data: CreateUserDto) =>
  apiClient.post("/auth/register", data);

export interface LoginResponse {
  message?: string;
  requiresOtp: boolean;
  access_token?: string;
  role?: string;
  email?: string;
  nom?: string;
  prenom?: string;
  id?: string;   // ⚠️ backend renvoie "id"
  _id?: string;  // garder pour compatibilité si jamais backend change
}

export const login = (data: LoginDto) =>
  apiClient.post<LoginResponse>("/auth/login", data);

export interface VerifyOtpResponse {
  access_token: string;
  role: string;
  email?: string;
  nom?: string;
  prenom?: string;
}

export const verifyOtp = (data: VerifyOtpDto) =>
  apiClient.post<VerifyOtpResponse>("/auth/verify-otp", data);

export const forgotPassword = (data: ForgotPasswordDto) =>
  apiClient.post<{ message: string }>("/auth/forgot-password", data);

export const resetPassword = (data: ResetPasswordDto) =>
  apiClient.post<{ message: string }>("/auth/reset-password", data);

export const getProfile = () =>
  apiClient.get<UserProfile>("/auth/profil");

// ---------------- VEHICULES ----------------
export interface CreateVehicleDto {
  carrosserie: string;
  modele: string;
  marque: string;
  transmission: "automatique" | "manuelle";
  prix: number;
  photos?: string[];
  immatriculation: string;
  disponible?: boolean;
}

export interface Vehicle {
  _id: string;
  carrosserie: string;
  modele: string;
  marque: string;
  transmission: string;
  prix: number;
  photos: string[];
  immatriculation: string;
  disponible: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const addVehicle = (data: FormData) =>
  apiClient.post<Vehicle>("/vehicles", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getVehicles = () =>
  apiClient.get<Vehicle[]>("/vehicles");

export const getVehicleById = (id: string) =>
  apiClient.get<Vehicle>(`/vehicles/${id}`);

export const updateVehicle = (id: string, data: Partial<CreateVehicleDto>) =>
  apiClient.put<Vehicle>(`/vehicles/${id}`, data);

export const deleteVehicle = (id: string) =>
  apiClient.delete<Vehicle>(`/vehicles/${id}`);

export const markVehicleUnavailable = (id: string) =>
  apiClient.put<Vehicle>(`/vehicles/${id}/unavailable`);

export const markVehicleAvailable = (id: string) =>
  apiClient.put<Vehicle>(`/vehicles/${id}/available`);

// ---------------- RESERVATIONS ----------------
export interface CreateReservationDto {
  vehicleId: string;
  clientId: string;
  dateDebut: string;
  dateFin: string;
}

export interface Reservation {
  _id: string;
  vehicleId: string;
  clientId: string;
  dateDebut: string;
  dateFin: string;
  statut: "en cours" | "terminée" | "annulée";
}

export const addReservation = (data: CreateReservationDto) =>
  apiClient.post<Reservation>("/reservations", data);

export const getReservations = () =>
  apiClient.get<Reservation[]>("/reservations");

export const getReservationById = (id: string) =>
  apiClient.get<Reservation>(`/reservations/${id}`);

export const deleteReservation = (id: string) =>
  apiClient.delete<Reservation>(`/reservations/${id}`);

export default apiClient;

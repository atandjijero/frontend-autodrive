import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// DTOs alignés avec ton backend NestJS
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
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  role: "admin" | "client" | "entreprise" | "tourist";
  dateInscription?: string;
}

// Configuration Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:9000", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token JWT automatiquement
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  Fonctions API alignées avec AuthController
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

export default apiClient;

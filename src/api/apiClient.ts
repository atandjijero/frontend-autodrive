import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

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
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  telephoneSecondaire?: string;
  adresse?: string;
  photo?: string;
  avatar?: string;
  role: "admin" | "client" | "entreprise" | "tourist";
  dateInscription?: string;
}

// Agency DTOs
export interface LocationDto {
  latitude: number;
  longitude: number;
}

export interface CreateAgencyDto {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  manager?: string;
  description?: string;
  logo?: string;
  location?: LocationDto;
  isActive?: boolean;
}

export interface UpdateAgencyDto {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  manager?: string;
  description?: string;
  logo?: string;
  location?: LocationDto;
  isActive?: boolean;
}

export interface Agency {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  manager?: string;
  description?: string;
  logo?: string;
  location?: LocationDto;
  distance?: number; // Distance en mètres depuis la position de l'utilisateur
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgenciesListResponseDto {
  data: Agency[];
  total: number;
  page: number;
  limit: number;
}

// ---------------- Axios Config ----------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper pour résoudre les URLs d'assets retournées par le backend.
// Si le backend renvoie un chemin relatif (ex: "/uploads/xyz.jpg"),
// on le préfixe avec la baseURL de l'API pour former une URL absolue.
// Pour les noms de fichiers d'agences, on ajoute le préfixe /uploads/agencies/
export function resolveUrl(input?: unknown) {
  if (!input) return "";

  // Handle arrays (take first element)
  if (Array.isArray(input)) {
    return resolveUrl(input[0]);
  }

  // Handle objects with common fields
  if (typeof input === "object") {
    const obj: any = input as any;
    if (obj.url) return resolveUrl(obj.url);
    if (obj.path) return resolveUrl(obj.path);
    if (obj.filename) return resolveUrl(obj.filename);
    return "";
  }

  const path = String(input);
  if (!path) return "";

  try {
    // If it's an absolute URL, return as-is
    const url = new URL(path);
    return url.href;
  } catch (e) {
    // Relative path -> prefix with API base
    if (path.startsWith("/")) {
      return `${apiClient.defaults.baseURL}${path}`;
    }
    // Pour les noms de fichiers d'agences (sans / au début), ajouter le préfixe uploads/agencies/
    // Cela couvre les cas où le backend retourne juste le filename
    return `${apiClient.defaults.baseURL}/uploads/agencies/${path}`;
  }
}

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Debug: log whether Authorization header is present
  try {
    const hasAuth = !!config.headers?.Authorization;
    // Mask token for debug (show first/last 4 chars)
    let masked = null;
    if (token) {
      masked = `${token.slice(0, 4)}...${token.slice(-4)}`;
    }
    // Use console.debug so it's easy to filter in devtools
    console.debug("apiClient request:", config.method, config.url, "hasAuthorization:", hasAuth, "token:", masked);
  } catch (e) {
    // ignore logging errors
  }
  return config;
});

// Intercepteur de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const respData = error.response.data;
      if (status === 401) {
        console.error("Non authentifié : veuillez vous connecter.", { status, respData });
        try {
          toast.error("Session expirée ou non autorisée — veuillez vous reconnecter");
        } catch (e) { }
        // Redirect to login page
        try {
          window.location.replace('/connexion');
        } catch (e) { }
      } else if (status === 403) {
        console.error("Accès interdit : rôle insuffisant ou token invalide.", { status, respData });
        try { toast.error("Accès interdit"); } catch (e) { }
      } else if (status >= 500) {
        try {
          console.error("Erreur serveur :", status, JSON.stringify(respData, null, 2));
        } catch (e) {
          console.error("Erreur serveur :", status, respData);
        }
      } else {
        try {
          console.error("Erreur API :", status, JSON.stringify(respData, null, 2));
        } catch (e) {
          console.error("Erreur API :", status, respData);
        }
      }
    } else {
      console.error("Erreur réseau ou serveur injoignable :", error.message);
    }
    return Promise.reject(error);
  }
);

// ---------------- AUTH ----------------
export const register = (data: FormData | CreateUserDto) => {
  if (data instanceof FormData) {
    return apiClient.post("/auth/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return apiClient.post("/auth/register", data);
};

export interface LoginResponse {
  message?: string;
  requiresOtp: boolean;
  access_token?: string;
  role?: string;
  email?: string;
  nom?: string;
  prenom?: string;
  id?: string;   //  backend renvoie "id"
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

export const verifyEmail = (token: string) =>
  apiClient.post<{ message: string }>("/auth/verify-email", { token });

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
  id: number;
  carrosserie: string;
  modele: string;
  marque: string;
  transmission: string;
  prix: number;
  photos: string[];
  immatriculation: string;
  disponible: boolean;
  deleted: boolean;
  agencyId?: number; // ID de l'agence propriétaire du véhicule
  createdAt: string;
  updatedAt: string;
}

export const addVehicle = (data: FormData) =>
  apiClient.post<Vehicle>("/vehicles", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getVehicles = () =>
  apiClient.get<Vehicle[]>("/vehicles");

export const getVehicleById = (id: string | number) =>
  apiClient.get<Vehicle>(`/vehicles/${id}`);

export const updateVehicle = (id: string | number, data: FormData) =>
  apiClient.put<Vehicle>(`/vehicles/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteVehicle = (id: string | number) =>
  apiClient.delete<Vehicle>(`/vehicles/${id}`);

export const markVehicleUnavailable = (id: string | number) =>
  apiClient.put<Vehicle>(`/vehicles/${id}/unavailable`);

export const markVehicleAvailable = (id: string | number) =>
  apiClient.put<Vehicle>(`/vehicles/${id}/available`);

// ---------------- RESERVATIONS ----------------
// ---------------- RESERVATIONS ----------------
export interface ReservationVehicle {
  id: number;
  carrosserie: string;
  modele: string;
  marque: string;
  transmission: string;
  prix: number;
  photos: string[];
  immatriculation: string;
  disponible: boolean;
  deleted: boolean;
  agencyId?: number; // ID de l'agence propriétaire du véhicule
  createdAt: string;
  updatedAt: string;
}

export interface ReservationClient {
  id: number;
  role: "client" | "admin" | "entreprise" | "tourist";
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  isVerified: boolean;
  deleted: boolean;
  deletedAt?: string | null;
  dateInscription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationDto {
  vehicleId: string;
  clientId: string;
  dateDebut: string;
  dateFin: string;
  codePromo?: string;
}

export interface Reservation {
  id: number;
  vehicle: ReservationVehicle;     // objet complet renvoyé par le backend
  client: ReservationClient;       // objet complet renvoyé par le backend
  vehicleId: number;               // ID du véhicule
  clientId: number;                // ID du client
  dateDebut: string;
  dateFin: string;
  statut: "en_attente" | "validee" | "en_cours" | "terminee" | "annulee";
  numeroReservation: string;
  promotionId?: Promotion; // Ajout du champ promotion
  createdAt?: string;
  updatedAt?: string;
}

export const addReservation = (data: CreateReservationDto) =>
  apiClient.post<Reservation>("/reservations", data);

export const getReservations = () =>
  apiClient.get<Reservation[]>("/reservations");

export const getReservationById = (id: string | number) =>
  apiClient.get<Reservation>(`/reservations/${id}`);

export const deleteReservation = (id: string | number) =>
  apiClient.delete<Reservation>(`/reservations/${id}`);

export const updateReservationStatus = (id: string | number, statut: string) =>
  apiClient.patch<Reservation>(`/reservations/${id}/status`, { statut });
// ---------------- PAIEMENTS ----------------

export interface CreatePaiementDto {
  reservationId: string;
  nom: string;
  email: string;
  montant: number;
  methodePaiement: "CARTE" | "TMONEY" | "FLOOZ";
  telephone?: string;
  numeroCarte?: string;
  expiration?: string;
  cvv?: string;
}

export interface Paiement {
  id: number;
  reservationId: Reservation;
  nom: string;
  email: string;
  montant: number;
  methodePaiement: "CARTE" | "TMONEY" | "FLOOZ";
  telephone?: string;
  numeroCarte?: string;
  expiration?: string;
  cvv?: string;
  statut: "reussi" | "echoue";
  createdAt: string;
  updatedAt: string;
}

//  Créer un paiement
export const addPaiement = (data: CreatePaiementDto) =>
  apiClient.post<Paiement>("/paiements", data);

//  Récupérer tous les paiements
export const getPaiements = () =>
  apiClient.get<Paiement[]>("/paiements");

// Récupérer un paiement par ID
export const getPaiementById = (id: string | number) =>
  apiClient.get<Paiement>(`/paiements/${id}`);
export const downloadReservationReceipt = (id: string | number) =>
  apiClient.get(`/reservations/${id}/recu`, {
    responseType: "blob",
  });

// ---------------- STATS ----------------
export interface ClientStats {
  totalClients: number;
  totalClientsByRole: {
    client: number;
    entreprise: number;
    tourist: number;
  };
  clientsWithReservations: number;
  clientsWithPayments: number;
}
// ---------------- DASHBOARD ----------------
export interface Promotion {
  id: number;
  code: string;
  description: string;
  reduction: number;
  dateDebut: string;
  dateFin: string;
}

export interface DashboardResponse {
  profil: {
    nom: string;
    prenom: string;
    email: string;
    role: "admin" | "client" | "entreprise" | "tourist";
  };
  reservations: Reservation[];
  paiements: Paiement[];
  promotions: Promotion[];
  temoignages: string[];
}

export const getDashboard = () =>
  apiClient.get<DashboardResponse>("/dashboard");

// Témoignages enrichis (nom, prénom, message)
export interface Temoignage {
  userId: string;
  nom: string;
  prenom: string;
  message: string;
}

// Récupérer tous les témoignages (PUBLIC - endpoint getAllTemoignages du backend)
export const getTemoignages = () =>
  apiClient.get<Temoignage[]>("/dashboard/temoignages");

// Récupérer uniquement les témoignages de l'utilisateur connecté
export const getUserTemoignages = () =>
  apiClient.get<Temoignage[]>("/dashboard/temoignages/user");

// Ajouter un témoignage
export const addTemoignage = (data: { message: string }) =>
  apiClient.post<Temoignage[]>("/dashboard/temoignages", data);

// Supprimer un témoignage
export const deleteTemoignage = (userId: string, message: string) =>
  apiClient.delete(`/dashboard/temoignages/${userId}`, {
    data: { message },
  });





export const getClientStats = () =>
  apiClient.get<ClientStats>("/stats/clients");
// ---------------- PROMOTIONS ----------------
export interface CreatePromotionDto {
  titre: string;
  description: string;
  type: "pourcentage" | "montant";
  valeur: number;
  dateDebut: string;
  dateFin: string;
  vehiculesIds?: number[];
  utilisationMax?: number;
  codesPromo?: string[];
  dureeMinLocation?: number;
  montantMinCommande?: number;
}

export interface UpdatePromotionDto {
  titre?: string;
  description?: string;
  type?: "pourcentage" | "montant";
  valeur?: number;
  dateDebut?: string;
  dateFin?: string;
  vehiculesIds?: number[];
  utilisationMax?: number;
  codesPromo?: string[];
  dureeMinLocation?: number;
  montantMinCommande?: number;
}

export interface Promotion {
  id: number;
  titre: string;
  description: string;
  type: "pourcentage" | "montant";
  valeur: number;
  dateDebut: string;
  dateFin: string;
  vehiculesIds?: number[];
  utilisationMax: number;
  codesPromo: string[];
  dureeMinLocation: number;
  montantMinCommande: number;
  utilisations: number;
  statut: "Active" | "Inactive";
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
// Créer une promotion
export const addPromotion = (data: CreatePromotionDto) =>
  apiClient.post<Promotion>("/promotions", data);

// Récupérer toutes les promotions
export const getPromotions = (activeOnly?: boolean) =>
  apiClient.get<Promotion[]>(`/promotions${activeOnly ? "?activeOnly=true" : ""}`);

// Récupérer les promotions actives
export const getActivePromotions = () =>
  apiClient.get<Promotion[]>("/promotions/active");

// Récupérer une promotion par ID
export const getPromotionById = (id: string | number) =>
  apiClient.get<Promotion>(`/promotions/${id}`);

// Récupérer une promotion par code promo
export const getPromotionByCode = (code: string) =>
  apiClient.get<Promotion>(`/promotions/code/${code}`);

// Mettre à jour une promotion
export const updatePromotion = (id: string | number, data: UpdatePromotionDto) =>
  apiClient.put<Promotion>(`/promotions/${id}`, data);

// Supprimer une promotion
export const deletePromotion = (id: string | number) =>
  apiClient.delete<void>(`/promotions/${id}`);

// Appliquer une promotion à un montant
export const appliquerPromotion = (
  promotionId: string | number,
  body: { montantBase: number; vehiculeId?: string }
) =>
  apiClient.post<{
    montantRemise: number;
    montantFinal: number;
    promotion: Promotion;
  }>(`/promotions/${promotionId}/appliquer`, body);

// ---------------- CONTACT ----------------
export interface ContactDto {
  nom: string;
  email: string;
  message: string;
}

export const sendContact = (data: ContactDto) =>
  apiClient.post<{ message: string }>("/contact", data);

export interface Contact {
  id: number;
  nom: string;
  email: string;
  message: string;
  response?: string;
  status?: 'new' | 'responded';
  createdAt?: string;
  respondedAt?: string;
}

export const getContacts = () => apiClient.get<Contact[]>('/contact');

export const respondToContact = (id: string | number, response: string) =>
  apiClient.put<Contact>(`/contact/${id}/respond`, { response });

// ---------------- NOTIFICATIONS ----------------
export interface Notification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  entityId?: number;
  meta?: Record<string, any>;
  createdAt?: string;
}

export const getNotifications = () => apiClient.get<Notification[]>('/notifications');
export const getUnreadNotifications = () => apiClient.get<Notification[]>('/notifications/unread');
export const markNotificationRead = (id: string | number) => apiClient.put<Notification>(`/notifications/${id}/mark-read`);

// ---------------- BLOG ----------------
export interface Post {
  id: number;
  titre: string;
  slug: string;
  corps: string;
  extrait?: string;
  author?: string;
  idAdmin?: string;
  categorie?: string;
  photo?: string;
  dateRedaction?: string;
  status?: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostDto {
  titre: string;
  slug: string;
  corps: string;
  extrait?: string;
  idAdmin?: string;
  categorie?: string;
  photo?: string;
  dateRedaction?: string;
  status?: 'draft' | 'published';
}

export interface UpdatePostDto {
  titre?: string;
  slug?: string;
  corps?: string;
  extrait?: string;
  idAdmin?: string;
  categorie?: string;
  photo?: string;
  dateRedaction?: string;
  status?: 'draft' | 'published';
}

export interface BlogListResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}

export const getBlogPosts = (params?: { page?: number; limit?: number; q?: string; tags?: string; admin?: boolean }) =>
  apiClient.get<BlogListResponse>('/blog', { params });

export const getAdminBlogPosts = (params?: { page?: number; limit?: number; q?: string; tags?: string }) =>
  apiClient.get<BlogListResponse>('/admin/blog', { params });

export const getBlogPostBySlug = (slug: string) =>
  apiClient.get<Post>(`/blog/${slug}`);

export const getBlogPost = (id: string | number) =>
  apiClient.get<Post>(`/blog/${id}`);

export const createBlogPost = (data: CreatePostDto) =>
  apiClient.post<Post>('/admin/blog', data);

export const updateBlogPost = (id: string | number, data: UpdatePostDto) =>
  apiClient.put<Post>(`/admin/blog/${id}`, data);

export const deleteBlogPost = (id: string | number) =>
  apiClient.delete(`/admin/blog/${id}`);

export const publishBlogPost = (id: string | number) =>
  apiClient.patch<Post>(`/admin/blog/${id}/publish`);

export const uploadBlogImage = (file: File) => {
  const formData = new FormData();
  formData.append('featuredImage', file); // Changé de 'file' à 'featuredImage' pour correspondre au contrôleur backend
  return apiClient.post<{ url: string; filename: string }>('/admin/blog/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Agency API functions
export const getAgencies = (params?: { page?: number; limit?: number; q?: string; isActive?: boolean }) =>
  apiClient.get<AgenciesListResponseDto>('/admin/agencies', { params });

export const getAgencyById = (id: string | number) =>
  apiClient.get<Agency>(`/agencies/${id}`);

export const getActiveAgencies = (params?: { page?: number; limit?: number; q?: string }) =>
  apiClient.get<AgenciesListResponseDto>('/agencies/agencies/active/all', { params });

export const getNearbyAgencies = (params: { longitude: number; latitude: number; maxDistance?: number; limit?: number }) =>
  apiClient.get<Agency[]>('/agencies/nearby', { params });

export const createAgency = (data: CreateAgencyDto, logoFile?: File) => {
  // If no file is provided, send JSON so boolean types (isActive) stay as booleans
  if (!logoFile) {
    // Ensure we don't send empty strings; keep location object as-is
    const payload: any = {};
    (Object.keys(data) as (keyof CreateAgencyDto)[]).forEach(key => {
      const value = data[key];
      if (value !== undefined && value !== null && value !== '') {
        payload[key] = value;
      }
    });
    console.log('Données envoyées à createAgency (JSON):', payload);
    return apiClient.post<Agency>('/admin/agencies', payload);
  }

  const formData = new FormData();
  (Object.keys(data) as (keyof CreateAgencyDto)[]).forEach(key => {
    const value = data[key];
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'location' && data.location && data.location.latitude !== 0 && data.location.longitude !== 0) {
        // Send location as separate fields for multipart/form-data
        formData.append('location[latitude]', data.location.latitude.toString());
        formData.append('location[longitude]', data.location.longitude.toString());
      } else if (key !== 'location') {
        formData.append(key, String(value));
      }
    }
  });
  formData.append('logo', logoFile);

  // Debug: Afficher les données envoyées (après construction complète)
  console.log('Données envoyées à createAgency (FormData):');
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return apiClient.post<Agency>('/admin/agencies', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateAgency = (id: string, data: UpdateAgencyDto, logoFile?: File) => {
  const formData = new FormData();
  (Object.keys(data) as (keyof UpdateAgencyDto)[]).forEach(key => {
    const value = data[key];
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'location' && data.location && data.location.latitude !== 0 && data.location.longitude !== 0) {
        // Send location as separate fields for multipart/form-data
        formData.append('location[latitude]', data.location.latitude.toString());
        formData.append('location[longitude]', data.location.longitude.toString());
      } else if (key !== 'location') {
        formData.append(key, String(value));
      }
    }
  });
  if (logoFile) {
    formData.append('logo', logoFile);
  }
  // Debug: Afficher les données envoyées (après construction complète)
  console.log('Données envoyées à updateAgency:');
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  return apiClient.put<Agency>(`/admin/agencies/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteAgency = (id: string | number) =>
  apiClient.delete(`/admin/agencies/${id}`);

export const toggleAgencyActive = (id: string | number) =>
  apiClient.patch<Agency>(`/admin/agencies/${id}/toggle`);

export const exportAgencyToPdf = (id: string | number) =>
  apiClient.get(`/agencies/${id}/export-pdf`, { responseType: 'blob' });

// Import agencies from a JSON file (multipart upload)
export const importAgencies = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post<{ total: number; imported: number }>('/admin/agencies/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ---------------- CONTRACT DTOs ----------------
export interface CreateContractDto {
  vehicleId?: string;
  dateDebut: string;
  dateFin: string;
  montantTotal: number;
  acompteVerse?: number;
  conditionsSpeciales?: string;
}

export interface UpdateContractDto {
  vehicleId?: string;
  statut?: 'pending' | 'approved' | 'rejected';
  commentaires?: string;
  montantTotal?: number;
  acompteVerse?: number;
  conditionsSpeciales?: string;
  dateValidation?: string;
  validePar?: string;
}

export interface Contract {
  _id: string;
  id?: number;
  userId: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    role: string;
  };
  vehicleId?: {
    _id: string;
    marque: string;
    modele: string;
    immatriculation: string;
    prix: number;
    photos?: string[];
  };
  dateDebut: string;
  dateFin: string;
  montantTotal: number;
  acompteVerse: number;
  conditionsSpeciales?: string;
  statut: 'pending' | 'approved' | 'rejected';
  commentarios?: string;
  dateValidation?: string;
  validePar?: {
    _id: string;
    nom: string;
    prenom: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ---------------- CONTRACT API FUNCTIONS ----------------
export const createContract = (contractData: CreateContractDto) =>
  apiClient.post<Contract>('/contracts', contractData);

export const getContracts = () =>
  apiClient.get<Contract[]>('/contracts');

export const getAllContracts = () =>
  apiClient.get<Contract[]>('/contracts');

export const getContract = (id: string | number) =>
  apiClient.get<Contract>(`/contracts/${id}`);

export const updateContract = (id: string | number, updateData: UpdateContractDto) =>
  apiClient.put<Contract>(`/contracts/${id}`, updateData);

// Valider ou rejeter un contrat (Admin uniquement)
export const validateContract = (
  id: string | number,
  data: { valider: boolean; commentaires?: string }
) => apiClient.post<Contract>(`/contracts/${id}/validate`, data);

export const deleteContract = (id: string | number) =>
  apiClient.delete(`/contracts/${id}`);

export const downloadContractPDF = (id: string | number) =>
  apiClient.get(`/contracts/${id}/download`, { responseType: 'blob' });



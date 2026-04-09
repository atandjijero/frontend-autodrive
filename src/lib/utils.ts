import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export type ReservationStatus =
  | "en_attente"
  | "validee"
  | "en_cours"
  | "terminee"
  | "annulee"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatReservationStatus(status: ReservationStatus | string) {
  switch (status) {
    case "en_attente":
      return "En attente"
    case "validee":
      return "Validée"
    case "en_cours":
      return "En cours"
    case "terminee":
      return "Terminée"
    case "annulee":
      return "Annulée"
    default:
      return status
  }
}

"use client";
import { ErrorCard } from "@/components/auth/ErrorCard";
import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  UserNotApproved: "L'account deve essere verificato dal CED, contattare il CED.",
  OAuthAccountNotLinked: "Questo account è già collegato con un altro provider.",
  CredentialsSignin: "Credenziali non valide.",
  default: "Si è verificato un errore. Riprova.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "default";
  const message = errorMessages[error] || errorMessages.default;

  return (
    <ErrorCard message={message} />
  );
}
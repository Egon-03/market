import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = { title: "Registrati gratis" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");
  return <AuthForm mode="register" />;
}

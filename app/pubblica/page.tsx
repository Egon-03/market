import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ListingForm from "@/components/ListingForm";

export const metadata: Metadata = { title: "Pubblica un annuncio gratis" };

export default async function PublishPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/accedi?next=/pubblica");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Pubblica un annuncio</h1>
      <p className="mt-1 mb-6 text-sm text-gray-500">
        Pubblicare è gratuito al 100%, senza commissioni sulla vendita.
      </p>
      <ListingForm />
    </div>
  );
}

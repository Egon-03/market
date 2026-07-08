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
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
        Pubblica un annuncio
      </h1>
      <p className="mt-1.5 mb-7 text-sm text-stone-500">
        Pubblicare è gratuito al 100%, senza commissioni sulla vendita.
      </p>
      <ListingForm />
    </div>
  );
}

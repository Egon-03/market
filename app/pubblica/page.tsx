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
      <div className="mb-7 border-b border-ink/12 pb-4">
        <p className="eyebrow">100% gratis, sempre</p>
        <h1 className="display mt-1 text-4xl">Pubblica un annuncio</h1>
        <p className="mt-1.5 text-sm text-ash">
          Nessuna commissione sulla vendita, nessun costo nascosto.
        </p>
      </div>
      <ListingForm />
    </div>
  );
}

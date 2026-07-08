import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latest = await db.listing.findMany({
    where: { status: "attivo" },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-12 text-center text-white">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          Compra e vendi. Gratis, per sempre.
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-emerald-50">
          Niente commissioni, niente costi nascosti: pubblichi il tuo annuncio in
          un minuto e ti accordi direttamente con chi compra.
        </p>
        <Link
          href="/pubblica"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Pubblica un annuncio gratis
        </Link>
      </section>

      {/* Categorie */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Esplora le categorie</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/annunci/${cat.slug}`}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 text-center transition hover:border-emerald-400 hover:shadow-sm"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner pubblicitario */}
      <AdSlot slot="1000000001" className="min-h-24" />

      {/* Ultimi annunci */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Ultimi annunci</h2>
          <Link href="/annunci" className="text-sm font-medium text-emerald-700 hover:underline">
            Vedi tutti →
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            Ancora nessun annuncio.{" "}
            <Link href="/pubblica" className="font-medium text-emerald-700 hover:underline">
              Pubblica il primo!
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {latest.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* Come funziona */}
      <section className="rounded-2xl bg-white p-8">
        <h2 className="mb-6 text-center text-xl font-bold">Come funziona</h2>
        <div className="grid gap-6 text-center sm:grid-cols-3">
          <div>
            <p className="text-3xl">📝</p>
            <h3 className="mt-2 font-semibold">1. Pubblica</h3>
            <p className="mt-1 text-sm text-gray-500">
              Crea il tuo annuncio con foto in meno di un minuto. È gratis, sempre.
            </p>
          </div>
          <div>
            <p className="text-3xl">💬</p>
            <h3 className="mt-2 font-semibold">2. Accordati</h3>
            <p className="mt-1 text-sm text-gray-500">
              Gli interessati ti contattano direttamente: decidete voi prezzo e consegna.
            </p>
          </div>
          <div>
            <p className="text-3xl">🤝</p>
            <h3 className="mt-2 font-semibold">3. Concludi</h3>
            <p className="mt-1 text-sm text-gray-500">
              Scambio a mano e pagamento diretto: il sito non trattiene nulla.
            </p>
          </div>
        </div>
      </section>

      <AdSlot slot="1000000002" className="min-h-24" />
    </div>
  );
}

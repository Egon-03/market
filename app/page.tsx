import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";
import { ArrowRightIcon, PlusIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

// Tinte morbide assegnate a rotazione alle tessere categoria
const TILE_TINTS = [
  "from-emerald-50 to-teal-100/60",
  "from-amber-50 to-orange-100/60",
  "from-sky-50 to-blue-100/60",
  "from-rose-50 to-pink-100/60",
  "from-violet-50 to-purple-100/60",
  "from-lime-50 to-green-100/60",
];

export default async function HomePage() {
  const [latest, totalActive] = await Promise.all([
    db.listing.findMany({
      where: { status: "attivo" },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    db.listing.count({ where: { status: "attivo" } }),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 px-6 py-16 text-center text-white shadow-2xl shadow-emerald-900/20">
        {/* decorazioni */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(600px 300px at 15% -10%, rgba(255,255,255,0.22), transparent 60%), radial-gradient(500px 280px at 90% 110%, rgba(45,212,191,0.35), transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-50 backdrop-blur-sm">
            ✨ 100% gratuito · zero commissioni
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Compra e vendi.
            <br />
            <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              Gratis, per sempre.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-emerald-50/90 sm:text-lg">
            Niente costi nascosti: pubblichi il tuo annuncio in un minuto e ti
            accordi direttamente con chi compra.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pubblica"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-800 shadow-xl shadow-emerald-900/25 transition hover:bg-amber-50 hover:shadow-2xl active:scale-[0.97]"
            >
              <PlusIcon className="h-4 w-4" />
              Pubblica un annuncio gratis
            </Link>
            <Link
              href="/annunci"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.97]"
            >
              Sfoglia {totalActive > 0 ? `${totalActive} annunci` : "gli annunci"}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categorie */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">
            Esplora le categorie
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/annunci/${cat.slug}`}
              className={`group flex flex-col items-center gap-2 rounded-2xl border border-stone-200/60 bg-gradient-to-b ${TILE_TINTS[i % TILE_TINTS.length]} p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md`}
            >
              <span className="text-3xl transition-transform duration-200 group-hover:scale-125">
                {cat.icon}
              </span>
              <span className="text-xs font-bold leading-tight text-stone-700">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner pubblicitario */}
      <AdSlot slot="1000000001" className="min-h-24" />

      {/* Ultimi annunci */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">
            Ultimi annunci
          </h2>
          <Link
            href="/annunci"
            className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 transition hover:gap-2.5 hover:text-emerald-800"
          >
            Vedi tutti <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="card border-dashed p-12 text-center text-stone-500">
            Ancora nessun annuncio.{" "}
            <Link href="/pubblica" className="font-bold text-emerald-700 hover:underline">
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
      <section className="card relative overflow-hidden p-8 sm:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(400px 200px at 100% 0%, rgba(16,185,129,0.08), transparent 60%)",
          }}
        />
        <h2 className="relative mb-8 text-center text-2xl font-extrabold tracking-tight text-stone-900">
          Come funziona
        </h2>
        <div className="relative grid gap-8 text-center sm:grid-cols-3">
          {[
            {
              icon: "📝",
              title: "1. Pubblica",
              text: "Crea il tuo annuncio con foto in meno di un minuto. È gratis, sempre.",
            },
            {
              icon: "💬",
              title: "2. Accordati",
              text: "Gli interessati ti scrivono nella chat interna: decidete voi prezzo e consegna.",
            },
            {
              icon: "🤝",
              title: "3. Concludi",
              text: "Scambio a mano e pagamento diretto: il sito non trattiene nulla.",
            },
          ].map((step) => (
            <div key={step.title} className="group">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-50 to-emerald-100/70 text-3xl shadow-inner transition-transform duration-200 group-hover:scale-110">
                {step.icon}
              </span>
              <h3 className="mt-3 font-extrabold text-stone-900">{step.title}</h3>
              <p className="mx-auto mt-1.5 max-w-60 text-sm leading-relaxed text-stone-500">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <AdSlot slot="1000000002" className="min-h-24" />
    </div>
  );
}

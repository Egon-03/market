import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";
import CategoryIcon from "@/components/CategoryIcon";
import { ArrowRightIcon, SearchIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latest, totalActive, categoryCounts] = await Promise.all([
    db.listing.findMany({
      where: { status: "attivo" },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    db.listing.count({ where: { status: "attivo" } }),
    db.listing.groupBy({
      by: ["category"],
      where: { status: "attivo" },
      _count: true,
    }),
  ]);
  const countBySlug = Object.fromEntries(
    categoryCounts.map((c) => [c.category, c._count])
  );

  return (
    <div className="space-y-16">
      {/* Manifesto: il poster rosso */}
      <section className="relative overflow-hidden rounded-3xl bg-swiss px-6 py-12 text-white sm:px-12 sm:py-16">
        <div>
          <p className="animate-rise font-display text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">
            Il mercatino gratuito · senza commissioni · per tutti
          </p>
          <h1 className="display animate-rise delay-1 mt-4 max-w-5xl text-[13vw] text-white sm:text-7xl lg:text-8xl">
            Compra e vendi.
            <br />
            <span className="text-ink">Gratis, punto.</span>
          </h1>

          {/* Ricerca gigante */}
          <form
            action="/annunci"
            method="get"
            className="animate-rise delay-2 mt-10 flex max-w-2xl items-center gap-0 rounded-2xl bg-white p-2 text-ink"
            role="search"
          >
            <SearchIcon className="ml-3 h-5 w-5 shrink-0 text-ash" />
            <input
              type="search"
              name="q"
              placeholder="Prova “bicicletta”, “divano”, “iPhone”…"
              className="w-full bg-transparent px-3 py-3 text-base outline-none placeholder:text-ash"
              aria-label="Cerca tra gli annunci"
            />
            <button type="submit" className="btn-primary shrink-0 !px-7">
              Cerca
            </button>
          </form>

          {/* Numeri veri, stile scheda */}
          <dl className="animate-rise delay-3 mt-10 flex max-w-2xl divide-x divide-white/25 border-t border-white/25 pt-6">
            {[
              { value: String(totalActive), label: "annunci attivi" },
              { value: String(CATEGORIES.length), label: "categorie" },
              { value: "0%", label: "commissioni" },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 pl-5 first:pl-0">
                <dt className="order-2 text-xs uppercase tracking-wider text-white/70">
                  {stat.label}
                </dt>
                <dd className="font-display text-3xl font-black tabular-nums tracking-tight">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Indice delle categorie, come un sommario tipografico */}
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between border-b border-ink/12 pb-4">
          <div>
            <p className="eyebrow">Indice</p>
            <h2 className="display mt-1 text-3xl sm:text-4xl">Categorie</h2>
          </div>
          <Link
            href="/annunci"
            className="hidden items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-ink transition hover:text-swiss sm:flex"
          >
            Tutti gli annunci <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink/12 bg-ink/12 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/annunci/${cat.slug}`}
              className="group flex items-center gap-3.5 bg-white p-4 transition-colors duration-150 hover:bg-ink sm:p-5"
            >
              <span className="text-ink/60 transition-colors group-hover:text-swiss">
                <CategoryIcon slug={cat.slug} className="h-7 w-7" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-sm font-bold text-ink transition-colors group-hover:text-paper">
                  {cat.name}
                </span>
                <span className="block text-xs tabular-nums text-ash transition-colors group-hover:text-paper/60">
                  {countBySlug[cat.slug] ?? 0} annunci
                </span>
              </span>
              <ArrowRightIcon className="ml-auto h-4 w-4 shrink-0 text-ink/0 transition-all group-hover:translate-x-0.5 group-hover:text-swiss" />
            </Link>
          ))}
          {/* Cella di chiusura: riempie esattamente l'ultima riga della griglia */}
          <Link
            href="/pubblica"
            className="group col-span-1 flex items-center justify-center gap-2 bg-swiss p-4 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-swiss-deep sm:col-span-2 sm:p-5 lg:col-span-3"
          >
            + Pubblica il tuo
          </Link>
        </div>
      </section>

      <AdSlot slot="1000000001" className="mx-auto min-h-24 max-w-7xl" />

      {/* Ultimi annunci */}
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between border-b border-ink/12 pb-4">
          <div>
            <p className="eyebrow">Appena arrivati</p>
            <h2 className="display mt-1 text-3xl sm:text-4xl">Ultimi annunci</h2>
          </div>
          <Link
            href="/annunci"
            className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-ink transition hover:text-swiss"
          >
            Vedi tutti <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="card border-dashed p-14 text-center text-ash">
            Ancora nessun annuncio.{" "}
            <Link href="/pubblica" className="font-bold text-swiss hover:underline">
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

      {/* Come funziona: tre colonne con regole tipografiche */}
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 border-b border-ink/12 pb-4">
          <p className="eyebrow">Semplice davvero</p>
          <h2 className="display mt-1 text-3xl sm:text-4xl">Come funziona</h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-ink/12 bg-ink/12 sm:grid-cols-3">
          {[
            {
              n: "1",
              title: "Pubblica",
              text: "Foto, descrizione, prezzo: il tuo annuncio è online in un minuto. Gratis, sempre.",
            },
            {
              n: "2",
              title: "Accordati",
              text: "Gli interessati ti scrivono nella chat del sito. Prezzo e consegna li decidete voi.",
            },
            {
              n: "3",
              title: "Concludi",
              text: "Scambio a mano, pagamento diretto. Il sito non trattiene nulla e non gestisce denaro.",
            },
          ].map((step) => (
            <div key={step.n} className="bg-white p-6 sm:p-8">
              <span className="font-display text-5xl font-black text-swiss">
                {step.n}
              </span>
              <h3 className="display mt-4 text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <AdSlot slot="1000000002" className="mx-auto min-h-24 max-w-7xl" />
    </div>
  );
}

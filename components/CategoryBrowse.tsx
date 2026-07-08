import Link from "next/link";
import { db } from "@/lib/db";
import type { Category } from "@/lib/categories";
import { CATEGORIES } from "@/lib/categories";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";

const PAGE_SIZE = 24;

type Props = {
  category: Category;
  page: number;
};

/** Pagina categoria con URL dedicato (es. /annunci/elettronica) — ottima per la SEO. */
export default async function CategoryBrowse({ category, page }: Props) {
  const where = { category: category.slug, status: "attivo" };
  const [total, listings] = await Promise.all([
    db.listing.count({ where }),
    db.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-stone-400" aria-label="Breadcrumb">
        <Link href="/" className="font-medium transition hover:text-emerald-700">Home</Link>
        <span>›</span>
        <Link href="/annunci" className="font-medium transition hover:text-emerald-700">Annunci</Link>
        <span>›</span>
        <span className="font-medium text-stone-600">{category.name}</span>
      </nav>

      <div className="card relative overflow-hidden p-7 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(400px 180px at 90% 0%, rgba(16,185,129,0.10), transparent 60%)",
          }}
        />
        <h1 className="relative text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
          {category.icon} {category.name} — annunci gratuiti
        </h1>
        <p className="relative mt-2 text-sm text-stone-500">
          {total} {total === 1 ? "annuncio" : "annunci"} nella categoria{" "}
          {category.name}. Compra e vendi senza commissioni.{" "}
          <Link
            href={`/annunci?categoria=${category.slug}`}
            className="font-bold text-emerald-700 hover:underline"
          >
            Filtri avanzati →
          </Link>
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="card border-dashed p-12 text-center">
          <p className="text-5xl">{category.icon}</p>
          <p className="mt-3 font-bold text-stone-700">
            Ancora nessun annuncio in questa categoria
          </p>
          <Link href="/pubblica" className="mt-2 inline-block text-sm font-bold text-emerald-700 hover:underline">
            Pubblica tu il primo, è gratis →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {listings.slice(0, 8).map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
          {listings.length > 8 && (
            <AdSlot slot="1000000008" className="col-span-full min-h-24" />
          )}
          {listings.slice(8).map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-3" aria-label="Paginazione">
          {page > 1 && (
            <Link
              href={`/annunci/${category.slug}${page - 1 > 1 ? `?pagina=${page - 1}` : ""}`}
              className="btn-secondary"
            >
              ← Precedente
            </Link>
          )}
          <span className="px-2 text-sm font-semibold text-stone-500">
            Pagina {page} di {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/annunci/${category.slug}?pagina=${page + 1}`}
              className="btn-secondary"
            >
              Successiva →
            </Link>
          )}
        </nav>
      )}

      <AdSlot slot="1000000009" className="min-h-24" />

      {/* Altre categorie: link interni utili per SEO e navigazione */}
      <section>
        <h2 className="mb-4 text-lg font-extrabold tracking-tight text-stone-900">
          Altre categorie
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/annunci/${c.slug}`}
              className="chip !py-2 transition hover:border-emerald-300 hover:text-emerald-700 hover:shadow-sm"
            >
              {c.icon} {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

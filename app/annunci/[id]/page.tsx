import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate, parseImages } from "@/lib/format";
import { getCantonName } from "@/lib/cantons";
import { getCategory, getConditionLabel } from "@/lib/categories";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";
import MessageForm from "@/components/MessageForm";
import ImageGallery from "@/components/ImageGallery";
import CategoryBrowse from "@/components/CategoryBrowse";
import { ClockIcon, EyeIcon, ShieldIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

// La rotta serve sia le pagine categoria (/annunci/elettronica) sia il
// dettaglio annuncio (/annunci/<id>): gli slug categoria sono riservati.
type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ pagina?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;

  const categoryPage = getCategory(id);
  if (categoryPage) {
    return {
      title: `${categoryPage.name} — annunci gratuiti`,
      description: `Annunci gratuiti nella categoria ${categoryPage.name}: compra e vendi senza commissioni su Mercatino.ch.`,
      alternates: { canonical: `/annunci/${categoryPage.slug}` },
    };
  }

  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing) return { title: "Annuncio non trovato" };
  const images = parseImages(listing.images);
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: images.length > 0 ? [images[0]] : undefined,
    },
  };
}

export default async function ListingDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;

  const categoryPage = getCategory(id);
  if (categoryPage) {
    const { pagina } = await searchParams;
    const page = Math.max(1, Number(pagina) || 1);
    return <CategoryBrowse category={categoryPage} page={page} />;
  }
  const listing = await db.listing.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, createdAt: true } } },
  });
  if (!listing) notFound();

  // Contatore visite (best effort, non blocca il rendering)
  db.listing.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});

  const viewer = await getCurrentUser();
  const isOwner = viewer?.id === listing.userId;
  const images = parseImages(listing.images);
  const category = getCategory(listing.category);
  const sold = listing.status === "venduto";

  const similar = await db.listing.findMany({
    where: { category: listing.category, status: "attivo", id: { not: listing.id } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: images,
    offers: {
      "@type": "Offer",
      price: listing.price ?? undefined,
      priceCurrency: "CHF",
      availability: sold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      itemCondition:
        listing.condition === "nuovo"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
    },
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-stone-400" aria-label="Breadcrumb">
        <Link href="/" className="font-medium transition hover:text-emerald-700">Home</Link>
        <span>›</span>
        <Link href="/annunci" className="font-medium transition hover:text-emerald-700">Annunci</Link>
        {category && (
          <>
            <span>›</span>
            <Link href={`/annunci/${category.slug}`} className="font-medium transition hover:text-emerald-700">
              {category.name}
            </Link>
          </>
        )}
        <span>›</span>
        <span className="truncate font-medium text-stone-600">{listing.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Colonna principale */}
        <div className="space-y-6 lg:col-span-2">
          <ImageGallery images={images} title={listing.title} fallbackIcon={category?.icon ?? "📦"} />

          <div className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
                  {listing.title}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-400">
                  <ClockIcon className="h-4 w-4" />
                  Pubblicato il {formatDate(listing.createdAt)}
                  <span className="mx-1">·</span>
                  <EyeIcon className="h-4 w-4" />
                  {listing.views} visualizzazioni
                </p>
              </div>
              <p className="rounded-2xl bg-gradient-to-b from-emerald-50 to-emerald-100/60 px-5 py-3 text-2xl font-extrabold tracking-tight text-emerald-700 shadow-inner">
                {formatPrice(listing.price)}
              </p>
            </div>

            {sold && (
              <p className="mt-5 rounded-xl bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-600">
                ⚠️ Questo articolo è stato venduto.
              </p>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Categoria", value: `${category?.icon ?? ""} ${category?.name ?? listing.category}` },
                { label: "Condizione", value: getConditionLabel(listing.condition) },
                {
                  label: "Luogo",
                  value: `${getCantonName(listing.canton)}${listing.city ? ` · ${listing.city}` : ""}`,
                },
              ].map((row) => (
                <div key={row.label} className="rounded-xl bg-stone-50 px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-stone-800">{row.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-8 text-lg font-extrabold text-stone-900">Descrizione</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-stone-600">
              {listing.description}
            </p>
          </div>

          <AdSlot slot="1000000005" className="min-h-24" />
        </div>

        {/* Sidebar venditore */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Venditore
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-lg font-extrabold text-white shadow-md">
                {listing.user.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="font-extrabold text-stone-900">{listing.user.name}</p>
                <p className="text-xs text-stone-400">
                  Membro da {formatDate(listing.user.createdAt)}
                </p>
              </div>
            </div>
            {isOwner ? (
              <Link href="/i-miei-annunci" className="btn-secondary mt-5 w-full">
                Gestisci questo annuncio
              </Link>
            ) : (
              <MessageForm listingId={listing.id} loggedIn={Boolean(viewer)} />
            )}
          </div>

          <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-b from-amber-50 to-orange-50/50 p-5 text-amber-900">
            <p className="flex items-center gap-2 text-sm font-extrabold">
              <ShieldIcon className="h-5 w-5 text-amber-600" />
              Consigli di sicurezza
            </p>
            <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-amber-800">
              <li>· Incontra il venditore di persona in un luogo pubblico</li>
              <li>· Controlla l&apos;articolo prima di pagare</li>
              <li>· Non inviare mai denaro in anticipo</li>
            </ul>
          </div>

          <AdSlot slot="1000000006" className="min-h-60" />
        </div>
      </div>

      {/* Annunci simili */}
      {similar.length > 0 && (
        <section>
          <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-stone-900">
            Annunci simili
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

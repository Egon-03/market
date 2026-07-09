import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate, parseImages } from "@/lib/format";
import { getCantonName } from "@/lib/cantons";
import {
  getCategory,
  getConditionLabel,
  getFuelTypeLabel,
  getSubcategory,
  getSubcategoryName,
  getTransmissionLabel,
} from "@/lib/categories";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";
import MessageForm from "@/components/MessageForm";
import ReportButton from "@/components/ReportButton";
import ImageGallery from "@/components/ImageGallery";
import CategoryBrowse from "@/components/CategoryBrowse";
import { ClockIcon, EyeIcon, ShieldIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

// Questa rotta catch-all serve tre casi:
//  - /annunci/<categoria>              → pagina categoria (CategoryBrowse)
//  - /annunci/<categoria>/<sottocat>    → pagina sottocategoria (CategoryBrowse)
//  - /annunci/<id>                     → dettaglio annuncio (un solo segmento, non una categoria valida)
type Params = Promise<{ slug: string[] }>;
type SearchParams = Promise<{ pagina?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug.length >= 1) {
    const categoryPage = getCategory(slug[0]);
    if (categoryPage) {
      const sub = slug[1] ? getSubcategory(categoryPage.slug, slug[1]) : undefined;
      if (slug.length === 1 || sub) {
        const name = sub ? sub.name : categoryPage.name;
        const canonical = sub
          ? `/annunci/${categoryPage.slug}/${sub.slug}`
          : `/annunci/${categoryPage.slug}`;
        return {
          title: `${name} — annunci gratuiti`,
          description: `Annunci gratuiti nella categoria ${name}: compra e vendi senza commissioni su Mercatino.ch.`,
          alternates: { canonical },
        };
      }
    }
  }

  const id = slug[0];
  const listing = slug.length === 1 ? await db.listing.findUnique({ where: { id } }) : null;
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

export default async function AnnunciCatchAllPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;

  // Caso 1-2: pagina categoria o sottocategoria
  const categoryPage = getCategory(slug[0]);
  if (categoryPage && slug.length <= 2) {
    const subSlug = slug[1];
    const subcategory = subSlug ? getSubcategory(categoryPage.slug, subSlug) : undefined;
    if (slug.length === 2 && !subcategory) notFound();

    const { pagina } = await searchParams;
    const page = Math.max(1, Number(pagina) || 1);
    return <CategoryBrowse category={categoryPage} subcategory={subcategory} page={page} />;
  }

  // Caso 3: dettaglio annuncio (un solo segmento che non è una categoria)
  if (slug.length !== 1) notFound();
  const id = slug[0];

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
  const isVehicle = listing.category === "auto-moto";

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
    brand: listing.brand ?? undefined,
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

  const infoRows = [
    {
      label: "Categoria",
      value: listing.subcategory
        ? getSubcategoryName(listing.category, listing.subcategory)
        : (category?.name ?? listing.category),
    },
    { label: "Condizione", value: getConditionLabel(listing.condition) },
    {
      label: "Luogo",
      value: `${getCantonName(listing.canton)}${listing.city ? ` · ${listing.city}` : ""}`,
    },
  ];

  const vehicleRows = isVehicle
    ? [
        listing.brand ? { label: "Marca", value: listing.brand } : null,
        listing.model ? { label: "Modello", value: listing.model } : null,
        listing.year ? { label: "Anno", value: String(listing.year) } : null,
        listing.mileageKm != null
          ? { label: "Chilometraggio", value: `${listing.mileageKm.toLocaleString("it-CH")} km` }
          : null,
        listing.fuelType ? { label: "Alimentazione", value: getFuelTypeLabel(listing.fuelType) } : null,
        listing.transmission
          ? { label: "Cambio", value: getTransmissionLabel(listing.transmission) }
          : null,
        listing.powerHp ? { label: "Potenza", value: `${listing.powerHp} CV` } : null,
      ].filter((r): r is { label: string; value: string } => r !== null)
    : [];

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-ash" aria-label="Breadcrumb">
        <Link href="/" className="font-medium transition hover:text-swiss">Home</Link>
        <span>›</span>
        <Link href="/annunci" className="font-medium transition hover:text-swiss">Annunci</Link>
        {category && (
          <>
            <span>›</span>
            <Link href={`/annunci/${category.slug}`} className="font-medium transition hover:text-swiss">
              {category.name}
            </Link>
          </>
        )}
        {category && listing.subcategory && (
          <>
            <span>›</span>
            <Link
              href={`/annunci/${category.slug}/${listing.subcategory}`}
              className="font-medium transition hover:text-swiss"
            >
              {getSubcategoryName(category.slug, listing.subcategory)}
            </Link>
          </>
        )}
        <span>›</span>
        <span className="truncate font-medium text-ink">{listing.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Colonna principale */}
        <div className="space-y-6 lg:col-span-2">
          <ImageGallery
            images={images}
            title={listing.title}
            categorySlug={listing.category}
          />

          <div className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="min-w-0 flex-1">
                <h1 className="display text-3xl sm:text-4xl">{listing.title}</h1>
                <p className="mt-3 flex items-center gap-1.5 text-sm text-ash">
                  <ClockIcon className="h-4 w-4" />
                  {formatDate(listing.createdAt)}
                  <span className="mx-1">·</span>
                  <EyeIcon className="h-4 w-4" />
                  <span className="tabular-nums">{listing.views} visualizzazioni</span>
                </p>
              </div>
              {/* Cartellino prezzo */}
              <p className="rotate-[-1.5deg] rounded-lg bg-swiss px-5 py-3 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
                {formatPrice(listing.price)}
              </p>
            </div>

            {sold && (
              <p className="mt-6 rounded-lg bg-ink px-4 py-3 font-display text-sm font-bold uppercase tracking-wide text-paper">
                Questo articolo è stato venduto
              </p>
            )}

            <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ink/12 bg-ink/12 sm:grid-cols-3">
              {infoRows.map((row) => (
                <div key={row.label} className="bg-white px-4 py-3">
                  <dt className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-ash">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>

            {vehicleRows.length > 0 && (
              <>
                <h2 className="display mt-8 text-xl">Scheda tecnica</h2>
                <dl className="mt-3 flex flex-wrap gap-3">
                  {vehicleRows.map((row) => (
                    <div key={row.label} className="rounded-lg border border-ink/12 bg-white px-4 py-3">
                      <dt className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-ash">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold tabular-nums text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            <h2 className="display mt-8 text-xl">Descrizione</h2>
            <p className="mt-3 max-w-prose whitespace-pre-line text-[15px] leading-relaxed text-ink/75">
              {listing.description}
            </p>
          </div>

          <AdSlot slot="1000000005" className="min-h-24" />
        </div>

        {/* Sidebar venditore */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-ash">
              Venditore
            </h2>
            <div className="mt-4 flex items-center gap-3.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink font-display text-lg font-black text-paper">
                {listing.user.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="font-display text-base font-bold text-ink">
                  {listing.user.name}
                </p>
                <p className="text-xs text-ash">
                  Membro da {formatDate(listing.user.createdAt)}
                </p>
              </div>
            </div>
            {isOwner ? (
              <Link href="/i-miei-annunci" className="btn-secondary mt-5 w-full">
                Gestisci questo annuncio
              </Link>
            ) : (
              <>
                <MessageForm listingId={listing.id} loggedIn={Boolean(viewer)} />
                <div className="mt-4 flex justify-end">
                  <ReportButton
                    targetType="user"
                    targetId={listing.user.id}
                    targetLabel={listing.user.name}
                    loggedIn={Boolean(viewer)}
                    triggerLabel="Segnala questo venditore"
                  />
                </div>
              </>
            )}
          </div>

          <div className="rounded-xl bg-smoke p-5">
            <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-ink">
              <ShieldIcon className="h-5 w-5 text-swiss" />
              Consigli di sicurezza
            </p>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-ink/70">
              <li>— Incontra il venditore di persona in un luogo pubblico</li>
              <li>— Controlla l&apos;articolo prima di pagare</li>
              <li>— Non inviare mai denaro in anticipo</li>
            </ul>
            {!isOwner && (
              <div className="mt-4 border-t border-ink/10 pt-4">
                <ReportButton
                  targetType="listing"
                  targetId={listing.id}
                  targetLabel="questo annuncio"
                  loggedIn={Boolean(viewer)}
                />
              </div>
            )}
          </div>

          <AdSlot slot="1000000006" className="min-h-60" />
        </div>
      </div>

      {/* Annunci simili */}
      {similar.length > 0 && (
        <section className="border-t border-ink/12 pt-8">
          <p className="eyebrow">Potrebbero interessarti</p>
          <h2 className="display mb-6 mt-1 text-2xl sm:text-3xl">Annunci simili</h2>
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

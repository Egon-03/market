import Link from "next/link";
import Image from "next/image";
import { formatPrice, parseImages, timeAgo } from "@/lib/format";
import { getCantonName } from "@/lib/cantons";
import { getCategory, getSubcategoryName } from "@/lib/categories";
import CategoryIcon from "@/components/CategoryIcon";

type ListingCardProps = {
  listing: {
    id: string;
    title: string;
    price: number | null;
    canton: string;
    city: string | null;
    images: string;
    category: string;
    subcategory?: string | null;
    status: string;
    createdAt: Date;
    year?: number | null;
    mileageKm?: number | null;
    powerHp?: number | null;
  };
};

export default function ListingCard({ listing }: ListingCardProps) {
  const images = parseImages(listing.images);
  const cover = images[0];
  const category = getCategory(listing.category);
  const sold = listing.status === "venduto";
  const isVehicle = listing.category === "auto-moto";

  const vehicleSpecs = [
    listing.year ? String(listing.year) : null,
    listing.mileageKm != null ? `${listing.mileageKm.toLocaleString("it-CH")} km` : null,
    listing.powerHp ? `${listing.powerHp} CV` : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/annunci/${listing.id}`}
      className="group card flex flex-col overflow-hidden transition-all duration-150 hover:-translate-y-1 hover:border-ink"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-ink/12 bg-smoke">
        {cover ? (
          <Image
            src={cover}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/15 transition-colors duration-300 group-hover:text-swiss/30">
            <CategoryIcon slug={listing.category} className="h-16 w-16" />
          </div>
        )}
        {/* Cartellino prezzo, come l'adesivo di un mercatino */}
        <span
          className={`absolute bottom-2.5 right-2.5 rotate-[-2deg] rounded-md px-2.5 py-1 font-display text-sm font-black tracking-tight transition-transform duration-150 group-hover:rotate-0 ${
            sold ? "bg-ink text-paper" : "bg-swiss text-white"
          }`}
        >
          {sold ? "Venduto" : formatPrice(listing.price)}
        </span>
        {isVehicle && vehicleSpecs.length > 0 && (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-ink/85 px-2 py-1 font-display text-[11px] font-bold tabular-nums text-paper backdrop-blur-sm">
            {vehicleSpecs.join(" · ")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink">
          {listing.title}
        </h3>
        <p className="mt-auto flex items-center gap-1.5 pt-1 text-xs text-ash">
          <span className="text-ink/40">
            <CategoryIcon slug={listing.category} className="h-3.5 w-3.5" />
          </span>
          <span className="truncate">
            {listing.subcategory
              ? getSubcategoryName(listing.category, listing.subcategory)
              : category?.name}{" "}
            · {listing.city ? `${listing.city}, ` : ""}
            {getCantonName(listing.canton)}
          </span>
          <span className="ml-auto shrink-0">{timeAgo(listing.createdAt)}</span>
        </p>
      </div>
    </Link>
  );
}

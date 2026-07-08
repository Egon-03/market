import Link from "next/link";
import Image from "next/image";
import { formatPrice, parseImages, timeAgo } from "@/lib/format";
import { getCantonName } from "@/lib/cantons";
import { getCategory } from "@/lib/categories";
import { PinIcon } from "@/components/icons";

type ListingCardProps = {
  listing: {
    id: string;
    title: string;
    price: number | null;
    canton: string;
    city: string | null;
    images: string;
    category: string;
    status: string;
    createdAt: Date;
  };
};

export default function ListingCard({ listing }: ListingCardProps) {
  const images = parseImages(listing.images);
  const cover = images[0];
  const category = getCategory(listing.category);
  const sold = listing.status === "venduto";

  return (
    <Link
      href={`/annunci/${listing.id}`}
      className="group card flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_2px_6px_rgba(28,25,23,0.06),0_20px_40px_-16px_rgba(28,25,23,0.18)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        {cover ? (
          <Image
            src={cover}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl opacity-60 transition-transform duration-300 group-hover:scale-110">
            {category?.icon ?? "📦"}
          </div>
        )}
        {sold ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-stone-900/85 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            Venduto
          </span>
        ) : (
          listing.price === 0 && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-amber-400/95 px-3 py-1 text-xs font-bold text-amber-950 shadow backdrop-blur-sm">
              Gratis
            </span>
          )
        )}
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600 shadow-sm backdrop-blur-sm">
          {category?.icon} {category?.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-stone-800 transition group-hover:text-emerald-700">
          {listing.title}
        </h3>
        <p className="text-[17px] font-extrabold tracking-tight text-emerald-700">
          {formatPrice(listing.price)}
        </p>
        <p className="mt-auto flex items-center gap-1 pt-1 text-xs text-stone-400">
          <PinIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {listing.city ? `${listing.city}, ` : ""}
            {getCantonName(listing.canton)}
          </span>
          <span className="mx-0.5">·</span>
          <span className="shrink-0">{timeAgo(listing.createdAt)}</span>
        </p>
      </div>
    </Link>
  );
}

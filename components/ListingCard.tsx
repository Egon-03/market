import Link from "next/link";
import Image from "next/image";
import { formatPrice, parseImages, timeAgo } from "@/lib/format";
import { getCantonName } from "@/lib/cantons";
import { getCategory } from "@/lib/categories";

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
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        {cover ? (
          <Image
            src={cover}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            {category?.icon ?? "📦"}
          </div>
        )}
        {sold && (
          <span className="absolute left-2 top-2 rounded-full bg-gray-900/80 px-2.5 py-0.5 text-xs font-semibold text-white">
            Venduto
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
          {listing.title}
        </h3>
        <p className="text-base font-bold text-emerald-700">
          {formatPrice(listing.price)}
        </p>
        <p className="mt-auto text-xs text-gray-500">
          {getCantonName(listing.canton)}
          {listing.city ? ` · ${listing.city}` : ""} · {timeAgo(listing.createdAt)}
        </p>
      </div>
    </Link>
  );
}

import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await db.listing.findMany({
    where: { status: "attivo" },
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  return [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/annunci`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/come-funziona`, changeFrequency: "monthly", priority: 0.5 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/annunci?categoria=${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...listings.map((l) => ({
      url: `${SITE_URL}/annunci/${l.id}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}

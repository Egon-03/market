import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/12 pb-4">
        <div>
          <p className="eyebrow">Area riservata</p>
          <h1 className="display mt-1 text-3xl">Amministrazione</h1>
        </div>
        <Link href="/" className="text-sm font-semibold text-ash transition hover:text-swiss">
          ← Torna al sito
        </Link>
      </div>
      {children}
    </div>
  );
}

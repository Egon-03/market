import Link from "next/link";
import { StoreIcon } from "@/components/icons";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="mt-16 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white">
                <StoreIcon className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold text-white">
                Mercatino<span className="text-emerald-400">.ch</span>
              </span>
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-400">
              Il mercatino online 100% gratuito: pubblica, cerca e trova senza
              commissioni. Compratori e venditori si accordano direttamente — il
              sito si finanzia solo con la pubblicità.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-stone-500">
              Link utili
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/annunci" className="transition hover:text-emerald-400">
                  Tutti gli annunci
                </Link>
              </li>
              <li>
                <Link href="/pubblica" className="transition hover:text-emerald-400">
                  Pubblica un annuncio
                </Link>
              </li>
              <li>
                <Link href="/come-funziona" className="transition hover:text-emerald-400">
                  Come funziona
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-stone-500">
              Categorie popolari
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/annunci/${c.slug}`}
                    className="transition hover:text-emerald-400"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} Mercatino.ch — Gratuito per sempre, senza
          commissioni
        </div>
      </div>
    </footer>
  );
}

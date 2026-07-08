import Link from "next/link";
import { TagIcon } from "@/components/icons";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-paper/70">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="display max-w-4xl text-4xl text-paper sm:text-6xl">
          Compra. Vendi.
          <br />
          <span className="text-swiss">Zero commissioni.</span>
        </p>

        <div className="mt-12 grid gap-10 border-t border-paper/15 pt-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-swiss text-white">
                <TagIcon className="h-4.5 w-4.5" />
              </span>
              <span className="font-display text-lg font-black lowercase tracking-tight text-paper">
                mercatino<span className="text-swiss">.ch</span>
              </span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Il mercatino online gratuito per tutti. Nessun pagamento gestito dal
              sito: le persone si accordano direttamente, come in un vero
              mercatino. Ci finanziamo solo con la pubblicità.
            </p>
          </div>
          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-paper/40">
              Naviga
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/annunci" className="transition hover:text-paper">
                  Tutti gli annunci
                </Link>
              </li>
              <li>
                <Link href="/pubblica" className="transition hover:text-paper">
                  Pubblica un annuncio
                </Link>
              </li>
              <li>
                <Link href="/come-funziona" className="transition hover:text-paper">
                  Come funziona
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-paper/40">
              Categorie
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link href={`/annunci/${c.slug}`} className="transition hover:text-paper">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-paper/15 pt-6 text-xs text-paper/40">
          © {new Date().getFullYear()} Mercatino.ch — Gratuito per sempre
        </p>
      </div>
    </footer>
  );
}

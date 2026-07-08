import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold text-emerald-700">
              🛒 Mercatino<span className="text-gray-900">.ch</span>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Il mercatino online 100% gratuito: pubblica, cerca e trova senza
              commissioni. Compratori e venditori si accordano direttamente.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Link utili</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              <li>
                <Link href="/annunci" className="hover:text-emerald-700">
                  Tutti gli annunci
                </Link>
              </li>
              <li>
                <Link href="/pubblica" className="hover:text-emerald-700">
                  Pubblica un annuncio
                </Link>
              </li>
              <li>
                <Link href="/come-funziona" className="hover:text-emerald-700">
                  Come funziona
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Informazioni</p>
            <p className="mt-2 text-sm text-gray-500">
              Il sito è gratuito e si finanzia esclusivamente tramite annunci
              pubblicitari. Non gestiamo pagamenti né spedizioni.
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Mercatino.ch — Tutti i diritti riservati
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import SearchBar from "@/components/SearchBar";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-emerald-700">
          <span className="text-2xl">🛒</span>
          <span>
            Mercatino<span className="text-gray-900">.ch</span>
          </span>
        </Link>

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1 sm:max-w-xl">
          <SearchBar />
        </div>

        <nav className="order-2 ml-auto flex items-center gap-3 sm:order-3">
          {user ? (
            <>
              <Link
                href="/i-miei-annunci"
                className="hidden text-sm font-medium text-gray-700 hover:text-emerald-700 sm:block"
              >
                I miei annunci
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Esci
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/accedi"
              className="text-sm font-medium text-gray-700 hover:text-emerald-700"
            >
              Accedi
            </Link>
          )}
          <Link
            href="/pubblica"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            + Pubblica gratis
          </Link>
        </nav>
      </div>
    </header>
  );
}

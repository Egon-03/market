import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logoutAction } from "@/lib/actions";
import SearchBar from "@/components/SearchBar";
import { StoreIcon, ChatIcon, PlusIcon } from "@/components/icons";

export default async function Header() {
  const user = await getCurrentUser();

  const unread = user
    ? await db.message.count({
        where: {
          read: false,
          senderId: { not: user.id },
          conversation: {
            OR: [{ buyerId: user.id }, { listing: { userId: user.id } }],
          },
        },
      })
    : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/90 shadow-[0_1px_12px_rgba(28,25,23,0.05)] backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-600/25 transition-transform group-hover:scale-105">
            <StoreIcon className="h-5.5 w-5.5" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-stone-900">
            Mercatino<span className="text-emerald-600">.ch</span>
          </span>
        </Link>

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:max-w-xl sm:flex-1">
          <SearchBar />
        </div>

        <nav className="order-2 ml-auto flex items-center gap-2 sm:order-3 sm:gap-4">
          {user ? (
            <>
              <Link
                href="/messaggi"
                className="relative flex items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-emerald-700"
              >
                <ChatIcon className="h-5 w-5" />
                <span className="hidden lg:inline">Messaggi</span>
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-amber-500 px-1 text-[10px] font-extrabold text-amber-950 shadow">
                    {unread}
                  </span>
                )}
              </Link>
              <Link
                href="/i-miei-annunci"
                className="hidden rounded-xl px-2 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-emerald-700 md:block"
              >
                I miei annunci
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl px-2 py-2 text-sm font-semibold text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                >
                  Esci
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/accedi"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-emerald-700"
            >
              Accedi
            </Link>
          )}
          <Link href="/pubblica" className="btn-primary !px-4">
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Pubblica gratis</span>
            <span className="sm:hidden">Pubblica</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

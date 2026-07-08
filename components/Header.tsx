import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logoutAction } from "@/lib/actions";
import SearchBar from "@/components/SearchBar";
import { ChatIcon, PlusIcon, TagIcon } from "@/components/icons";

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
    <header className="sticky top-0 z-40 border-b border-ink/12 bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-swiss text-white transition-transform duration-150 group-hover:-rotate-6">
            <TagIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-black lowercase tracking-tight">
            mercatino<span className="text-swiss">.ch</span>
          </span>
        </Link>

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:max-w-lg sm:flex-1">
          <SearchBar />
        </div>

        <nav className="order-2 ml-auto flex items-center gap-1 sm:order-3 sm:gap-2">
          {user ? (
            <>
              <Link
                href="/messaggi"
                className="relative flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink/70 transition hover:bg-smoke hover:text-ink"
              >
                <ChatIcon className="h-5 w-5" />
                <span className="hidden lg:inline">Messaggi</span>
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-swiss px-1 font-display text-[10px] font-black text-white">
                    {unread}
                  </span>
                )}
              </Link>
              <Link
                href="/i-miei-annunci"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-ink/70 transition hover:bg-smoke hover:text-ink md:block"
              >
                I miei annunci
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-full px-3 py-2 text-sm font-semibold text-ash transition hover:bg-smoke hover:text-ink"
                >
                  Esci
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/accedi"
              className="rounded-full px-3 py-2 text-sm font-semibold text-ink/70 transition hover:bg-smoke hover:text-ink"
            >
              Accedi
            </Link>
          )}
          <Link href="/pubblica" className="btn-swiss !px-4 !py-2.5 !text-xs">
            <PlusIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Pubblica gratis</span>
            <span className="sm:hidden">Pubblica</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { SearchIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex animate-rise flex-col items-center justify-center py-24 text-center">
      <p className="display text-[8rem] leading-none text-ink/10 sm:text-[10rem]">404</p>
      <SearchIcon className="-mt-8 h-9 w-9 text-ink/30" />
      <h1 className="display mt-5 text-3xl">Pagina non trovata</h1>
      <p className="mt-2 text-ash">
        L&apos;annuncio potrebbe essere stato venduto o rimosso.
      </p>
      <Link href="/annunci" className="btn-swiss mt-8">
        Sfoglia tutti gli annunci
      </Link>
    </div>
  );
}

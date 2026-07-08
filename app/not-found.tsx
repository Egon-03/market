import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex animate-fade-up flex-col items-center justify-center py-24 text-center">
      <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-stone-100 to-stone-200 text-6xl shadow-inner">
        🔍
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-stone-900">
        Pagina non trovata
      </h1>
      <p className="mt-2 text-stone-500">
        L&apos;annuncio potrebbe essere stato venduto o rimosso.
      </p>
      <Link href="/annunci" className="btn-primary mt-8">
        Sfoglia tutti gli annunci
      </Link>
    </div>
  );
}

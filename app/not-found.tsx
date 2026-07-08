import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl">🔍</p>
      <h1 className="mt-4 text-2xl font-bold">Pagina non trovata</h1>
      <p className="mt-2 text-gray-500">
        L&apos;annuncio potrebbe essere stato venduto o rimosso.
      </p>
      <Link
        href="/annunci"
        className="mt-6 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Sfoglia tutti gli annunci
      </Link>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Verifica e-mail" };
export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let outcome: "ok" | "expired" | "invalid" = "invalid";

  if (token) {
    const user = await db.user.findUnique({ where: { verifyToken: token } });
    if (user) {
      if (user.verifyTokenExpires && user.verifyTokenExpires < new Date()) {
        outcome = "expired";
      } else {
        await db.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
            verifyToken: null,
            verifyTokenExpires: null,
          },
        });
        outcome = "ok";
      }
    }
  }

  return (
    <div className="mx-auto max-w-md animate-fade-up py-10">
      <div className="card p-10 text-center">
        {outcome === "ok" ? (
          <>
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-emerald-50 to-emerald-100 text-5xl shadow-inner">
              ✅
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-stone-900">
              E-mail confermata!
            </h1>
            <p className="mt-2 leading-relaxed text-stone-500">
              Il tuo account è attivo: ora puoi pubblicare annunci e contattare i
              venditori.
            </p>
            <Link href="/pubblica" className="btn-primary mt-7">
              Pubblica il tuo primo annuncio
            </Link>
          </>
        ) : (
          <>
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-amber-50 to-amber-100 text-5xl shadow-inner">
              ⚠️
            </span>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-stone-900">
              {outcome === "expired" ? "Link scaduto" : "Link non valido"}
            </h1>
            <p className="mt-2 leading-relaxed text-stone-500">
              {outcome === "expired"
                ? "Il link di verifica è valido 24 ore. Accedi e richiedi un nuovo invio dal banner in alto."
                : "Il link di verifica non è valido o è già stato utilizzato."}
            </p>
            <Link href="/" className="btn-primary mt-7">
              Torna alla home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

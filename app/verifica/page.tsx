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
    <div className="mx-auto max-w-md animate-rise py-10">
      <div className="card relative overflow-hidden p-10 text-center">
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 ${outcome === "ok" ? "bg-swiss" : "bg-ink"}`}
          aria-hidden="true"
        />
        {outcome === "ok" ? (
          <>
            <h1 className="display mt-4 text-3xl">E-mail confermata!</h1>
            <p className="mt-2 leading-relaxed text-ash">
              Il tuo account è attivo: ora puoi pubblicare annunci e contattare i
              venditori.
            </p>
            <Link href="/pubblica" className="btn-swiss mt-7">
              Pubblica il tuo primo annuncio
            </Link>
          </>
        ) : (
          <>
            <h1 className="display mt-4 text-3xl">
              {outcome === "expired" ? "Link scaduto" : "Link non valido"}
            </h1>
            <p className="mt-2 leading-relaxed text-ash">
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

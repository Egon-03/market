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
    <div className="mx-auto max-w-md py-16 text-center">
      {outcome === "ok" ? (
        <>
          <p className="text-6xl">✅</p>
          <h1 className="mt-4 text-2xl font-bold">E-mail confermata!</h1>
          <p className="mt-2 text-gray-500">
            Il tuo account è attivo: ora puoi pubblicare annunci e contattare i
            venditori.
          </p>
          <Link
            href="/pubblica"
            className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Pubblica il tuo primo annuncio
          </Link>
        </>
      ) : (
        <>
          <p className="text-6xl">⚠️</p>
          <h1 className="mt-4 text-2xl font-bold">
            {outcome === "expired" ? "Link scaduto" : "Link non valido"}
          </h1>
          <p className="mt-2 text-gray-500">
            {outcome === "expired"
              ? "Il link di verifica è valido 24 ore. Accedi e richiedi un nuovo invio dal banner in alto."
              : "Il link di verifica non è valido o è già stato utilizzato."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Torna alla home
          </Link>
        </>
      )}
    </div>
  );
}

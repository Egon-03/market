import type { Metadata } from "next";
import Link from "next/link";
import { MailIcon } from "@/components/icons";

export const metadata: Metadata = { title: "E-mail di verifica inviata" };

export default function VerificationSentPage() {
  return (
    <div className="mx-auto max-w-md animate-rise py-10">
      <div className="card relative overflow-hidden p-10 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-swiss" aria-hidden="true" />
        <MailIcon className="mx-auto h-10 w-10 text-ink/30" />
        <h1 className="display mt-4 text-3xl">E-mail inviata!</h1>
        <p className="mt-2 leading-relaxed text-ash">
          Ti abbiamo inviato una nuova e-mail di verifica. Controlla la tua casella
          di posta (anche lo spam) e clicca sul link entro 24 ore.
        </p>
        <Link href="/" className="btn-swiss mt-7">
          Torna alla home
        </Link>
      </div>
    </div>
  );
}

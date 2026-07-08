import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { resendVerificationAction } from "@/lib/actions";

/** Banner mostrato agli utenti che non hanno ancora confermato l'e-mail. */
export default async function VerifyBanner() {
  const user = await getCurrentUser();
  if (!user) return null;

  const record = await db.user.findUnique({
    where: { id: user.id },
    select: { emailVerified: true },
  });
  if (record?.emailVerified) return null;

  return (
    <div className="border-b border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm font-medium text-amber-900">
        <span>
          📧 Conferma il tuo indirizzo e-mail per pubblicare annunci e contattare i
          venditori.
        </span>
        <form action={resendVerificationAction}>
          <button
            type="submit"
            className="cursor-pointer rounded-lg border border-amber-300 bg-white/60 px-3 py-1 text-xs font-bold text-amber-800 transition hover:bg-white"
          >
            Reinvia e-mail di verifica
          </button>
        </form>
      </div>
    </div>
  );
}

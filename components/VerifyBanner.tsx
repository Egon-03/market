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
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-sm text-amber-800">
        <span>
          📧 Conferma il tuo indirizzo e-mail per pubblicare annunci e contattare i
          venditori.
        </span>
        <form action={resendVerificationAction}>
          <button type="submit" className="font-semibold underline hover:no-underline">
            Reinvia e-mail di verifica
          </button>
        </form>
      </div>
    </div>
  );
}

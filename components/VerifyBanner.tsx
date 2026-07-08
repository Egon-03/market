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
    <div className="border-b border-ink/12 bg-ink">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2.5 text-sm font-medium text-paper/85">
        <span>
          Conferma il tuo indirizzo e-mail per pubblicare annunci e contattare i
          venditori.
        </span>
        <form action={resendVerificationAction}>
          <button
            type="submit"
            className="cursor-pointer rounded-full border border-paper/30 px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-paper transition hover:bg-swiss hover:border-swiss"
          >
            Reinvia e-mail
          </button>
        </form>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatDate, parseImages } from "@/lib/format";
import {
  getListingReportReasonLabel,
  getUserReportReasonLabel,
  REPORT_STATUS_LABELS,
} from "@/lib/reports";
import CategoryIcon from "@/components/CategoryIcon";
import { FlagIcon, TrashIcon, UserXIcon } from "@/components/icons";
import {
  resolveReportAction,
  dismissReportAction,
  removeReportedListingAction,
  banReportedUserAction,
} from "@/lib/reportActions";

export const metadata: Metadata = { title: "Segnalazioni" };
export const dynamic = "force-dynamic";

const STATUSES = ["in_attesa", "risolta", "archiviata"] as const;
type Status = (typeof STATUSES)[number];

type SearchParams = Promise<{ stato?: string }>;

export default async function AdminReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const { stato } = await searchParams;
  const status: Status = STATUSES.includes(stato as Status) ? (stato as Status) : "in_attesa";

  const [reports, counts] = await Promise.all([
    db.report.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        reporter: { select: { name: true, email: true } },
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
            category: true,
            user: { select: { name: true } },
          },
        },
        reportedUser: { select: { id: true, name: true, email: true, banned: true } },
      },
    }),
    db.report.groupBy({ by: ["status"], _count: true }),
  ]);
  const countByStatus = Object.fromEntries(counts.map((c) => [c.status, c._count])) as Record<
    string,
    number
  >;

  return (
    <div className="space-y-6">
      {/* Tab di stato */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/segnalazioni?stato=${s}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              status === s
                ? "border-swiss bg-swiss text-white"
                : "border-ink/20 bg-white text-ink hover:border-ink"
            }`}
          >
            {REPORT_STATUS_LABELS[s]}
            <span className={`tabular-nums ${status === s ? "text-white/75" : "text-ash"}`}>
              {countByStatus[s] ?? 0}
            </span>
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="card border-dashed p-14 text-center">
          <FlagIcon className="mx-auto h-8 w-8 text-ink/20" />
          <p className="display mt-4 text-xl">Nessuna segnalazione qui</p>
          <p className="mt-1 text-sm text-ash">
            {status === "in_attesa"
              ? "Ottimo, non ci sono segnalazioni da esaminare al momento."
              : "Non ci sono segnalazioni in questo stato."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reports.map((report) => {
            const cover = report.listing ? parseImages(report.listing.images)[0] : undefined;
            const reasonLabel =
              report.type === "listing"
                ? getListingReportReasonLabel(report.reason)
                : getUserReportReasonLabel(report.reason);

            return (
              <li key={report.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full border border-ink/20 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide text-ink">
                    {report.type === "listing" ? "Annuncio" : "Utente"}
                  </span>
                  <span className="text-xs tabular-nums text-ash">{formatDate(report.createdAt)}</span>
                </div>

                <p className="mt-3 font-display text-sm font-bold uppercase tracking-wide text-ink">
                  {reasonLabel}
                </p>
                {report.message && (
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink/75">
                    “{report.message}”
                  </p>
                )}
                <p className="mt-3 text-xs text-ash">
                  Segnalato da <strong className="text-ink">{report.reporter.name}</strong> (
                  {report.reporter.email})
                </p>

                {/* Bersaglio della segnalazione */}
                {report.type === "listing" &&
                  (report.listing ? (
                    <Link
                      href={`/annunci/${report.listing.id}`}
                      target="_blank"
                      className="mt-3 flex items-center gap-3 rounded-lg border border-ink/12 p-3 transition hover:border-ink"
                    >
                      <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-md bg-smoke">
                        {cover ? (
                          <Image src={cover} alt="" fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-ink/20">
                            <CategoryIcon slug={report.listing.category} className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">{report.listing.title}</p>
                        <p className="text-xs text-ash">Venditore: {report.listing.user.name}</p>
                      </div>
                    </Link>
                  ) : (
                    <p className="mt-3 rounded-lg bg-smoke px-3 py-2 text-xs text-ash">
                      L&apos;annuncio non è più disponibile (rimosso o già eliminato).
                    </p>
                  ))}

                {report.type === "user" && report.reportedUser && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-ink/12 p-3">
                    <div>
                      <p className="text-sm font-bold text-ink">{report.reportedUser.name}</p>
                      <p className="text-xs text-ash">{report.reportedUser.email}</p>
                    </div>
                    {report.reportedUser.banned && (
                      <span className="rounded-full bg-ink px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-paper">
                        Sospeso
                      </span>
                    )}
                  </div>
                )}

                {/* Azioni di moderazione */}
                {status === "in_attesa" && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
                    <form action={resolveReportAction}>
                      <input type="hidden" name="id" value={report.id} />
                      <button type="submit" className="btn-secondary !px-3.5 !py-2 !text-xs">
                        Segna come risolta
                      </button>
                    </form>
                    <form action={dismissReportAction}>
                      <input type="hidden" name="id" value={report.id} />
                      <button type="submit" className="btn-secondary !px-3.5 !py-2 !text-xs">
                        Archivia
                      </button>
                    </form>
                    {report.type === "listing" && report.listing && (
                      <form action={removeReportedListingAction}>
                        <input type="hidden" name="id" value={report.id} />
                        <button type="submit" className="btn-danger inline-flex items-center gap-1.5 !px-3.5 !py-2 !text-xs">
                          <TrashIcon className="h-3.5 w-3.5" />
                          Rimuovi annuncio
                        </button>
                      </form>
                    )}
                    {report.type === "user" && report.reportedUser && !report.reportedUser.banned && (
                      <form action={banReportedUserAction}>
                        <input type="hidden" name="id" value={report.id} />
                        <button type="submit" className="btn-danger inline-flex items-center gap-1.5 !px-3.5 !py-2 !text-xs">
                          <UserXIcon className="h-3.5 w-3.5" />
                          Sospendi utente
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

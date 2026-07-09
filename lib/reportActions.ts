"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUserId, requireAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { LISTING_REPORT_REASONS, USER_REPORT_REASONS } from "@/lib/reports";
import type { ActionState } from "@/lib/actions";

const REPORT_RATE_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 }; // 10 segnalazioni/ora per utente

export async function reportListingAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await getSessionUserId();
  const listingId = String(formData.get("listingId") ?? "");
  if (!userId) redirect(`/accedi?next=/annunci/${listingId}`);

  const reason = String(formData.get("reason") ?? "");
  const message = String(formData.get("message") ?? "").trim().slice(0, 1000) || null;

  if (!LISTING_REPORT_REASONS.some((r) => r.value === reason))
    return { error: "Seleziona un motivo valido." };

  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing) return { error: "Annuncio non trovato." };
  if (listing.userId === userId) return { error: "Non puoi segnalare un tuo annuncio." };

  const existing = await db.report.findFirst({
    where: { type: "listing", listingId, reporterId: userId, status: "in_attesa" },
  });
  if (existing)
    return { error: "Hai già segnalato questo annuncio: il nostro team lo esaminerà a breve." };

  const allowed = await checkRateLimit({ key: `report:${userId}`, ...REPORT_RATE_LIMIT });
  if (!allowed) return { error: "Hai inviato troppe segnalazioni di recente. Riprova più tardi." };

  await db.report.create({
    data: { type: "listing", reason, message, reporterId: userId, listingId },
  });

  revalidatePath(`/annunci/${listingId}`);
  return undefined;
}

export async function reportUserAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await getSessionUserId();
  const reportedUserId = String(formData.get("reportedUserId") ?? "");
  if (!userId) redirect("/accedi");

  const reason = String(formData.get("reason") ?? "");
  const message = String(formData.get("message") ?? "").trim().slice(0, 1000) || null;

  if (!USER_REPORT_REASONS.some((r) => r.value === reason))
    return { error: "Seleziona un motivo valido." };
  if (reportedUserId === userId) return { error: "Non puoi segnalare te stesso." };

  const reportedUser = await db.user.findUnique({ where: { id: reportedUserId } });
  if (!reportedUser) return { error: "Utente non trovato." };

  const existing = await db.report.findFirst({
    where: { type: "user", reportedUserId, reporterId: userId, status: "in_attesa" },
  });
  if (existing)
    return { error: "Hai già segnalato questo utente: il nostro team lo esaminerà a breve." };

  const allowed = await checkRateLimit({ key: `report:${userId}`, ...REPORT_RATE_LIMIT });
  if (!allowed) return { error: "Hai inviato troppe segnalazioni di recente. Riprova più tardi." };

  await db.report.create({
    data: { type: "user", reason, message, reporterId: userId, reportedUserId },
  });

  return undefined;
}

// ---------- Moderazione (solo amministratori) ----------

export async function resolveReportAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await db.report.update({ where: { id }, data: { status: "risolta", reviewedAt: new Date() } });
  revalidatePath("/admin/segnalazioni");
}

export async function dismissReportAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await db.report.update({ where: { id }, data: { status: "archiviata", reviewedAt: new Date() } });
  revalidatePath("/admin/segnalazioni");
}

export async function removeReportedListingAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const report = await db.report.findUnique({ where: { id } });
  if (report?.listingId) {
    await db.listing.delete({ where: { id: report.listingId } }).catch(() => {});
  }
  await db.report.update({ where: { id }, data: { status: "risolta", reviewedAt: new Date() } });
  revalidatePath("/admin/segnalazioni");
  revalidatePath("/annunci");
  revalidatePath("/");
}

export async function banReportedUserAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const report = await db.report.findUnique({ where: { id } });
  if (report?.reportedUserId) {
    await db.user.update({ where: { id: report.reportedUserId }, data: { banned: true } });
  }
  await db.report.update({ where: { id }, data: { status: "risolta", reviewedAt: new Date() } });
  revalidatePath("/admin/segnalazioni");
}

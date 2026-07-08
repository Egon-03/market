"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { db } from "@/lib/db";
import { createSession, destroySession, getSessionUserId } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { CATEGORIES, CONDITIONS } from "@/lib/categories";
import { CANTONS } from "@/lib/cantons";

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 ore

function newVerifyToken() {
  return {
    verifyToken: crypto.randomBytes(32).toString("hex"),
    verifyTokenExpires: new Date(Date.now() + VERIFY_TOKEN_TTL_MS),
  };
}

export type ActionState = { error?: string } | undefined;

// ---------- Autenticazione ----------

export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (name.length < 2) return { error: "Inserisci il tuo nome (min. 2 caratteri)." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Inserisci un indirizzo e-mail valido." };
  if (password.length < 8)
    return { error: "La password deve contenere almeno 8 caratteri." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "Esiste già un account con questa e-mail." };

  const passwordHash = await bcrypt.hash(password, 10);
  const token = newVerifyToken();
  const user = await db.user.create({
    data: { name, email, passwordHash, phone, ...token },
  });

  await sendVerificationEmail(email, token.verifyToken);
  await createSession(user.id);
  redirect("/");
}

export async function resendVerificationAction(): Promise<void> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/accedi");
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || user.emailVerified) redirect("/");

  const token = newVerifyToken();
  await db.user.update({ where: { id: user.id }, data: token });
  await sendVerificationEmail(user.email, token.verifyToken);
  redirect("/verifica/inviata");
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return { error: "E-mail o password non corretti." };

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

// ---------- Annunci ----------

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

async function saveImages(files: File[]): Promise<string[] | { error: string }> {
  const valid = files.filter((f) => f.size > 0);
  if (valid.length > MAX_IMAGES)
    return { error: `Puoi caricare al massimo ${MAX_IMAGES} immagini.` };

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });

  const saved: string[] = [];
  for (const file of valid) {
    const ext = ALLOWED_TYPES[file.type];
    if (!ext)
      return { error: "Formato immagine non supportato (usa JPG, PNG o WebP)." };
    if (file.size > MAX_IMAGE_BYTES)
      return { error: "Ogni immagine può pesare al massimo 5 MB." };
    const filename = `${crypto.randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);
    saved.push(`/uploads/${filename}`);
  }
  return saved;
}

export async function createListingAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/accedi?next=/pubblica");

  const author = await db.user.findUnique({ where: { id: userId } });
  if (!author?.emailVerified)
    return {
      error:
        "Devi prima confermare il tuo indirizzo e-mail: controlla la tua casella di posta.",
    };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const condition = String(formData.get("condition") ?? "usato");
  const canton = String(formData.get("canton") ?? "");
  const city = String(formData.get("city") ?? "").trim() || null;
  const priceMode = String(formData.get("priceMode") ?? "fixed");
  const priceRaw = String(formData.get("price") ?? "").replace(",", ".");

  if (title.length < 5)
    return { error: "Il titolo deve contenere almeno 5 caratteri." };
  if (title.length > 100)
    return { error: "Il titolo può contenere al massimo 100 caratteri." };
  if (description.length < 20)
    return { error: "La descrizione deve contenere almeno 20 caratteri." };
  if (!CATEGORIES.some((c) => c.slug === category))
    return { error: "Seleziona una categoria valida." };
  if (!CONDITIONS.some((c) => c.value === condition))
    return { error: "Seleziona una condizione valida." };
  if (!CANTONS.some((c) => c.code === canton))
    return { error: "Seleziona un cantone valido." };

  let price: number | null = null;
  if (priceMode === "free") {
    price = 0;
  } else if (priceMode === "fixed") {
    price = Number(priceRaw);
    if (!Number.isFinite(price) || price < 0 || price > 100_000_000)
      return { error: "Inserisci un prezzo valido." };
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  const images = await saveImages(files);
  if (!Array.isArray(images)) return images;

  const listing = await db.listing.create({
    data: {
      title,
      description,
      price,
      category,
      condition,
      canton,
      city,
      images: JSON.stringify(images),
      userId,
    },
  });

  revalidatePath("/");
  revalidatePath("/annunci");
  redirect(`/annunci/${listing.id}`);
}

export async function markSoldAction(formData: FormData): Promise<void> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/accedi");
  const id = String(formData.get("id") ?? "");
  await db.listing.updateMany({
    where: { id, userId },
    data: { status: "venduto" },
  });
  revalidatePath("/i-miei-annunci");
  revalidatePath(`/annunci/${id}`);
}

export async function deleteListingAction(formData: FormData): Promise<void> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/accedi");
  const id = String(formData.get("id") ?? "");
  await db.listing.deleteMany({ where: { id, userId } });
  revalidatePath("/i-miei-annunci");
  revalidatePath("/annunci");
  revalidatePath("/");
}

// ---------- Messaggi ----------

const MAX_MESSAGE_LENGTH = 2000;

export async function startConversationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await getSessionUserId();
  const listingId = String(formData.get("listingId") ?? "");
  if (!userId) redirect(`/accedi?next=/annunci/${listingId}`);

  const sender = await db.user.findUnique({ where: { id: userId } });
  if (!sender?.emailVerified)
    return {
      error:
        "Devi prima confermare il tuo indirizzo e-mail per contattare i venditori.",
    };

  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 2) return { error: "Scrivi un messaggio." };
  if (body.length > MAX_MESSAGE_LENGTH)
    return { error: `Il messaggio può contenere al massimo ${MAX_MESSAGE_LENGTH} caratteri.` };

  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing) return { error: "Annuncio non trovato." };
  if (listing.userId === userId)
    return { error: "Non puoi contattare te stesso." };

  const conversation = await db.conversation.upsert({
    where: { listingId_buyerId: { listingId, buyerId: userId } },
    update: { updatedAt: new Date() },
    create: { listingId, buyerId: userId },
  });

  await db.message.create({
    data: { conversationId: conversation.id, senderId: userId, body },
  });

  redirect(`/messaggi/${conversation.id}`);
}

export async function replyMessageAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/accedi");

  const conversationId = String(formData.get("conversationId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return { error: "Scrivi un messaggio." };
  if (body.length > MAX_MESSAGE_LENGTH)
    return { error: `Il messaggio può contenere al massimo ${MAX_MESSAGE_LENGTH} caratteri.` };

  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: { listing: { select: { userId: true } } },
  });
  if (
    !conversation ||
    (conversation.buyerId !== userId && conversation.listing.userId !== userId)
  )
    return { error: "Conversazione non trovata." };

  await db.message.create({
    data: { conversationId, senderId: userId, body },
  });
  await db.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/messaggi/${conversationId}`);
  revalidatePath("/messaggi");
  return undefined;
}

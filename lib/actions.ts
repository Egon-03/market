"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import { createSession, destroySession, getSessionUserId } from "@/lib/auth";
import { sendVerificationEmail, sendNewMessageEmail } from "@/lib/email";
import { saveUploadedImage, randomImageFilename } from "@/lib/storage";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { CONDITIONS, FUEL_TYPES, TRANSMISSIONS, getCategory } from "@/lib/categories";
import { CANTONS } from "@/lib/cantons";

const VEHICLE_CATEGORY = "auto-moto";

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
  const ip = await getClientIp();
  const allowed = await checkRateLimit({
    key: `register:${ip}`,
    limit: 5,
    windowMs: 60 * 60 * 1000, // 5 registrazioni/ora per IP
  });
  if (!allowed)
    return { error: "Troppi tentativi di registrazione. Riprova tra qualche minuto." };

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

  const allowed = await checkRateLimit({
    key: `resend-verify:${userId}`,
    limit: 1,
    windowMs: 60 * 1000, // 1 reinvio al minuto per utente
  });
  if (!allowed) redirect("/verifica/inviata");

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

  const ip = await getClientIp();
  // Limite specifico per coppia IP+account (blocca il bruteforce su un
  // singolo utente) e limite più ampio per IP (blocca il credential
  // stuffing su tanti account diversi), senza penalizzare utenti diversi
  // che condividono lo stesso IP (reti aziendali, NAT).
  const [perAccountAllowed, perIpAllowed] = await Promise.all([
    checkRateLimit({ key: `login:${ip}:${email}`, limit: 10, windowMs: 15 * 60 * 1000 }),
    checkRateLimit({ key: `login:${ip}`, limit: 40, windowMs: 15 * 60 * 1000 }),
  ]);
  if (!perAccountAllowed || !perIpAllowed)
    return { error: "Troppi tentativi di accesso. Riprova tra qualche minuto." };

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return { error: "E-mail o password non corretti." };
  if (user.banned)
    return {
      error:
        "Il tuo account è stato sospeso per violazione delle regole del sito.",
    };

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

  const saved: string[] = [];
  for (const file of valid) {
    const ext = ALLOWED_TYPES[file.type];
    if (!ext)
      return { error: "Formato immagine non supportato (usa JPG, PNG o WebP)." };
    if (file.size > MAX_IMAGE_BYTES)
      return { error: "Ogni immagine può pesare al massimo 5 MB." };
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveUploadedImage(buffer, randomImageFilename(ext), file.type);
    saved.push(url);
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
  if (author?.banned) return { error: "Il tuo account è stato sospeso." };
  if (!author?.emailVerified)
    return {
      error:
        "Devi prima confermare il tuo indirizzo e-mail: controlla la tua casella di posta.",
    };

  const allowedToPublish = await checkRateLimit({
    key: `publish:${userId}`,
    limit: 10,
    windowMs: 60 * 60 * 1000, // 10 annunci/ora per utente
  });
  if (!allowedToPublish)
    return { error: "Hai pubblicato troppi annunci di recente. Riprova tra qualche minuto." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const subcategory = String(formData.get("subcategory") ?? "");
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
  const categoryDef = getCategory(category);
  if (!categoryDef) return { error: "Seleziona una categoria valida." };
  if (!categoryDef.subcategories.some((s) => s.slug === subcategory))
    return { error: "Seleziona una sottocategoria valida." };
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

  // Campi specifici veicoli, salvati solo per la categoria Auto & Moto
  let brand: string | null = null;
  let model: string | null = null;
  let year: number | null = null;
  let mileageKm: number | null = null;
  let fuelType: string | null = null;
  let transmission: string | null = null;
  let powerHp: number | null = null;

  if (category === VEHICLE_CATEGORY) {
    brand = String(formData.get("brand") ?? "").trim() || null;
    model = String(formData.get("model") ?? "").trim() || null;
    if (!brand) return { error: "Indica la marca del veicolo." };
    if (!model) return { error: "Indica il modello del veicolo." };

    const yearRaw = String(formData.get("year") ?? "");
    if (yearRaw) {
      year = Number(yearRaw);
      const currentYear = new Date().getFullYear();
      if (!Number.isInteger(year) || year < 1950 || year > currentYear + 1)
        return { error: "Inserisci un anno di immatricolazione valido." };
    }

    const mileageRaw = String(formData.get("mileageKm") ?? "");
    if (mileageRaw) {
      mileageKm = Number(mileageRaw);
      if (!Number.isFinite(mileageKm) || mileageKm < 0 || mileageKm > 2_000_000)
        return { error: "Inserisci un chilometraggio valido." };
    }

    const fuelRaw = String(formData.get("fuelType") ?? "");
    if (fuelRaw) {
      if (!FUEL_TYPES.some((f) => f.value === fuelRaw))
        return { error: "Seleziona un'alimentazione valida." };
      fuelType = fuelRaw;
    }

    const transmissionRaw = String(formData.get("transmission") ?? "");
    if (transmissionRaw) {
      if (!TRANSMISSIONS.some((t) => t.value === transmissionRaw))
        return { error: "Seleziona un cambio valido." };
      transmission = transmissionRaw;
    }

    const powerRaw = String(formData.get("powerHp") ?? "");
    if (powerRaw) {
      powerHp = Number(powerRaw);
      if (!Number.isInteger(powerHp) || powerHp < 1 || powerHp > 5000)
        return { error: "Inserisci una potenza (CV) valida." };
    }
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
      subcategory,
      condition,
      canton,
      city,
      images: JSON.stringify(images),
      userId,
      brand,
      model,
      year,
      mileageKm,
      fuelType,
      transmission,
      powerHp,
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
  if (sender?.banned) return { error: "Il tuo account è stato sospeso." };
  if (!sender?.emailVerified)
    return {
      error:
        "Devi prima confermare il tuo indirizzo e-mail per contattare i venditori.",
    };

  const allowedToMessage = await checkRateLimit({
    key: `message:${userId}`,
    limit: 20,
    windowMs: 10 * 60 * 1000, // 20 messaggi ogni 10 minuti per utente
  });
  if (!allowedToMessage)
    return { error: "Hai inviato troppi messaggi di recente. Riprova tra qualche minuto." };

  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 2) return { error: "Scrivi un messaggio." };
  if (body.length > MAX_MESSAGE_LENGTH)
    return { error: `Il messaggio può contenere al massimo ${MAX_MESSAGE_LENGTH} caratteri.` };

  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { user: { select: { email: true, name: true } } },
  });
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

  sendNewMessageEmail({
    to: listing.user.email,
    recipientName: listing.user.name,
    senderName: sender.name,
    listingTitle: listing.title,
    preview: body,
    conversationId: conversation.id,
  }).catch((err) => console.error("[email] invio notifica fallito:", err));

  redirect(`/messaggi/${conversation.id}`);
}

export async function replyMessageAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/accedi");

  const sender = await db.user.findUnique({ where: { id: userId }, select: { name: true, banned: true } });
  if (sender?.banned) return { error: "Il tuo account è stato sospeso." };

  const allowedToMessage = await checkRateLimit({
    key: `message:${userId}`,
    limit: 20,
    windowMs: 10 * 60 * 1000, // 20 messaggi ogni 10 minuti per utente
  });
  if (!allowedToMessage)
    return { error: "Hai inviato troppi messaggi di recente. Riprova tra qualche minuto." };

  const conversationId = String(formData.get("conversationId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return { error: "Scrivi un messaggio." };
  if (body.length > MAX_MESSAGE_LENGTH)
    return { error: `Il messaggio può contenere al massimo ${MAX_MESSAGE_LENGTH} caratteri.` };

  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      listing: { select: { title: true, userId: true, user: { select: { email: true, name: true } } } },
      buyer: { select: { email: true, name: true } },
    },
  });
  if (
    !conversation ||
    (conversation.buyerId !== userId && conversation.listing.userId !== userId)
  )
    return { error: "Conversazione non trovata." };
  const isSenderSeller = conversation.listing.userId === userId;
  const recipient = isSenderSeller ? conversation.buyer : conversation.listing.user;

  await db.message.create({
    data: { conversationId, senderId: userId, body },
  });
  await db.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  sendNewMessageEmail({
    to: recipient.email,
    recipientName: recipient.name,
    senderName: sender?.name ?? "Un utente",
    listingTitle: conversation.listing.title,
    preview: body,
    conversationId,
  }).catch((err) => console.error("[email] invio notifica fallito:", err));

  revalidatePath(`/messaggi/${conversationId}`);
  revalidatePath("/messaggi");
  return undefined;
}

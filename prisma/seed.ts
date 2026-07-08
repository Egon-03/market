/**
 * Dati demo per lo sviluppo: crea un utente di prova e alcuni annunci.
 * Esegui con: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await db.user.upsert({
    where: { email: "demo@example.com" },
    update: { emailVerified: new Date() },
    create: {
      email: "demo@example.com",
      name: "Utente Demo",
      passwordHash,
      phone: "+41 79 000 00 00",
      emailVerified: new Date(),
    },
  });

  const anna = await db.user.upsert({
    where: { email: "anna@example.com" },
    update: { emailVerified: new Date() },
    create: {
      email: "anna@example.com",
      name: "Anna Bianchi",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  const listings = [
    {
      title: "Bicicletta da corsa carbonio taglia M",
      description:
        "Vendo bici da corsa in carbonio, taglia M, gruppo Shimano 105. Usata due stagioni, sempre tenuta in garage. Tagliando appena fatto.",
      price: 850,
      category: "sport-tempo-libero",
      condition: "usato",
      canton: "TI",
      city: "Lugano",
    },
    {
      title: "iPhone 14 128GB nero, come nuovo",
      description:
        "iPhone 14 da 128GB colore mezzanotte, batteria al 92%. Sempre usato con custodia e vetro temperato. Scatola e accessori originali inclusi.",
      price: 480,
      category: "elettronica",
      condition: "come-nuovo",
      canton: "ZH",
      city: "Zurigo",
    },
    {
      title: "Divano 3 posti grigio da regalare",
      description:
        "Regalo divano 3 posti in tessuto grigio, comodo e in buono stato. Da ritirare sul posto entro fine mese, piano terra.",
      price: 0,
      category: "casa-giardino",
      condition: "usato",
      canton: "TI",
      city: "Bellinzona",
    },
    {
      title: "Seggiolino auto bimbo 9-36 kg",
      description:
        "Seggiolino auto gruppo 1/2/3 (9-36 kg), mai incidentato, lavabile. Usato dal secondo figlio, in buone condizioni generali.",
      price: 45,
      category: "bambini",
      condition: "usato",
      canton: "GE",
      city: "Ginevra",
    },
    {
      title: "Collezione francobolli svizzeri 1950-1980",
      description:
        "Collezione di francobolli svizzeri dal 1950 al 1980 in tre album. Prezzo da discutere dopo visione, vendo per motivi di spazio.",
      price: null,
      category: "collezionismo",
      condition: "usato",
      canton: "BE",
      city: "Berna",
    },
    {
      title: "Monitor 27 pollici 144Hz per gaming",
      description:
        "Monitor gaming 27\" QHD 144Hz, perfetto per e-sport. Nessun pixel morto, pochissime ore di utilizzo. Cavo DisplayPort incluso.",
      price: 220,
      category: "informatica",
      condition: "come-nuovo",
      canton: "VD",
      city: "Losanna",
    },
  ];

  let firstListingId: string | null = null;
  for (const data of listings) {
    const listing = await db.listing.create({ data: { ...data, userId: user.id } });
    firstListingId ??= listing.id;
  }

  // Conversazione di esempio: Anna contatta l'Utente Demo per il primo annuncio
  if (firstListingId) {
    const conversation = await db.conversation.create({
      data: { listingId: firstListingId, buyerId: anna.id },
    });
    await db.message.createMany({
      data: [
        {
          conversationId: conversation.id,
          senderId: anna.id,
          body: "Ciao! La bici è ancora disponibile? Potrei passare a vederla sabato mattina.",
        },
        {
          conversationId: conversation.id,
          senderId: user.id,
          body: "Ciao Anna, sì è disponibile! Sabato mattina va benissimo, ti scrivo l'indirizzo.",
          read: true,
        },
      ],
    });
  }

  console.log(
    `Seed completato: utenti demo@example.com e anna@example.com (password: password123), ${listings.length} annunci e una conversazione di esempio.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

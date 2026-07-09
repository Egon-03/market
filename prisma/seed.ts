/**
 * Dati demo per lo sviluppo: crea alcuni utenti e annunci realistici che
 * coprono tutte le categorie e sottocategorie del sito.
 * Esegui con: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

type SeedListing = {
  title: string;
  description: string;
  price: number | null;
  category: string;
  subcategory: string;
  condition: "nuovo" | "come-nuovo" | "usato" | "difettoso";
  canton: string;
  city: string;
  owner?: "demo" | "anna" | "marco" | "giulia";
  brand?: string;
  model?: string;
  year?: number;
  mileageKm?: number;
  fuelType?: "benzina" | "diesel" | "elettrico" | "ibrido" | "gpl-metano";
  transmission?: "manuale" | "automatico";
  powerHp?: number;
};

const listings: SeedListing[] = [
  // ---------- Auto & Moto ----------
  {
    title: "VW Golf 8 GTI 2.0 TSI, 245 CV, come nuova",
    description:
      "Volkswagen Golf 8 GTI, prima immatricolazione 2021. Full optional: tetto panoramico, navigatore, sedili sportivi in Alcantara, Adaptive Cruise Control. Tagliandi sempre eseguiti in garage ufficiale VW, gomme estive e invernali su cerchi separati incluse. Nessun incidente, veicolo non fumatori.",
    price: 28900,
    category: "auto-moto",
    subcategory: "automobili",
    condition: "usato",
    canton: "ZH",
    city: "Zurigo",
    owner: "marco",
    brand: "Volkswagen",
    model: "Golf 8 GTI",
    year: 2021,
    mileageKm: 35000,
    fuelType: "benzina",
    transmission: "manuale",
    powerHp: 245,
  },
  {
    title: "Audi A4 Avant 2.0 TDI quattro, 190 CV",
    description:
      "Audi A4 Avant quattro con cambio automatico S tronic, prima immatricolazione 2019. Interni in pelle, sedili riscaldati, Virtual Cockpit, sensori di parcheggio anteriori e posteriori. Auto aziendale ben tenuta, chilometraggio autostradale, libretto di manutenzione completo.",
    price: 24500,
    category: "auto-moto",
    subcategory: "automobili",
    condition: "usato",
    canton: "VD",
    city: "Losanna",
    owner: "marco",
    brand: "Audi",
    model: "A4 Avant 2.0 TDI quattro",
    year: 2019,
    mileageKm: 68000,
    fuelType: "diesel",
    transmission: "automatico",
    powerHp: 190,
  },
  {
    title: "Fiat Panda 1.2 69 CV, prima auto ideale",
    description:
      "Fiat Panda cinque porte, motore 1.2 benzina 69 CV, consumi molto contenuti. Perfetta come prima auto o city car. Climatizzatore, radio Bluetooth, revisione appena effettuata. Qualche segno di utilizzo sulla carrozzeria, meccanicamente in ottimo stato.",
    price: 6900,
    category: "auto-moto",
    subcategory: "automobili",
    condition: "usato",
    canton: "TI",
    city: "Bellinzona",
    brand: "Fiat",
    model: "Panda 1.2",
    year: 2016,
    mileageKm: 89000,
    fuelType: "benzina",
    transmission: "manuale",
    powerHp: 69,
  },
  {
    title: "Tesla Model 3 Long Range, autonomia 580 km",
    description:
      "Tesla Model 3 Long Range con trazione integrale, prima immatricolazione 2022. Autopilot incluso, tetto in vetro, cerchi da 19\". Ricarica rapida Supercharger, batteria all'88% di salute stimata. Ideale per chi percorre molti chilometri e vuole azzerare i costi di carburante.",
    price: 36900,
    category: "auto-moto",
    subcategory: "automobili",
    condition: "come-nuovo",
    canton: "GE",
    city: "Ginevra",
    owner: "marco",
    brand: "Tesla",
    model: "Model 3 Long Range",
    year: 2022,
    mileageKm: 28000,
    fuelType: "elettrico",
    transmission: "automatico",
    powerHp: 366,
  },
  {
    title: "Yamaha MT-07 ABS, naked 75 CV",
    description:
      "Yamaha MT-07 ABS, moto naked leggera e divertente, perfetta anche per neopatentati (depotenziabile). Marmitta Akrapovic omologata, mai caduta, tagliandi in officina Yamaha. Venduta con bauletto posteriore e copertura antipioggia.",
    price: 6200,
    category: "auto-moto",
    subcategory: "moto-scooter",
    condition: "usato",
    canton: "TI",
    city: "Lugano",
    brand: "Yamaha",
    model: "MT-07 ABS",
    year: 2020,
    mileageKm: 12000,
    fuelType: "benzina",
    transmission: "manuale",
    powerHp: 75,
  },
  {
    title: "Piaggio Vespa Primavera 125, come nuova",
    description:
      "Vespa Primavera 125 4T, colore verde acqua, acquistata un anno fa e usata pochissimo per tragitti casa-lavoro. Cambio automatico CVT, freno ABS, presa USB sottosella. Tenuta in garage, mai lasciata all'aperto.",
    price: 3400,
    category: "auto-moto",
    subcategory: "moto-scooter",
    condition: "come-nuovo",
    canton: "GE",
    city: "Ginevra",
    owner: "giulia",
    brand: "Piaggio",
    model: "Vespa Primavera 125",
    year: 2022,
    mileageKm: 3000,
    fuelType: "benzina",
    transmission: "automatico",
    powerHp: 12,
  },
  {
    title: "Mercedes-Benz Sprinter 316 CDI furgone",
    description:
      "Furgone Mercedes-Benz Sprinter 316 CDI, passo lungo, tetto normale, portata utile 1.4 tonnellate. Usato per consegne, tagliandato regolarmente presso officina autorizzata. Cassone in ottimo stato, nessuna infiltrazione. Ideale per artigiani o piccole imprese di trasporto.",
    price: 19500,
    category: "auto-moto",
    subcategory: "veicoli-commerciali",
    condition: "usato",
    canton: "BE",
    city: "Berna",
    owner: "marco",
    brand: "Mercedes-Benz",
    model: "Sprinter 316 CDI",
    year: 2018,
    mileageKm: 120000,
    fuelType: "diesel",
    transmission: "manuale",
    powerHp: 143,
  },
  {
    title: "Fiat Ducato camperizzato Knaus, 4 posti letto",
    description:
      "Camper su base Fiat Ducato, allestimento Knaus con 4 posti letto, cucina, frigo, doccia e WC chimico. Pannello solare installato, batteria di servizio supplementare. Pronto per partire, tagliando e revisione appena fatti, gomme quasi nuove.",
    price: 34900,
    category: "auto-moto",
    subcategory: "camper-roulotte",
    condition: "usato",
    canton: "SG",
    city: "San Gallo",
    owner: "marco",
    brand: "Fiat",
    model: "Ducato Camper Knaus",
    year: 2015,
    mileageKm: 75000,
    fuelType: "diesel",
    transmission: "manuale",
    powerHp: 130,
  },
  {
    title: "Set 4 cerchi in lega originali BMW 18\"",
    description:
      "Quattro cerchi in lega originali BMW da 18 pollici, stile 792, con gomme estive Continental usate una sola stagione (profilo circa 6mm). Adatti a Serie 3 e Serie 4. Vendo perché passato a cerchi invernali dedicati.",
    price: 890,
    category: "auto-moto",
    subcategory: "ricambi-accessori",
    condition: "usato",
    canton: "AG",
    city: "Aarau",
    brand: "BMW",
    model: "Cerchi in lega stile 792 18\"",
  },
  {
    title: "Kit frizione Sachs per VW Golf/Audi A3 2.0 TDI",
    description:
      "Kit frizione completo Sachs (disco, spingidisco, cuscinetto reggispinta) per motori 2.0 TDI VW/Audi/Seat/Škoda. Ancora sigillato in confezione originale, acquistato in eccesso rispetto al necessario. Fattura disponibile su richiesta.",
    price: 180,
    category: "auto-moto",
    subcategory: "ricambi-accessori",
    condition: "nuovo",
    canton: "ZH",
    city: "Winterthur",
    brand: "Sachs",
    model: "Kit frizione 2.0 TDI",
  },
  {
    title: "4 pneumatici invernali Pirelli 205/55 R16",
    description:
      "Set di 4 pneumatici invernali Pirelli Cinturato Winter 205/55 R16 91H, montati un solo inverno, battistrada residuo circa 7mm. Perfetti per berline compatte, nessuna riparazione o foratura.",
    price: 280,
    category: "auto-moto",
    subcategory: "pneumatici-cerchi",
    condition: "usato",
    canton: "LU",
    city: "Lucerna",
    brand: "Pirelli",
    model: "Cinturato Winter 205/55 R16",
  },

  // ---------- Elettronica ----------
  {
    title: "iPhone 14 128GB nero, come nuovo",
    description:
      "iPhone 14 da 128GB colore mezzanotte, batteria al 92%. Sempre usato con custodia e vetro temperato. Scatola e accessori originali inclusi.",
    price: 480,
    category: "elettronica",
    subcategory: "smartphone",
    condition: "come-nuovo",
    canton: "ZH",
    city: "Zurigo",
  },
  {
    title: "Samsung Galaxy S23 256GB, garanzia fino al 2026",
    description:
      "Samsung Galaxy S23 256GB colore verde, acquistato 6 mesi fa presso Digitec, ancora in garanzia ufficiale Samsung. Nessun graffio, sempre tenuto con cover e pellicola. Venduto con scatola, caricatore originale e cavo USB-C.",
    price: 590,
    category: "elettronica",
    subcategory: "smartphone",
    condition: "come-nuovo",
    canton: "VD",
    city: "Losanna",
    owner: "giulia",
  },
  {
    title: "iPad Air 5ª generazione 64GB Wi-Fi",
    description:
      "iPad Air (M1) 5ª generazione, 64GB Wi-Fi, colore grigio siderale. Usato principalmente per disegno digitale con Apple Pencil (non inclusa). Schermo perfetto, nessun graffio, batteria eccellente.",
    price: 420,
    category: "elettronica",
    subcategory: "computer-tablet",
    condition: "usato",
    canton: "TI",
    city: "Lugano",
  },
  {
    title: "Samsung TV QLED 55\" 4K, con telecomando",
    description:
      "Smart TV Samsung QLED da 55 pollici, risoluzione 4K HDR, sistema Tizen con Netflix e Disney+ preinstallati. Funziona perfettamente, venduta per passaggio a modello OLED. Include telecomando originale e supporto da tavolo.",
    price: 390,
    category: "elettronica",
    subcategory: "tv-audio",
    condition: "usato",
    canton: "BE",
    city: "Berna",
  },
  {
    title: "Sonos One (Gen 2) coppia di altoparlanti",
    description:
      "Coppia di altoparlanti smart Sonos One seconda generazione, con Alexa integrato. Suono stereo eccellente per salotto o camera. Venduti insieme con scatole e cavi originali, funzionamento perfetto.",
    price: 260,
    category: "elettronica",
    subcategory: "tv-audio",
    condition: "come-nuovo",
    canton: "GE",
    city: "Ginevra",
    owner: "giulia",
  },
  {
    title: "Canon EOS R10 + obiettivo 18-150mm",
    description:
      "Fotocamera mirrorless Canon EOS R10 con obiettivo RF-S 18-150mm f/3.5-6.3. Circa 4'000 scatti effettuati, sensore pulito, nessun difetto. Ideale per chi vuole passare al mirrorless con un kit completo e versatile.",
    price: 1050,
    category: "elettronica",
    subcategory: "foto-video",
    condition: "come-nuovo",
    canton: "TI",
    city: "Locarno",
  },
  {
    title: "Drone DJI Mini 3 Pro con 3 batterie",
    description:
      "DJI Mini 3 Pro, drone sotto i 249g quindi con normative semplificate. Venduto con 3 batterie, caricatore multiplo, custodia da trasporto e set di eliche di ricambio. Video 4K stabilizzatissimo, usato per una decina di voli.",
    price: 680,
    category: "elettronica",
    subcategory: "foto-video",
    condition: "come-nuovo",
    canton: "VD",
    city: "Nyon",
  },
  {
    title: "PlayStation 5 (modello Slim) + 2 controller",
    description:
      "Console PlayStation 5 Slim con lettore disco, venduta con due controller DualSense (bianco e nero) e tre giochi: Spider-Man 2, FIFA 24, God of War Ragnarök. Tutto originale, scatole incluse.",
    price: 420,
    category: "elettronica",
    subcategory: "console-videogiochi",
    condition: "come-nuovo",
    canton: "ZH",
    city: "Winterthur",
  },
  {
    title: "Nintendo Switch OLED bianca + custodia",
    description:
      "Nintendo Switch modello OLED, colore bianco, schermo perfetto senza burn-in. Venduta con custodia rigida, protezione schermo già applicata e il gioco Mario Kart 8 Deluxe.",
    price: 260,
    category: "elettronica",
    subcategory: "console-videogiochi",
    condition: "usato",
    canton: "FR",
    city: "Friburgo",
  },
  {
    title: "Lavatrice Bosch Serie 6, 8kg, classe A",
    description:
      "Lavatrice Bosch Serie 6 da 8kg, classe energetica A, silenziosissima grazie al motore EcoSilence Drive. Funziona perfettamente, venduta per ristrutturazione cucina. Ritiro a Bellinzona, disponibile aiuto per il carico.",
    price: 320,
    category: "elettronica",
    subcategory: "elettrodomestici",
    condition: "usato",
    canton: "TI",
    city: "Bellinzona",
  },

  // ---------- Casa & Giardino ----------
  {
    title: "Divano 3 posti grigio da regalare",
    description:
      "Regalo divano 3 posti in tessuto grigio, comodo e in buono stato. Da ritirare sul posto entro fine mese, piano terra.",
    price: 0,
    category: "casa-giardino",
    subcategory: "mobili",
    condition: "usato",
    canton: "TI",
    city: "Bellinzona",
  },
  {
    title: "Tavolo in legno massiccio 180x90 con 6 sedie",
    description:
      "Tavolo da pranzo in legno di rovere massiccio, 180x90 cm, venduto con 6 sedie coordinate. Qualche segno di utilizzo che si può levigare, struttura solidissima. Ideale per famiglie numerose.",
    price: 450,
    category: "casa-giardino",
    subcategory: "mobili",
    condition: "usato",
    canton: "TI",
    city: "Lugano",
  },
  {
    title: "Libreria scandinava bianca 5 ripiani",
    description:
      "Libreria in stile scandinavo, colore bianco opaco, 5 ripiani regolabili in altezza. Facile da smontare per il trasporto, istruzioni di montaggio incluse. Nessun graffio visibile.",
    price: 95,
    category: "casa-giardino",
    subcategory: "arredamento-decorazione",
    condition: "come-nuovo",
    canton: "VD",
    city: "Losanna",
    owner: "giulia",
  },
  {
    title: "Tappeto persiano annodato a mano 200x300",
    description:
      "Tappeto persiano originale, annodato a mano, motivo classico su fondo bordeaux, dimensioni 200x300 cm. Acquistato in Iran, in ottime condizioni, lavato professionalmente un anno fa.",
    price: 780,
    category: "casa-giardino",
    subcategory: "arredamento-decorazione",
    condition: "usato",
    canton: "GE",
    city: "Ginevra",
    owner: "marco",
  },
  {
    title: "Tosaerba a benzina Honda autosemovente",
    description:
      "Tosaerba Honda a benzina, trazione autosemovente, larghezza di taglio 46cm, sacco raccoglierba incluso. Motore revisionato quest'anno, parte sempre al primo colpo. Ideale per giardini medio-grandi.",
    price: 340,
    category: "casa-giardino",
    subcategory: "giardino-balcone",
    condition: "usato",
    canton: "BE",
    city: "Thun",
  },
  {
    title: "Gazebo da giardino 3x4m con teli laterali",
    description:
      "Gazebo pieghevole 3x4 metri, struttura in alluminio robusto, venduto con teli laterali removibili e borsa da trasporto. Montato solo per due eventi, praticamente nuovo.",
    price: 220,
    category: "casa-giardino",
    subcategory: "giardino-balcone",
    condition: "come-nuovo",
    canton: "TI",
    city: "Mendrisio",
  },
  {
    title: "Set pentole Le Creuset in ghisa, 3 pezzi",
    description:
      "Set di 3 pentole Le Creuset in ghisa smaltata colore blu, comprende casseruola ovale, tegame basso e padella grill. Usate con cura, nessuna scheggiatura sullo smalto.",
    price: 320,
    category: "casa-giardino",
    subcategory: "cucina-casalinghi",
    condition: "usato",
    canton: "ZH",
    city: "Zurigo",
    owner: "giulia",
  },
  {
    title: "Macchina da caffè De'Longhi automatica",
    description:
      "Macchina da caffè automatica De'Longhi con macinacaffè integrato e cappuccinatore. Decalcificata regolarmente, funziona perfettamente. Venduta per passaggio a moka tradizionale.",
    price: 280,
    category: "casa-giardino",
    subcategory: "cucina-casalinghi",
    condition: "usato",
    canton: "TI",
    city: "Lugano",
  },
  {
    title: "Trapano avvitatore Bosch Professional 18V",
    description:
      "Trapano avvitatore a batteria Bosch Professional 18V, venduto con due batterie, caricatore e valigetta rigida. Usato per lavori occasionali in casa, in perfette condizioni.",
    price: 110,
    category: "casa-giardino",
    subcategory: "bricolage-utensili",
    condition: "usato",
    canton: "AG",
    city: "Baden",
  },

  // ---------- Abbigliamento & Accessori ----------
  {
    title: "Giacca in pelle Zara donna taglia M",
    description:
      "Giacca in vera pelle nera, marca Zara, taglia M, indossata pochissime volte. Foderata internamente, cerniere funzionanti, nessun segno di usura.",
    price: 65,
    category: "abbigliamento",
    subcategory: "donna",
    condition: "come-nuovo",
    canton: "TI",
    city: "Lugano",
    owner: "giulia",
  },
  {
    title: "Piumino invernale The North Face uomo XL",
    description:
      "Piumino invernale The North Face, modello 700 fill, taglia XL, colore blu navy. Perfetto per l'inverno svizzero, tenuto in ottimo stato, lavato in lavanderia specializzata.",
    price: 140,
    category: "abbigliamento",
    subcategory: "uomo",
    condition: "usato",
    canton: "GR",
    city: "Coira",
  },
  {
    title: "Lotto abbigliamento bambino 8 anni, 15 capi",
    description:
      "Lotto di 15 capi per bambino/a di circa 8 anni: magliette, felpe, pantaloni, tutti in buono stato e lavati. Marche miste (H&M, Zara Kids). Ideale per rinnovare il guardaroba risparmiando.",
    price: 40,
    category: "abbigliamento",
    subcategory: "abbigliamento-bambini",
    condition: "usato",
    canton: "VD",
    city: "Losanna",
  },
  {
    title: "Sneakers Nike Air Max 90 numero 42, nuove",
    description:
      "Nike Air Max 90 colore bianco/grigio, numero 42, mai indossate (comprate di taglia sbagliata). Scatola originale inclusa, scontrino disponibile.",
    price: 95,
    category: "abbigliamento",
    subcategory: "scarpe",
    condition: "nuovo",
    canton: "ZH",
    city: "Zurigo",
  },
  {
    title: "Borsa Michael Kors originale, pelle marrone",
    description:
      "Borsa a tracolla Michael Kors in pelle marrone, modello medio, con certificato di autenticità e dust bag originale. Usata con cura, angoli in ottimo stato.",
    price: 150,
    category: "abbigliamento",
    subcategory: "borse-accessori",
    condition: "usato",
    canton: "GE",
    city: "Ginevra",
    owner: "giulia",
  },
  {
    title: "Orologio Tissot PRX automatico",
    description:
      "Tissot PRX Powermatic 80, quadrante blu, cinturino in acciaio. Acquistato un anno fa, revisionato mai necessario, funziona alla perfezione. Venduto con scatola e garanzia originale ancora valida.",
    price: 480,
    category: "abbigliamento",
    subcategory: "orologi-gioielli",
    condition: "come-nuovo",
    canton: "TI",
    city: "Lugano",
    owner: "marco",
  },

  // ---------- Sport & Tempo libero ----------
  {
    title: "Bicicletta da corsa carbonio taglia M",
    description:
      "Vendo bici da corsa in carbonio, taglia M, gruppo Shimano 105. Usata due stagioni, sempre tenuta in garage. Tagliando appena fatto.",
    price: 850,
    category: "sport-tempo-libero",
    subcategory: "biciclette",
    condition: "usato",
    canton: "TI",
    city: "Lugano",
  },
  {
    title: "E-bike Cube Touring Hybrid 500Wh",
    description:
      "E-bike da trekking Cube con motore Bosch Performance Line e batteria 500Wh (autonomia fino a 100km). Cambio Shimano Deore a 10 velocità, parafanghi e portapacchi inclusi. Perfetta per pendolarismo o gite lunghe.",
    price: 1650,
    category: "sport-tempo-libero",
    subcategory: "biciclette",
    condition: "usato",
    canton: "BE",
    city: "Berna",
    owner: "marco",
  },
  {
    title: "Panca pesi regolabile + bilanciere 80kg",
    description:
      "Panca pesi pieghevole regolabile su più angolazioni, venduta con bilanciere olimpico e dischi in ghisa per un totale di 80kg. Ideale per allenarsi in garage o cantina.",
    price: 210,
    category: "sport-tempo-libero",
    subcategory: "fitness",
    condition: "usato",
    canton: "AG",
    city: "Aarau",
  },
  {
    title: "Tapis roulant pieghevole NordicTrack",
    description:
      "Tapis roulant NordicTrack pieghevole, velocità fino a 18 km/h, inclinazione automatica, programmi preimpostati. Poco ingombrante da chiuso, perfetto per appartamenti.",
    price: 380,
    category: "sport-tempo-libero",
    subcategory: "fitness",
    condition: "usato",
    canton: "VD",
    city: "Losanna",
  },
  {
    title: "Sci Salomon 170cm con attacchi Marker",
    description:
      "Sci Salomon all-mountain 170cm, con attacchi Marker già regolati. Lamine appena affilate, soletta in ottimo stato. Venduti con borsa da trasporto imbottita.",
    price: 260,
    category: "sport-tempo-libero",
    subcategory: "sport-invernali",
    condition: "usato",
    canton: "VS",
    city: "Sion",
  },
  {
    title: "Scarponi da sci Rossignol numero 27",
    description:
      "Scarponi da sci Rossignol taglia 27 (mondopoint), flex 90, usati una sola stagione. Chiusure micrometriche perfettamente funzionanti, imbottitura ancora comoda.",
    price: 130,
    category: "sport-tempo-libero",
    subcategory: "sport-invernali",
    condition: "usato",
    canton: "GR",
    city: "Davos",
  },
  {
    title: "Muta da sub 5mm taglia L, completa",
    description:
      "Muta subacquea 5mm semi-secca, taglia L, con cappuccio integrato. Usata per immersioni nei laghi svizzeri, nessuna lacerazione, cerniera funzionante al 100%.",
    price: 150,
    category: "sport-tempo-libero",
    subcategory: "sport-acquatici",
    condition: "usato",
    canton: "TI",
    city: "Locarno",
  },
  {
    title: "Tavola SUP gonfiabile 10'6\" con accessori",
    description:
      "Tavola da paddle SUP gonfiabile, lunghezza 10'6\", venduta con pompa a doppia azione, pagaia regolabile, pinna removibile e zaino da trasporto. Usata una decina di volte sul lago di Zurigo.",
    price: 320,
    category: "sport-tempo-libero",
    subcategory: "sport-acquatici",
    condition: "come-nuovo",
    canton: "ZH",
    city: "Zurigo",
  },
  {
    title: "Tenda da campeggio 4 posti, impermeabile",
    description:
      "Tenda Quechua 4 posti, doppio telo impermeabile fino a 2000mm, montaggio rapido in meno di 5 minuti. Usata per tre weekend, nessuna infiltrazione. Venduta con borsa e picchetti extra.",
    price: 90,
    category: "sport-tempo-libero",
    subcategory: "campeggio-outdoor",
    condition: "usato",
    canton: "FR",
    city: "Friburgo",
  },
  {
    title: "Zaino da trekking Osprey 65L",
    description:
      "Zaino da trekking Osprey 65 litri, schienale regolabile in altezza, copertura antipioggia integrata. Usato per un trekking di due settimane, in ottimo stato generale.",
    price: 120,
    category: "sport-tempo-libero",
    subcategory: "campeggio-outdoor",
    condition: "usato",
    canton: "VS",
    city: "Martigny",
  },

  // ---------- Bambini & Neonati ----------
  {
    title: "Seggiolino auto bimbo 9-36 kg",
    description:
      "Seggiolino auto gruppo 1/2/3 (9-36 kg), mai incidentato, lavabile. Usato dal secondo figlio, in buone condizioni generali.",
    price: 45,
    category: "bambini",
    subcategory: "passeggini-seggiolini",
    condition: "usato",
    canton: "GE",
    city: "Ginevra",
  },
  {
    title: "Passeggino Bugaboo Fox 3 completo",
    description:
      "Passeggino Bugaboo Fox 3 con navicella, ovetto auto compatibile e parapioggia. Ruote tutto-terreno, cappottina UPF 50+. Usato circa un anno, sempre tenuto con cura, igienizzato.",
    price: 680,
    category: "bambini",
    subcategory: "passeggini-seggiolini",
    condition: "usato",
    canton: "VD",
    city: "Losanna",
    owner: "giulia",
  },
  {
    title: "Lego Technic Bugatti Chiron completo",
    description:
      "Set Lego Technic Bugatti Chiron (42083), montato una sola volta e poi smontato per la vendita. Tutti i pezzi presenti, scatola e istruzioni incluse. Nessun pezzo mancante verificato.",
    price: 250,
    category: "bambini",
    subcategory: "giocattoli",
    condition: "come-nuovo",
    canton: "TI",
    city: "Lugano",
  },
  {
    title: "Cucina giocattolo in legno con accessori",
    description:
      "Cucina giocattolo in legno naturale, con fornelli, lavello e forno finti, venduta con set di pentolini e finti alimenti in legno. Perfetta per il gioco simbolico dei più piccoli.",
    price: 75,
    category: "bambini",
    subcategory: "giocattoli",
    condition: "usato",
    canton: "BE",
    city: "Berna",
  },
  {
    title: "Set body neonato 0-3 mesi, 10 pezzi",
    description:
      "Set di 10 body neonato taglia 0-3 mesi, cotone biologico, marche Petit Bateau e H&M. Lavati con detersivo neutro, nessuna macchia, praticamente come nuovi.",
    price: 35,
    category: "bambini",
    subcategory: "abbigliamento-neonato",
    condition: "come-nuovo",
    canton: "ZH",
    city: "Zurigo",
    owner: "giulia",
  },
  {
    title: "Culla in legno naturale con materasso",
    description:
      "Culla per neonato in legno di faggio naturale, sponda regolabile in altezza, venduta con materasso ortopedico. Usata per un solo bambino, smontabile facilmente per il trasporto.",
    price: 120,
    category: "bambini",
    subcategory: "mobili-bambini",
    condition: "usato",
    canton: "SG",
    city: "San Gallo",
  },

  // ---------- Animali ----------
  {
    title: "Cuccia per cane taglia grande, imbottita",
    description:
      "Cuccia rialzata per cane taglia grande (fino a 40kg), struttura in legno resistente, cuscino removibile e lavabile. Usata da un solo cane in casa non fumatori, in ottimo stato.",
    price: 60,
    category: "animali",
    subcategory: "cani",
    condition: "usato",
    canton: "TI",
    city: "Bellinzona",
  },
  {
    title: "Guinzaglio e pettorina anti-trazione taglia M",
    description:
      "Set guinzaglio regolabile e pettorina anti-trazione taglia M, marca Julius-K9, colore rosso. Usati pochi mesi, in ottime condizioni, ideali per cani che tirano al guinzaglio.",
    price: 35,
    category: "animali",
    subcategory: "cani",
    condition: "usato",
    canton: "VD",
    city: "Nyon",
  },
  {
    title: "Tiragraffi torre per gatti, 150cm",
    description:
      "Tiragraffi a torre alto 150cm, con più piattaforme, tunnel e giochini pendenti. I miei gatti lo hanno usato poco perché preferiscono un altro modello, quindi è quasi come nuovo.",
    price: 55,
    category: "animali",
    subcategory: "gatti",
    condition: "come-nuovo",
    canton: "GE",
    city: "Ginevra",
  },
  {
    title: "Trasportino rigido per gatto, taglia M",
    description:
      "Trasportino rigido omologato per il trasporto in auto e dal veterinario, apertura frontale e superiore, facile da pulire. Usato raramente, praticamente nuovo.",
    price: 30,
    category: "animali",
    subcategory: "gatti",
    condition: "usato",
    canton: "TI",
    city: "Lugano",
  },
  {
    title: "Gabbia per criceti/roditori XL con accessori",
    description:
      "Gabbia XL per criceti o piccoli roditori, su due piani con ruota, tubi e nascondigli. Venduta perché il nostro criceto ci ha lasciati. Pulita e disinfettata.",
    price: 40,
    category: "animali",
    subcategory: "altri-animali",
    condition: "usato",
    canton: "BE",
    city: "Berna",
  },
  {
    title: "Acquario 100L completo con filtro e luce LED",
    description:
      "Acquario 100 litri con mobile in legno, filtro esterno, riscaldatore e illuminazione LED programmabile. Venduto svuotato e pulito, ideale per iniziare l'acquariofilia.",
    price: 220,
    category: "animali",
    subcategory: "altri-animali",
    condition: "usato",
    canton: "ZH",
    city: "Winterthur",
  },
  {
    title: "Scorta crocchette cane adulto 15kg, sacco integro",
    description:
      "Sacco da 15kg di crocchette premium per cane adulto taglia media, mai aperto, acquistato in eccesso. Data di scadenza tra oltre un anno.",
    price: 45,
    category: "animali",
    subcategory: "mangimi-accessori",
    condition: "nuovo",
    canton: "TI",
    city: "Chiasso",
  },

  // ---------- Musica, Film & Libri ----------
  {
    title: "Collezione completa Harry Potter, edizione italiana",
    description:
      "Tutti e 7 i libri di Harry Potter in italiano, copertina rigida, edizione Salani. Ottimo stato di conservazione, nessuna pagina strappata o scritte all'interno.",
    price: 55,
    category: "musica-film-libri",
    subcategory: "libri",
    condition: "usato",
    canton: "TI",
    city: "Lugano",
  },
  {
    title: "Libri universitari ingegneria, lotto da 8",
    description:
      "Lotto di 8 libri universitari per ingegneria meccanica: analisi matematica, fisica, meccanica razionale. Alcuni con sottolineature a matita, contenuto tutto leggibile. Risparmio notevole rispetto al prezzo di listino.",
    price: 90,
    category: "musica-film-libri",
    subcategory: "libri",
    condition: "usato",
    canton: "VD",
    city: "Losanna",
  },
  {
    title: "Collezione vinili The Beatles, 6 LP originali",
    description:
      "Sei LP originali dei Beatles in vinile, anni '60-'70, custodie con normale segno del tempo ma dischi in buone condizioni di ascolto. Vendo l'intera collezione del padre, non separatamente.",
    price: 320,
    category: "musica-film-libri",
    subcategory: "musica-cd-vinili",
    condition: "usato",
    canton: "BE",
    city: "Berna",
    owner: "marco",
  },
  {
    title: "Cofanetto DVD Game of Thrones stagioni 1-8",
    description:
      "Cofanetto completo con tutte le 8 stagioni di Game of Thrones in DVD, versione italiana con sottotitoli. Dischi tutti funzionanti, custodie complete.",
    price: 45,
    category: "musica-film-libri",
    subcategory: "film-serie-tv",
    condition: "usato",
    canton: "TI",
    city: "Mendrisio",
  },
  {
    title: "Chitarra elettrica Fender Stratocaster Mexico",
    description:
      "Fender Stratocaster Player Series, prodotta in Messico, colore sunburst. Corde cambiate di recente, action regolata da un liutaio. Venduta con custodia morbida originale.",
    price: 620,
    category: "musica-film-libri",
    subcategory: "strumenti-musicali",
    condition: "usato",
    canton: "GE",
    city: "Ginevra",
    owner: "marco",
  },
  {
    title: "Pianoforte digitale Yamaha P-125 con stand",
    description:
      "Pianoforte digitale Yamaha P-125, 88 tasti pesati con meccanica GHS, venduto con stand a X, pedale sustain e leggio. Suono di gran coda campionato, perfetto per lo studio.",
    price: 550,
    category: "musica-film-libri",
    subcategory: "strumenti-musicali",
    condition: "come-nuovo",
    canton: "ZH",
    city: "Zurigo",
  },

  // ---------- Collezionismo & Antiquariato ----------
  {
    title: "Collezione francobolli svizzeri 1950-1980",
    description:
      "Collezione di francobolli svizzeri dal 1950 al 1980 in tre album. Prezzo da discutere dopo visione, vendo per motivi di spazio.",
    price: null,
    category: "collezionismo",
    subcategory: "francobolli",
    condition: "usato",
    canton: "BE",
    city: "Berna",
  },
  {
    title: "Monete d'argento 5 franchi svizzeri, lotto 20 pezzi",
    description:
      "Lotto di 20 monete da 5 franchi svizzeri in argento, anni vari dal 1930 al 1967. Buone condizioni generali, ideali per collezionisti o come bene rifugio.",
    price: 380,
    category: "collezionismo",
    subcategory: "monete",
    condition: "usato",
    canton: "TI",
    city: "Lugano",
    owner: "marco",
  },
  {
    title: "Orologio a pendolo antico funzionante, primi '900",
    description:
      "Orologio a pendolo da parete, primi anni del '900, cassa in legno intagliato. Meccanismo a carica manuale funzionante e regolare, restaurato da un orologiaio dieci anni fa.",
    price: 280,
    category: "collezionismo",
    subcategory: "antiquariato",
    condition: "usato",
    canton: "VD",
    city: "Losanna",
  },
  {
    title: "Modellino auto Ferrari F40 scala 1:18",
    description:
      "Modellino da collezione Ferrari F40 in scala 1:18, marca Bburago, diecast metallico con dettagli apribili (cofano, porte, bagagliaio). Mai tolto dalla teca espositiva.",
    price: 65,
    category: "collezionismo",
    subcategory: "modellismo",
    condition: "come-nuovo",
    canton: "TI",
    city: "Lugano",
  },
  {
    title: "Dipinto a olio su tela, paesaggio alpino, firmato",
    description:
      "Dipinto a olio su tela raffigurante un paesaggio alpino, firmato in basso a destra da artista locale, anni '80. Cornice in legno dorato inclusa, dimensioni 60x80cm.",
    price: 190,
    category: "collezionismo",
    subcategory: "arte",
    condition: "usato",
    canton: "VS",
    city: "Sion",
  },

  // ---------- Informatica ----------
  {
    title: "MacBook Pro 14\" M2 Pro 16GB/512GB",
    description:
      "MacBook Pro 14 pollici con chip M2 Pro, 16GB RAM, 512GB SSD, colore grigio siderale. Circa 120 cicli di carica sulla batteria, schermo Liquid Retina XDR perfetto. Venduto con caricatore originale.",
    price: 1750,
    category: "informatica",
    subcategory: "laptop",
    condition: "come-nuovo",
    canton: "ZH",
    city: "Zurigo",
  },
  {
    title: "Dell XPS 13, i7, 16GB RAM, 512GB SSD",
    description:
      "Dell XPS 13, processore Intel i7 di undicesima generazione, 16GB RAM, SSD 512GB, schermo InfinityEdge FHD+. Usato per ufficio, tastiera e touchpad perfetti, batteria ancora ottima.",
    price: 720,
    category: "informatica",
    subcategory: "laptop",
    condition: "usato",
    canton: "VD",
    city: "Losanna",
  },
  {
    title: "PC gaming assemblato RTX 4070, Ryzen 7",
    description:
      "PC fisso gaming assemblato: AMD Ryzen 7 5800X, RTX 4070 12GB, 32GB RAM DDR4, SSD NVMe 1TB, case con RGB e ventole silenziose. Gestisce qualsiasi gioco recente a 1440p ultra dettagli.",
    price: 1350,
    category: "informatica",
    subcategory: "desktop",
    condition: "usato",
    canton: "TI",
    city: "Lugano",
  },
  {
    title: "Scheda video RTX 3080 10GB",
    description:
      "Scheda grafica NVIDIA RTX 3080 10GB, usata per gaming (non mining), sempre in ambiente ventilato e pulito. Funziona perfettamente, venduta per upgrade a RTX 4080.",
    price: 380,
    category: "informatica",
    subcategory: "componenti",
    condition: "usato",
    canton: "AG",
    city: "Aarau",
  },
  {
    title: "Kit RAM Corsair Vengeance 32GB DDR4 3600MHz",
    description:
      "Kit di due moduli RAM Corsair Vengeance LPX, totale 32GB (2x16GB), frequenza 3600MHz, dissipatori bassi compatibili con la maggior parte dei case. Mai avuto problemi di stabilità.",
    price: 75,
    category: "informatica",
    subcategory: "componenti",
    condition: "usato",
    canton: "TI",
    city: "Bellinzona",
  },
  {
    title: "Router Wi-Fi 6 ASUS RT-AX88U",
    description:
      "Router ASUS RT-AX88U con Wi-Fi 6, 8 porte Gigabit, ottima copertura anche in case grandi. Firmware sempre aggiornato, configurato per il momento con VPN e parental control.",
    price: 140,
    category: "informatica",
    subcategory: "periferiche-reti",
    condition: "usato",
    canton: "BE",
    city: "Berna",
  },
  {
    title: "Tastiera meccanica Keychron K8 switch marroni",
    description:
      "Tastiera meccanica wireless Keychron K8, switch Gateron marroni (tattili), layout ISO con caratteri italiani. Retroilluminazione RGB, batteria che dura circa una settimana.",
    price: 65,
    category: "informatica",
    subcategory: "periferiche-reti",
    condition: "usato",
    canton: "GE",
    city: "Ginevra",
  },
  {
    title: "Licenza Microsoft Office 2021 Pro Plus, originale",
    description:
      "Licenza originale Microsoft Office 2021 Professional Plus per un PC, include Word, Excel, PowerPoint, Outlook e Access. Chiave mai attivata, fattura d'acquisto disponibile.",
    price: 40,
    category: "informatica",
    subcategory: "software",
    condition: "nuovo",
    canton: "TI",
    city: "Lugano",
  },

  // ---------- Immobili ----------
  {
    title: "Appartamento 3.5 locali con vista lago, Lugano",
    description:
      "Splendido 3.5 locali di 95m² al terzo piano con ascensore, vista parziale sul lago di Lugano. Ristrutturato nel 2020, cucina abitabile, due balconi. Include posto auto coperto e cantina.",
    price: 690000,
    category: "immobili",
    subcategory: "appartamenti-vendita",
    condition: "come-nuovo",
    canton: "TI",
    city: "Lugano",
    owner: "marco",
  },
  {
    title: "Attico 4.5 locali con terrazza, Bellinzona",
    description:
      "Attico di 4.5 locali all'ultimo piano con ampia terrazza abitabile di 40m². Doppi servizi, cucina a vista, riscaldamento a pompa di calore. Immobile signorile in piccola palazzina.",
    price: 850000,
    category: "immobili",
    subcategory: "appartamenti-vendita",
    condition: "come-nuovo",
    canton: "TI",
    city: "Bellinzona",
    owner: "marco",
  },
  {
    title: "Appartamento 2 locali in affitto, centro Zurigo",
    description:
      "Appartamento di 2 locali (45m²) in affitto, zona centrale ben servita dai mezzi pubblici. Cucina attrezzata, bagno con doccia, cantina inclusa. Disponibile dal mese prossimo, contratto annuale rinnovabile.",
    price: 1850,
    category: "immobili",
    subcategory: "appartamenti-affitto",
    condition: "usato",
    canton: "ZH",
    city: "Zurigo",
    owner: "marco",
  },
  {
    title: "Studio 1 locale ammobiliato in affitto, Ginevra",
    description:
      "Studio ammobiliato di circa 28m², ideale per studenti o professionisti singoli. Include letto, scrivania, angolo cottura attrezzato. Spese incluse nell'affitto, zona ben collegata al centro.",
    price: 1400,
    category: "immobili",
    subcategory: "appartamenti-affitto",
    condition: "usato",
    canton: "GE",
    city: "Ginevra",
    owner: "marco",
  },
  {
    title: "Casa indipendente con giardino, Mendrisiotto",
    description:
      "Casa indipendente su tre livelli con giardino privato di 500m², 5.5 locali, doppio garage. Zona tranquilla e residenziale, a 10 minuti dal confine e dagli outlet. Impianto fotovoltaico installato nel 2022.",
    price: 980000,
    category: "immobili",
    subcategory: "case",
    condition: "usato",
    canton: "TI",
    city: "Mendrisio",
    owner: "marco",
  },
  {
    title: "Ufficio open space 120m², zona Nyon",
    description:
      "Locale ufficio open space di 120m², divisibile in più stanze con pareti mobili, due posti auto inclusi. Ottima visibilità su strada di passaggio, adatto anche a studio professionale.",
    price: 2600,
    category: "immobili",
    subcategory: "uffici-locali",
    condition: "usato",
    canton: "VD",
    city: "Nyon",
    owner: "marco",
  },
  {
    title: "Posto auto coperto in autorimessa, Lugano centro",
    description:
      "Posto auto coperto in autorimessa sotterranea, accesso con telecomando, videosorveglianza 24/24. Comodo per chi lavora o abita in centro a Lugano e non trova parcheggio.",
    price: 180,
    category: "immobili",
    subcategory: "garage-posti-auto",
    condition: "usato",
    canton: "TI",
    city: "Lugano",
    owner: "marco",
  },
  {
    title: "Terreno edificabile 800m², vista Alpi Vallesane",
    description:
      "Terreno edificabile pianeggiante di 800m² in zona residenziale, indice di sfruttamento 0.4, tutti gli allacciamenti già presenti al confine del lotto. Vista panoramica sulle Alpi.",
    price: 320000,
    category: "immobili",
    subcategory: "terreni",
    condition: "nuovo",
    canton: "VS",
    city: "Sion",
    owner: "marco",
  },

  // ---------- Lavoro & Servizi ----------
  {
    title: "Cercasi cameriere/a part-time, ristorante a Lugano",
    description:
      "Ristorante nel centro di Lugano cerca cameriere/a part-time per weekend e serate, esperienza pregressa gradita ma non indispensabile. Buona conoscenza di italiano e inglese, disponibilità immediata.",
    price: null,
    category: "lavoro-servizi",
    subcategory: "offerte-lavoro",
    condition: "nuovo",
    canton: "TI",
    city: "Lugano",
    owner: "marco",
  },
  {
    title: "Offresi giardiniere per manutenzione settimanale",
    description:
      "Giardiniere con dieci anni di esperienza offre servizio di manutenzione settimanale o quindicinale per giardini privati: taglio erba, potatura siepi, cura aiuole. Attrezzatura propria, preventivo gratuito.",
    price: null,
    category: "lavoro-servizi",
    subcategory: "servizi-casa",
    condition: "usato",
    canton: "TI",
    city: "Bellinzona",
  },
  {
    title: "Servizio di pulizie domestiche e uffici",
    description:
      "Offro servizio di pulizie professionali per abitazioni e piccoli uffici, disponibile anche per pulizie di fine cantiere. Referenze disponibili, prodotti ecologici a richiesta. Preventivi personalizzati senza impegno.",
    price: null,
    category: "lavoro-servizi",
    subcategory: "servizi-casa",
    condition: "usato",
    canton: "ZH",
    city: "Zurigo",
  },
  {
    title: "Ripetizioni di matematica e fisica, liceo e SM",
    description:
      "Ingegnere offre ripetizioni private di matematica e fisica per studenti di scuola media e liceo. Lezioni a domicilio o online, materiale didattico personalizzato, prima lezione di prova a tariffa ridotta.",
    price: 40,
    category: "lavoro-servizi",
    subcategory: "lezioni-private",
    condition: "nuovo",
    canton: "VD",
    city: "Losanna",
  },
  {
    title: "Lezioni di chitarra per principianti e intermedi",
    description:
      "Musicista diplomato offre lezioni di chitarra acustica ed elettrica per tutti i livelli, dai principianti assoluti a chi vuole perfezionare la tecnica. Lezioni individuali a domicilio o presso il mio studio.",
    price: 45,
    category: "lavoro-servizi",
    subcategory: "lezioni-private",
    condition: "nuovo",
    canton: "GE",
    city: "Ginevra",
  },
  {
    title: "Trasloco con furgone e due persone",
    description:
      "Servizio di trasloco locale con furgone da 20m³ e due persone per il carico/scarico. Disponibile smontaggio e rimontaggio mobili su richiesta. Prezzo a forfait da concordare in base ai metri cubi.",
    price: null,
    category: "lavoro-servizi",
    subcategory: "traslochi",
    condition: "usato",
    canton: "TI",
    city: "Chiasso",
  },
  {
    title: "DJ per matrimoni, feste private ed eventi aziendali",
    description:
      "DJ con oltre 15 anni di esperienza in matrimoni ed eventi privati, impianto audio e luci professionale incluso nel prezzo. Repertorio personalizzabile su richiesta degli sposi. Disponibile in tutto il Ticino.",
    price: 800,
    category: "lavoro-servizi",
    subcategory: "eventi",
    condition: "nuovo",
    canton: "TI",
    city: "Lugano",
  },

  // ---------- Altro ----------
  {
    title: "Scatolone oggetti vari da svuota-cantina",
    description:
      "Scatolone con oggetti vari recuperati svuotando una cantina: utensili da cucina, cornici, piccoli elettrodomestici funzionanti. Prezzo simbolico, ideale per chi cerca l'affare o ama frugare.",
    price: 15,
    category: "altro",
    subcategory: "varie",
    condition: "usato",
    canton: "TI",
    city: "Bellinzona",
  },
  {
    title: "2 biglietti concerto Zurigo, posto numerato",
    description:
      "Vendo due biglietti per concerto all'Hallenstadion di Zurigo, posti numerati vicini, settore centrale. Impossibilitato a partecipare per sopraggiunto impegno di lavoro.",
    price: 160,
    category: "altro",
    subcategory: "biglietti",
    condition: "nuovo",
    canton: "ZH",
    city: "Zurigo",
  },
  {
    title: "Buono regalo Digitec Galaxus CHF 100",
    description:
      "Buono regalo Digitec Galaxus dal valore di CHF 100, ricevuto in dono ma non necessario. Codice digitale inviato dopo l'accordo, valido su tutto l'assortimento del sito.",
    price: 90,
    category: "altro",
    subcategory: "buoni-sconto",
    condition: "nuovo",
    canton: "BE",
    city: "Berna",
  },
];

async function main() {
  // Protezione: questo script crea account demo con password nota
  // ("password123") pubblicata anche nel README. Va eseguito SOLO su un
  // database di sviluppo/test, mai su quello di produzione: chiunque
  // potrebbe altrimenti accedere con quelle credenziali sul sito vero.
  if (process.env.ALLOW_SEED !== "true") {
    console.error(
      "[seed] Bloccato per sicurezza: questo script crea utenti demo con password nota (password123).\n" +
        "        Esegui SOLO su un database di sviluppo/test, mai in produzione.\n" +
        "        Se sei sicuro di voler procedere: ALLOW_SEED=true npm run db:seed"
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash("password123", 10);

  const demo = await db.user.upsert({
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

  const marco = await db.user.upsert({
    where: { email: "marco@example.com" },
    update: { emailVerified: new Date() },
    create: {
      email: "marco@example.com",
      name: "Marco Ferrari",
      passwordHash,
      phone: "+41 79 111 22 33",
      emailVerified: new Date(),
    },
  });

  const giulia = await db.user.upsert({
    where: { email: "giulia@example.com" },
    update: { emailVerified: new Date() },
    create: {
      email: "giulia@example.com",
      name: "Giulia Conti",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  const owners = { demo, anna, marco, giulia };

  let bikeListingId: string | null = null;
  for (const { owner, ...data } of listings) {
    const listing = await db.listing.create({
      data: { ...data, userId: owners[owner ?? "demo"].id },
    });
    if (data.title === "Bicicletta da corsa carbonio taglia M") {
      bikeListingId = listing.id;
    }
  }

  // Conversazione di esempio: Anna contatta l'Utente Demo per la bicicletta
  if (bikeListingId) {
    const conversation = await db.conversation.create({
      data: { listingId: bikeListingId, buyerId: anna.id },
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
          senderId: demo.id,
          body: "Ciao Anna, sì è disponibile! Sabato mattina va benissimo, ti scrivo l'indirizzo.",
          read: true,
        },
      ],
    });
  }

  console.log(
    `Seed completato: 4 utenti (demo@example.com, anna@example.com, marco@example.com, giulia@example.com — password: password123), ${listings.length} annunci su tutte le categorie e sottocategorie, una conversazione di esempio.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

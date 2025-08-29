// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// -------- helpers -------------------------------------------------------------

/** small pause; helps keep serverless pools happy */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** split an array into chunks of size n */
const chunk = (arr, n) => {
  const res = [];
  for (let i = 0; i < arr.length; i += n) res.push(arr.slice(i, i + n));
  return res;
};

/**
 * createMany in chunks to avoid timeouts / dropped connections
 * @param {Function} createManyFn - model.createMany
 * @param {Array} data - rows to insert
 * @param {number} size - chunk size
 * @param {string} label - for logs
 */
async function createManyChunked(createManyFn, data, size, label) {
  let total = 0;
  for (const [i, part] of chunk(data, size).entries()) {
    const { count } = await createManyFn({ data: part, skipDuplicates: true });
    total += count;
    // tiny delay helps Neon/Vercel PgBouncer
    await sleep(30);
  }

  return total;
}

/** Ensure address exists (there’s no unique constraint, so we do "find or create") */
async function ensureAddress({
  street,
  streetNumber,
  cityId,
  boxNumber = null,
  complement = null,
}) {
  const existing = await prisma.address.findFirst({
    where: { street, streetNumber, cityId, boxNumber, complement },
    select: { id: true },
  });
  if (existing) return existing;
  return prisma.address.create({
    data: { street, streetNumber, cityId, boxNumber, complement },
  });
}

/** Ensure agency exists (unique on [name, addressId]) */
async function ensureAgency({
  name,
  addressId,
  location,
  phoneNumber,
  email,
  capacity,
  availableSlots,
}) {
  const existing = await prisma.agency.findFirst({
    where: { name, addressId },
    select: { id: true },
  });
  if (existing) return existing;
  return prisma.agency.create({
    data: {
      name,
      addressId,
      location,
      phoneNumber,
      email,
      capacity,
      availableSlots,
    },
  });
}

/** Ensure singleton transport by number */
async function ensureTransport({
  number,
  baseWeight,
  currentWeight,
  baseVolume,
  currentVolume,
  isAvailable,
}) {
  const existing = await prisma.transport.findFirst({
    where: { number },
    select: { id: true },
  });
  if (existing) return existing;
  return prisma.transport.create({
    data: {
      number,
      baseWeight,
      currentWeight,
      baseVolume,
      currentVolume,
      isAvailable,
    },
  });
}

/** Ensure global tarifs (agencyId = null) exists once */
async function ensureGlobalTarifs({
  weightRate,
  volumeRate,
  baseRate,
  fixedRate,
}) {
  const existing = await prisma.tarifs.findFirst({
    where: { agencyId: null },
    select: { id: true },
  });
  if (existing) return existing;
  return prisma.tarifs.create({
    data: { agencyId: null, weightRate, volumeRate, baseRate, fixedRate },
  });
}

// -------- main ---------------------------------------------------------------

async function main() {
  // region countries + timezones + cities
  c;

  const dataFilePath = path.join(
    process.cwd(),
    "public/datas/countries+cities.json"
  );
  if (!fs.existsSync(dataFilePath)) {
    console.error("ERREUR: Le fichier countries+cities.json est introuvable.");
    process.exit(1);
  }

  const countriesData = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
  const allowedIso2 = new Set(["MA", "BE", "FR", "ES", "DE"]);
  const filteredCountriesData = countriesData.filter((c) =>
    allowedIso2.has(c.iso2)
  );

  // CHUNK SIZE: adjust if you still see P1017 (try 200–1000). 500 is a good default.
  const CHUNK = 500;

  for (const country of filteredCountriesData) {
    // Countries are few → upsert is fine here
    const createdCountry = await prisma.country.upsert({
      where: { iso2: country.iso2 },
      update: {},
      create: {
        name: country.name,
        iso2: country.iso2,
        iso3: country.iso3,
        phonecode: country.phonecode,
        capital: country.capital || null,
        currency: country.currency || null,
        latitude: country.latitude || null,
        longitude: country.longitude || null,
        emoji: country.emoji || null,
      },
    });

    // Timezones → createMany in chunks (unique on [zoneName, countryId])
    const tzRows = (country.timezones || []).map((tz) => ({
      countryId: createdCountry.id,
      zoneName: tz.zoneName,
      gmtOffset: tz.gmtOffset,
      abbreviation: tz.abbreviation,
    }));
    await createManyChunked(
      prisma.timezone.createMany,
      tzRows,
      CHUNK,
      `timezones for ${country.name}`
    );

    // Cities → createMany in chunks (unique on [name, countryId])
    const cityRows = (country.cities || []).map((ct) => ({
      name: ct.name,
      latitude: ct.latitude || null,
      longitude: ct.longitude || null,
      countryId: createdCountry.id,
    }));
    await createManyChunked(
      prisma.city.createMany,
      cityRows,
      CHUNK,
      `cities for ${country.name}`
    );
  }

  // endregion

  // region query required cities
  const findCityId = async (name, countryName) => {
    const city = await prisma.city.findFirst({
      where: { name, country: { name: countryName } },
      select: { id: true },
    });
    if (!city)
      throw new Error(
        `La ville ${name} n'a pas été trouvée pour le pays ${countryName}.`
      );
    return city.id;
  };

  const saidiaId = await findCityId("Saidia", "Morocco");
  const berkaneId = await findCityId("Berkane", "Morocco");
  const oujdaId = await findCityId("Oujda-Angad", "Morocco");
  const monsId = await findCityId("Mons", "Belgium");
  const frameriesId = await findCityId("Frameries", "Belgium");
  const charleroiId = await findCityId("Charleroi", "Belgium");
  const bruxellesId = await findCityId("Brussels", "Belgium");
  // endregion

  // region addresses (idempotent: find or create)
  const bruxellesAddress = await ensureAddress({
    street: "rue de Bruxelles",
    streetNumber: "1",
    cityId: bruxellesId,
  });
  const charleroiAddress = await ensureAddress({
    street: "rue de Charleroi",
    streetNumber: "1",
    cityId: charleroiId,
  });
  const frameriesAddress = await ensureAddress({
    street: "rue de Frameries",
    streetNumber: "1",
    cityId: frameriesId,
  });
  const monsAddress = await ensureAddress({
    street: "rue de Mons",
    streetNumber: "1",
    cityId: monsId,
  });
  const oujdaAddress = await ensureAddress({
    street: "rue de Oujda",
    streetNumber: "1",
    cityId: oujdaId,
  });
  const saidiaAddress = await ensureAddress({
    street: "rue de Saidia",
    streetNumber: "1",
    cityId: saidiaId,
  });
  const berkaneAddress = await ensureAddress({
    street: "rue de Berkane",
    streetNumber: "1",
    cityId: berkaneId,
  });

  // endregion

  // region agencies (idempotent on [name,addressId])
  await ensureAgency({
    name: "Agence de Frameries",
    location: "Frameries",
    phoneNumber: "+32495500000",
    email: "agence.de.frameries@gmail.com",
    capacity: 50,
    availableSlots: 40,
    addressId: frameriesAddress.id,
  });
  await ensureAgency({
    name: "Agence de Bruxelles",
    location: "Bruxelles",
    phoneNumber: "+32494400000",
    email: "agence.de.bruxelles@gmail.com",
    capacity: 100,
    availableSlots: 10,
    addressId: bruxellesAddress.id,
  });
  await ensureAgency({
    name: "Agence de Charleroi",
    location: "Charleroi",
    phoneNumber: "+32496600000",
    email: "agence.de.charleroi@gmail.com",
    capacity: 80,
    availableSlots: 15,
    addressId: charleroiAddress.id,
  });
  await ensureAgency({
    name: "Agence de Mons",
    location: "Mons",
    phoneNumber: "+32497700000",
    email: "agence.de.mons@gmail.com",
    capacity: 120,
    availableSlots: 20,
    addressId: monsAddress.id,
  });
  await ensureAgency({
    name: "Agence de Oujda",
    location: "Oujda",
    phoneNumber: "+21265500000",
    email: "agence.de.oujda@gmail.com",
    capacity: 100,
    availableSlots: 15,
    addressId: oujdaAddress.id,
  });
  await ensureAgency({
    name: "Agence de Saidia",
    location: "Saidia",
    phoneNumber: "+212693300000",
    email: "agence.de.saidia@gmail.com",
    capacity: 100,
    availableSlots: 15,
    addressId: saidiaAddress.id,
  });
  await ensureAgency({
    name: "Agence de Berkane",
    location: "Berkane",
    phoneNumber: "+21266600000",
    email: "agence.de.berkane@gmail.com",
    capacity: 100,
    availableSlots: 15,
    addressId: berkaneAddress.id,
  });
  // endregion

  // region transport (idempotent by number)
  await ensureTransport({
    number: "1111-111-11",
    isAvailable: true,
    currentWeight: 0,
    baseWeight: 15000.0,
    currentVolume: 0,
    baseVolume: 42000000.0,
  });
  // endregion

  // region global tarifs (singleton: agencyId = null)
  await ensureGlobalTarifs({
    weightRate: 1.6,
    volumeRate: 0,
    baseRate: 0,
    fixedRate: 15.0,
  });
  // endregion
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

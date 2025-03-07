// path: prisma/seed.js
import {PrismaClient} from "@prisma/client";
import fs from "fs";
// const path = require("path");
import path from "path";


const prisma = new PrismaClient();


async function main() {

    // region Countries and cities
    //    const countries = [
    //        {name: 'Belgique', countryCode: 'BE'},
    //        {name: 'France', countryCode: 'FR'},
    //        {name: 'Maroc', countryCode: 'MA'},
    //        {name: 'Espagne', countryCode: 'ES'}
    //    ];
    //
    //    for (const countryData of countries) {
    //        await prisma.country.upsert({
    //            where: {countryCode: countryData.countryCode},
    //            update: {},
    //            create: countryData
    //        });
    //    }
    //
    //    // Retrieve country records
    //    const belgique = await prisma.country.findFirst({where: {countryCode: 'BE'}});
    //    const france = await prisma.country.findFirst({where: {countryCode: 'FR'}});
    //    const maroc = await prisma.country.findFirst({where: {countryCode: 'MA'}});
    //    const espagne = await prisma.country.findFirst({where: {countryCode: 'ES'}});
    //
    //    console.log('🌍 Countries seeded.');
    //
    //    // region Cities
    //    const cities = [
    //        // Belgium
    //        {name: 'Bruxelles', cityCode: '1000', countryId: belgique.id},
    //        {name: 'Anvers', cityCode: '2000', countryId: belgique.id},
    //        {name: 'Gand', cityCode: '9000', countryId: belgique.id},
    //        {name: 'Charleroi', cityCode: '6000', countryId: belgique.id},
    //        {name: 'Liège', cityCode: '4000', countryId: belgique.id},
    //        {name: 'Bruges', cityCode: '8000', countryId: belgique.id},
    //        {name: 'Namur', cityCode: '5000', countryId: belgique.id},
    //        {name: 'Louvain', cityCode: '3000', countryId: belgique.id},
    //        {name: 'Mons', cityCode: '7000', countryId: belgique.id},
    //        {name: 'Frameries', cityCode: '7080', countryId: belgique.id},
    //
    //        // Morocco
    //        {name: 'Casablanca', cityCode: '20000', countryId: maroc.id},
    //        {name: 'Rabat', cityCode: '10000', countryId: maroc.id},
    //        {name: 'Fès', cityCode: '30000', countryId: maroc.id},
    //        {name: 'Marrakech', cityCode: '40000', countryId: maroc.id},
    //        {name: 'Tanger', cityCode: '90000', countryId: maroc.id},
    //        {name: 'Agadir', cityCode: '80000', countryId: maroc.id},
    //        {name: 'Nador', cityCode: '62000', countryId: maroc.id},
    //        {name: 'Oujda', cityCode: '60000', countryId: maroc.id},
    //        {name: 'Saidia', cityCode: '60600', countryId: maroc.id},
    //        {name: 'Berkane', cityCode: '63600', countryId: maroc.id},
    //
    //        // France
    //        {name: 'Paris', cityCode: '75000', countryId: france.id},
    //        {name: 'Marseille', cityCode: '13000', countryId: france.id},
    //        {name: 'Lyon', cityCode: '69000', countryId: france.id},
    //        {name: 'Toulouse', cityCode: '31000', countryId: france.id},
    //        {name: 'Nice', cityCode: '06000', countryId: france.id},
    //        {name: 'Nantes', cityCode: '44000', countryId: france.id},
    //        {name: 'Strasbourg', cityCode: '67000', countryId: france.id},
    //        {name: 'Montpellier', cityCode: '34000', countryId: france.id},
    //        {name: 'Bordeaux', cityCode: '33000', countryId: france.id},
    //        {name: 'Lille', cityCode: '59000', countryId: france.id},
    //
    //        // Spain
    //        {name: 'Madrid', cityCode: '28000', countryId: espagne.id},
    //        {name: 'Barcelona', cityCode: '08000', countryId: espagne.id},
    //        {name: 'Valencia', cityCode: '46000', countryId: espagne.id},
    //        {name: 'Seville', cityCode: '41000', countryId: espagne.id},
    //        {name: 'Zaragoza', cityCode: '50000', countryId: espagne.id},
    //        {name: 'Málaga', cityCode: '29000', countryId: espagne.id},
    //        {name: 'Murcia', cityCode: '30000', countryId: espagne.id},
    //        {name: 'Palma', cityCode: '07000', countryId: espagne.id},
    //        {name: 'Bilbao', cityCode: '48000', countryId: espagne.id},
    //        {name: 'Alicante', cityCode: '03000', countryId: espagne.id},
    //    ];
    //
    //    // Using the composite unique key: { name, countryId }
    //    for (const city of cities) {
    //        await prisma.city.upsert({
    //            where: {
    //                name_countryId: {
    //                    name: city.name,
    //                    countryId: city.countryId
    //                }
    //            },
    //            update: {},
    //            create: city
    //        });
    //    }
    //
    //    // Get city records for addresses (using findFirst with filters)
    //    const frameriesCity = await prisma.city.findFirst({
    //        where: {cityCode: '7080', countryId: belgique.id}
    //    });
    //    const monsCity = await prisma.city.findFirst({
    //        where: {cityCode: '7000', countryId: belgique.id}
    //    });
    //    const bruxellesCity = await prisma.city.findFirst({
    //        where: {cityCode: '1000', countryId: belgique.id}
    //    });
    //    const charleroiCity = await prisma.city.findFirst({
    //        where: {cityCode: '6000', countryId: belgique.id}
    //    });
    //
    //    // Morocco cities for addresses
    //    const saidiaCity = await prisma.city.findFirst({
    //        where: {cityCode: '60600', countryId: maroc.id}
    //    });
    //    const berkaneCity = await prisma.city.findFirst({
    //        where: {cityCode: '63600', countryId: maroc.id}
    //    });
    //    const oujdaCity = await prisma.city.findFirst({
    //        where: {cityCode: '60000', countryId: maroc.id}
    //    });
    //
    //    // Create Addresses
    //
    //    // Address: rue de Bruxelles
    //    const bruxellesAddress = await prisma.address.create({
    //        data: {
    //            street: 'rue de Bruxelles',
    //            number: '1',
    //            cityId: bruxellesCity.id,
    //            countryId: belgique.id,
    //            latitude: 50.8503,
    //            longitude: 4.3517,
    //        }
    //    });
    //
    //    // Address: rue de Charleroi
    //
    //    const charleroiAddress = await prisma.address.create({
    //        data: {
    //            street: 'rue de Charleroi',
    //            number: '1',
    //            cityId: charleroiCity.id,
    //            countryId: belgique.id,
    //            latitude: 50.4542,
    //            longitude: 3.9567,
    //        },
    //    });
    //
    //    // Address: rue de Frameries
    //    const frameriesAddress = await prisma.address.create({
    //        data: {
    //            street: 'rue de Frameries',
    //            number: '1',
    //            cityId: frameriesCity.id,
    //            countryId: belgique.id,
    //            latitude: 51.2194,
    //            longitude: 4.4025,
    //        }
    //    });
    //
    //    // Address : rue de Mons
    //    const monsAddress = await prisma.address.create({
    //        data: {
    //            street: 'rue de Mons',
    //            number: '1',
    //            cityId: monsCity.id,
    //            countryId: belgique.id,
    //            latitude: 50.4542,
    //            longitude: 3.9567,
    //        }
    //    });
    //
    //    // Address: rue de Oujda
    //    const oujdaAddress = await prisma.address.create({
    //        data: {
    //            street: 'rue de Oujda',
    //            number: '1',
    //            cityId: oujdaCity.id,
    //            countryId: maroc.id,
    //            latitude: 31.6328,
    //            longitude: 7.3883,
    //        }
    //    });
    //
    //    // Address: rue de Saidia
    //    const saidiaAddress = await prisma.address.create({
    //        data: {
    //            street: 'rue de Saidia',
    //            number: '1',
    //            cityId: saidiaCity.id,
    //            countryId: maroc.id,
    //            latitude: 33.5731,
    //            longitude: -7.5898,
    //        }
    //    });
    //
    //    // Address: rue de Berkane
    //    const berkaneAddress = await prisma.address.create({
    //        data: {
    //            street: 'rue de Berkane',
    //            number: '1',
    //            cityId: berkaneCity.id,
    //            countryId: maroc.id,
    //            latitude: 31.6295,
    //            longitude: -7.9811,
    //        }
    //    });
    //
    //    console.log('Addresses created');
    //endregion countries and cities section

//region insert countries, cities, and timezones
    console.log("🌍 Seeding countries, cities, and timezones...");

    // 📌 Vérifier si le fichier JSON existe
    const dataFilePath = path.join(process.cwd(), "public/datas/countries+cities.json");
    if (!fs.existsSync(dataFilePath)) {
        console.error("❌ ERREUR: Le fichier countries+cities.json est introuvable.");
        process.exit(1);
    }

    // 📌 Charger les données JSON
    const countriesData = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

    for (const country of countriesData) {
        // 📌 Insérer le pays
        const createdCountry = await prisma.country.upsert({
            where: {iso2: country.iso2},
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

        console.log(`✅ Country "${country.name}" added.`);

        // 📌 Ajouter les fuseaux horaires
        for (const timezone of country.timezones || []) {
            await prisma.timezone.upsert({
                where: {
                    zoneName_countryId: {
                        zoneName: timezone.zoneName,
                        countryId: createdCountry.id,
                    },
                },
                update: {},
                create: {
                    countryId: createdCountry.id,
                    zoneName: timezone.zoneName,
                    gmtOffset: timezone.gmtOffset,
                    abbreviation: timezone.abbreviation,
                },
            });

            console.log(`  🕒 Timezone "${timezone.zoneName}" added for ${country.name}.`);
        }

        // 📌 Ajouter les villes
        for (const city of country.cities || []) {
            await prisma.city.upsert({
                where: {name_countryId: {name: city.name, countryId: createdCountry.id}},
                update: {},
                create: {
                    name: city.name,
                    latitude: city.latitude || null,
                    longitude: city.longitude || null,
                    countryId: createdCountry.id,
                },
            });

            console.log(`  🏙️ City "${city.name}" added for ${country.name}.`);
        }
    }

    console.log("✅ Seeding countries, cities, and timezones completed.");
    //endregion

    //region get cities ids
    const saidiaCity = await prisma.city.findFirst({
        where: {
            name: "Saidia",
            country: {
                name: "Morocco",
            },
        },
    });

    if (!saidiaCity) {
        throw new Error("La ville Saidia n'a pas été trouvée pour le pays Morocco.");
    }

    console.log("ID de Saidia:", saidiaCity.id);

    const berkaneCity = await prisma.city.findFirst({
        where: {
            name: "Berkane",
            country: {
                name: "Morocco",
            },
        }
    });

    if (!berkaneCity) {
        throw new Error("La ville Berkane n'a pas été trouvée pour le pays Morocco.");
    }

    console.log("ID de Berkane:", berkaneCity.id);

    const oujdaCity = await prisma.city.findFirst({
        where: {
            name: "Oujda-Angad",
            country: {
                name: "Morocco",
            },
        }
    });

    if (!oujdaCity) {
        throw new Error("La ville Oujda n'a pas été trouvée pour le pays Morocco.");
    }
    console.log("ID de Oujda:", oujdaCity.id);

    const monsCity = await prisma.city.findFirst({
        where: {
            name: "Mons",
            country: {
                name: "Belgium",
            },
        },
    });

    if (!monsCity) {
        throw new Error("La ville Mons n'a pas été trouvée pour le pays Belgique.");
    }

    console.log("ID de Mons:", monsCity.id);

    const frameriesCity = await prisma.city.findFirst({
        where: {
            name: "Frameries",
            country: {
                name: "Belgium",
            },
        },


    });

    if (!frameriesCity) {
        throw new Error("La ville Frameries n'a pas été trouvée pour le pays Belgique.");
    }

    console.log("ID de Frameries:", frameriesCity.id);

    const charleroiCity = await prisma.city.findFirst({
        where: {
            name: "Charleroi",
            country: {
                name: "Belgium",
            },
        }
    });

    if (!charleroiCity) {
        throw new Error("La ville Charleroi n'a pas été trouvée pour le pays Belgique.");
    }

    console.log("ID de Charleroi:", charleroiCity.id);

    const bruxellesCity = await prisma.city.findFirst({
        where: {
            name: "Brussels",
            country: {
                name: "Belgium",
            },
        }
    });

    if (!bruxellesCity) {
        throw new Error("La ville Bruxelles n'a pas été trouvée pour le pays Belgique.");
    }

    console.log("ID de Bruxelles:", bruxellesCity.id);


    //endregion

    //region creates addresses for agencies
// Création de l'adresse pour Bruxelles
    const bruxellesAddress = await prisma.address.create({
        data: {
            street: 'rue de Bruxelles',
            streetNumber: '1',
            cityId: bruxellesCity.id,
        }
    });

// Création de l'adresse pour Charleroi
    const charleroiAddress = await prisma.address.create({
        data: {
            street: 'rue de Charleroi',
            streetNumber: '1',
            cityId: charleroiCity.id,
        }
    });

// Création de l'adresse pour Frameries
    const frameriesAddress = await prisma.address.create({
        data: {
            street: 'rue de Frameries',
            streetNumber: '1',
            cityId: frameriesCity.id,
        }
    });

// Création de l'adresse pour Mons
    const monsAddress = await prisma.address.create({
        data: {
            street: 'rue de Mons',
            streetNumber: '1',
            cityId: monsCity.id,
        }
    });

// Création de l'adresse pour Oujda
    const oujdaAddress = await prisma.address.create({
        data: {
            street: 'rue de Oujda',
            streetNumber: '1',
            cityId: oujdaCity.id,
        }
    });

// Création de l'adresse pour Saidia
    const saidiaAddress = await prisma.address.create({
        data: {
            street: 'rue de Saidia',
            streetNumber: '1',
            cityId: saidiaCity.id,
        }
    });

// Création de l'adresse pour Berkane
    const berkaneAddress = await prisma.address.create({
        data: {
            street: 'rue de Berkane',
            streetNumber: '1',
            cityId: berkaneCity.id,
        }
    });

    console.log('Addresses created');
//endregion

    //region insert agencies
    console.log("🌍 Seeding agencies...");
    await prisma.agency.create({
        data: {
            name: 'Agence de Frameries',
            location: 'Frameries',
            phoneNumber: '+32495500000',
            email: 'agence.de.frameries@gmail.com',
            capacity: 50,
            availableSlots: 40,
            addressId: frameriesAddress.id,
        }
    });

    // Agency : Agence de Bruxelles
    await prisma.agency.create({
        data: {
            name: 'Agence de Bruxelles',
            location: 'Bruxelles',
            phoneNumber: '+32494400000',
            email: 'agence.de.bruxelles@gmail.com',
            capacity: 100,
            availableSlots: 10,
            addressId: bruxellesAddress.id,
        }
    });

    // Agency : Agence de Charleroi
    await prisma.agency.create({
        data: {
            name: 'Agence de Charleroi',
            location: 'Charleroi',
            phoneNumber: '+32496600000',
            email: 'agence.de.charleroi@gmail.com',
            capacity: 80,
            availableSlots: 15,
            addressId: charleroiAddress.id,
        }
    });

    // Agency: Agence de Mons
    await prisma.agency.create({
        data: {
            name: 'Agence de Mons',
            location: 'Mons',
            phoneNumber: '+32497700000',
            email: 'agence.de.mons@gmail.com',
            capacity: 120,
            availableSlots: 20,
            addressId: monsAddress.id,
        }
    });

    // Agency: Agence de Oujda
    await prisma.agency.create({
        data: {
            name: 'Agence de Oujda',
            location: 'Oujda',
            phoneNumber: '+21265500000',
            email: 'agence.de.oujda@gmail.com',
            capacity: 100,
            availableSlots: 15,
            addressId: oujdaAddress.id,
        }
    });

    // Agency: Agence de Saidia
    await prisma.agency.create({
        data: {
            name: 'Agence de Saidia',
            location: 'Saidia',
            phoneNumber: '+212693300000',
            email: 'agence.de.saidia@gmail.com',
            capacity: 100,
            availableSlots: 15,
            addressId: saidiaAddress.id,
        }
    });

    // Agency: Agence de Berkane
    await prisma.agency.create({
        data: {
            name: 'Agence de Berkane',
            location: 'Berkane',
            phoneNumber: '+21266600000',
            email: 'agence.de.berkane@gmail.com',
            capacity: 100,
            availableSlots: 15,
            addressId: berkaneAddress.id,
        }
    });

    console.log('Agences created');


    // Create a Transport
    await prisma.transport.create({
        data: {
            isAvailable: true,
            number: '1111-111-11',
            currentWeight: 0,
            baseWeight: 15000.0,
            currentVolume: 0,
            baseVolume: 42000000.0,
        }
    });

    console.log('Transport created');


    // Create global Tarifs (without agency)
    await prisma.tarifs.create({
        data: {
            agencyId: null,
            weightRate: 1.60,
            volumeRate: 0,
            baseRate: 0,
            fixedRate: 15.00,
        },
    });

    console.log('Tarifs created');

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// path: /seed.js

const {PrismaClient} = require('@prisma/client');


const prisma = new PrismaClient();

async function main() {

    // region Countries and cities
    const countries = [{name: 'Belgique', countryCode: 'BE'}, {name: 'France', countryCode: 'FR'}, {
        name: 'Maroc',
        countryCode: 'MA'
    }, {name: 'Espagne', countryCode: 'ES'}];

    for (const countryData of countries) {
        await prisma.country.upsert({
            where: {countryCode: countryData.countryCode}, update: {}, create: countryData
        });
    }

    // Belgium Country
    const belgique = await prisma.country.findUnique({where: {countryCode: 'BE'}});

    // France Country
    const france = await prisma.country.findUnique({where: {countryCode: 'FR'}});

    // Morocco Country
    const maroc = await prisma.country.findUnique({where: {countryCode: 'MA'}});

    // Spain country
    const espagne = await prisma.country.findUnique({where: {countryCode: 'ES'}});

    console.log(' 🌍 Countries seeded.');

// region Cities
    const cities = [
        // Belgium
        {name: 'Bruxelles', cityCode: '1000', countryId: belgique.id},
        {name: 'Anvers', cityCode: '2000', countryId: belgique.id},
        {name: 'Gand', cityCode: '9000', countryId: belgique.id},
        {name: 'Charleroi', cityCode: '6000', countryId: belgique.id},
        {name: 'Liège', cityCode: '4000', countryId: belgique.id},
        {name: 'Bruges', cityCode: '8000', countryId: belgique.id},
        {name: 'Namur', cityCode: '5000', countryId: belgique.id},
        {name: 'Louvain', cityCode: '3000', countryId: belgique.id},
        {name: 'Mons', cityCode: '7000', countryId: belgique.id},
        {name: 'Frameries', cityCode: '7080', countryId: belgique.id},

        // Morocco
        {name: 'Casablanca', cityCode: '20000', countryId: maroc.id},
        {name: 'Rabat', cityCode: '10000', countryId: maroc.id},
        {name: 'Fès', cityCode: '30000', countryId: maroc.id},
        {name: 'Marrakech', cityCode: '40000', countryId: maroc.id},
        {name: 'Tanger', cityCode: '90000', countryId: maroc.id},
        {name: 'Agadir', cityCode: '80000', countryId: maroc.id},
        {name: 'Nador', cityCode: '62000', countryId: maroc.id},
        {name: 'Oujda', cityCode: '60000', countryId: maroc.id},
        {name: 'Saidia', cityCode: '60600', countryId: maroc.id},
        {name: 'Berkane', cityCode: '63600', countryId: maroc.id},
        // France
        {name: 'Paris', cityCode: '75000', countryId: france.id},
        {name: 'Marseille', cityCode: '13000', countryId: france.id},
        {name: 'Lyon', cityCode: '69000', countryId: france.id},
        {name: 'Toulouse', cityCode: '31000', countryId: france.id},
        {name: 'Nice', cityCode: '06000', countryId: france.id},
        {name: 'Nantes', cityCode: '44000', countryId: france.id},
        {name: 'Strasbourg', cityCode: '67000', countryId: france.id},
        {name: 'Montpellier', cityCode: '34000', countryId: france.id},
        {name: 'Bordeaux', cityCode: '33000', countryId: france.id},
        {name: 'Lille', cityCode: '59000', countryId: france.id},

        // Spain
        {name: 'Madrid', cityCode: '28000', countryId: espagne.id},
        {name: 'Barcelona', cityCode: '08000', countryId: espagne.id},
        {name: 'Valencia', cityCode: '46000', countryId: espagne.id},
        {name: 'Seville', cityCode: '41000', countryId: espagne.id},
        {name: 'Zaragoza', cityCode: '50000', countryId: espagne.id},
        {name: 'Málaga', cityCode: '29000', countryId: espagne.id},
        {name: 'Murcia', cityCode: '30000', countryId: espagne.id},
        {name: 'Palma', cityCode: '07000', countryId: espagne.id},
        {name: 'Bilbao', cityCode: '48000', countryId: espagne.id},
        {name: 'Alicante', cityCode: '03000', countryId: espagne.id},
    ];

    for (const city of cities) {
        await prisma.city.upsert({
            where: {cityCode: city.cityCode}, update: {}, create: city
        });
    }

    // Get city records for addresses

    // Belgium

    const frameriesCity = await prisma.city.findFirst({
        where: { cityCode: '7080', countryId: belgique.id }
    });

    const monsCity = await prisma.city.findFirst({
        where: {cityCode: '7000', countryId: belgique.id}
    });

    const bruxellesCity = await prisma.city.findFirst({
        where: { cityCode: '1000', countryId: belgique.id }
    });

    const charleroiCity = await prisma.city.findFirst({
        where: { cityCode: '6000', countryId: belgique.id }
    });


    // Maroc
    // const casablancaCity = await prisma.city.findFirst({
    //     where: { cityCode: '20000', countryId: maroc.id }
    // });
    //
    // const marrakechCity = await prisma.city.findFirst({
    //     where: { cityCode: '40000', countryId: maroc.id }
    // });

    const saidiaCity = await prisma .city.findFirst({
        where: { cityCode: '60600', countryId: maroc.id }
    });

    const berkaneCity = await prisma .city.findFirst({
        where: { cityCode: '63600', countryId: maroc.id }
    });

    const oujdaCity = await prisma .city.findFirst({
        where: { cityCode: '60000', countryId: maroc.id }
    });


    // Insérer des adresses avec latitude et longitude

    // Belgium addresses
    const bruxellesAddress = await prisma.address.create({
        data: {
            street: 'rue de Bruxelles 1',
            number: '1',
            cityId: bruxellesCity.id,
            countryId: belgique.id,
            latitude: 50.8503,
            longitude: 4.3517,
        },
    });

    const frameriesAddress = await prisma.address.create({
        data: {
            street: 'rue de Frameries',
            number: '1',
            city: frameriesCity.id,
            country: belgique.id,
            latitude: 51.2194,
            longitude: 4.4025,
        },
    });

    const monsAddress = await prisma.address.create({
        data: {
            street: 'rue de Mons',
            number: '1',
            city: monsCity.id,
            country: belgique.id,
            latitude: 50.4542,
            longitude: 3.9567,
        },
    });

    // Morocco addresses

    const  oujdaAddress = await prisma.address.create({
        data: {
            street: 'rue de Oujda',
            number: '1',
            city: oujdaCity.id,
            country: maroc.id,
            latitude: 31.6328,
            longitude: 7.3883,
        },
    });

    const saidiaAddress = await prisma.address.create({
        data: {
            street: 'rue de Saidia',
            number: '1',
            city: saidiaCity.id,
            country: maroc.id,
            latitude: 33.5731,
            longitude: -7.5898,
        },
    });

    const berkaneAddress = await prisma.address.create({
        data: {
            street: 'rue de Berkane',
            number: '1',
            city: berkaneCity.id,
            country: maroc.id,
            latitude: 31.6295,
            longitude: -7.9811,
        },
    });

    console.log('Addresses created');


    // Insérer des agences avec capacity et availableSlots
    // Belgium agencies

    // Frameries
    await prisma.agency.create({
        data : {
            name: 'Agence de Frameries',
            location : 'Frameries',
            capacity : 50,
            availableSlots: 40,
            addressId : frameriesAddress.id,
        }
    })

    // Bruxelles
   await prisma.agency.create({
        data: {
            name: 'Agence de Bruxelles',
            location: 'Bruxelles',
            capacity: 100, // Capacité maximale de stockage
            availableSlots: 10, // Places disponibles pour les rendez-vous ou dépôts
            addressId: bruxellesAddress.id,
        },
    });

    //  Charleroi
   await prisma.agency.create({
        data: {
            name: 'Agence de Charleroi',
            location: 'Charleroi',
            capacity: 80,
            availableSlots: 15,
            addressId: charleroiCity.id,
        },
    });

   // Mons
    await prisma.agency.create({
        data: {
            name: 'Agence de Mons',
            location: 'Mons',
            capacity: 120,
            availableSlots: 20,
            addressId: monsAddress.id,
        }
    });

    // Morocco agencies

    // Oujda
    await prisma.agency.create({
        data: {
            name: 'Agence de Oujda',
            location: 'Oujda',
            capacity: 100,
            availableSlots: 15,
            addressId: oujdaAddress.id,
        },
    });

    // Saidia
    const saidiaAgency = await prisma.agency.create({
        data: {
            name: 'Agence de Saidia',
            location: 'Saidia',
            capacity: 100,
            availableSlots: 15,
            addressId: saidiaAddress.id,
        },
    });

    // Berkane
    const berkaneAgency = await prisma.agency.create({
        data: {
            name: 'Agence de Berkane',
            location: 'Berkane',
            capacity: 100,
            availableSlots: 15,
            addressId: berkaneAddress.id,
        },
    });

    // Insérer des transports
    await prisma.transport.create({
        data: {
            isAvailable: true,
            number: '1111-111-11',
            currentWeight: 0,
            baseWeight: 15000.0,
            currentVolume: 0,
            baseVolume: 42000000.0,
        },
    });

// Insérer des tarifs globaux (sans agence spécifique)
    // Supprimer tous les anciens tarifs, si nécessaire (optionnel)
    // await prisma.tarifs.deleteMany();

    // Insérer des tarifs globaux (sans agence)
    await prisma.tarifs.create({
        data: {
            agencyId: null, // Pas d'agence spécifique
            weightRate: 1.60, // € par kg pour les poids > 10 kg
            volumeRate: 0,    // Pas de frais supplémentaires pour le volume
            baseRate: 0,      // Tarif de base
            fixedRate: 15.00, // Tarif fixe pour les poids <= 10 kg
        },
    });

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// path: /seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Insérer des adresses
    const address1 = await prisma.address.create({
        data: {
            street: 'rue de Bruxelles 1',
            number: '1',
            city: 'Bruxelles',
            zipCode: '2000',
            country: 'Belgique',
        },
    });

    const address2 = await prisma.address.create({
        data: {
            street: 'rue de Anvers 1',
            number: '1',
            city: 'Anvers',
            zipCode: '2000',
            country: 'Belgique',
        },
    });

    const address3 = await prisma.address.create({
        data: {
            street: 'rue de Mons 1',
            number: '1',
            city: 'Mons',
            zipCode: '7000',
            country: 'Belgique',
        },
    });

    const address4 = await prisma.address.create({
        data: {
            street: 'rue de Casablanca 1',
            number: '1',
            city: 'Casablanca',
            zipCode: '20000',
            country: 'Maroc',
        },
    });

    const address5 = await prisma.address.create({
        data: {
            street: 'rue de Marrakech 1',
            number: '1',
            city: 'Marrakech',
            zipCode: '40000',
            country: 'Maroc',
        },
    });

    // Insérer des agences avec capacity et availableSlots
    const agency1 = await prisma.agency.create({
        data: {
            name: 'Agence Bruxelles',
            location: 'Bruxelles',
            capacity: 100, // Capacité maximale de stockage
            availableSlots: 10, // Places disponibles pour les rendez-vous ou dépôts
            addressId: address1.id,
        },
    });

    const agency2 = await prisma.agency.create({
        data: {
            name: 'Agence Anvers',
            location: 'Anvers',
            capacity: 80,
            availableSlots: 15,
            addressId: address2.id,
        },
    });

    const agency3 = await prisma.agency.create({
        data: {
            name: 'Agence Mons',
            location: 'Mons',
            capacity: 120,
            availableSlots: 20,
            addressId: address3.id,
        },
    });

    const agency4 = await prisma.agency.create({
        data: {
            name: 'Agence Casablanca',
            location: 'Casablanca',
            capacity: 150,
            availableSlots: 25,
            addressId: address4.id,
        },
    });

    const agency5 = await prisma.agency.create({
        data: {
            name: 'Agence Marrakech',
            location: 'Marrakech',
            capacity: 90,
            availableSlots: 12,
            addressId: address5.id,
        },
    });

    // Insérer des transports
    const transport1 = await prisma.transport.create({
        data: {
            isAvailable: true,
            number: '1111-111-11',
            currentWeight: 0,
            baseWeight: 15000.0,
            currentVolume: 0,
            baseVolume: 42000000.0,
        },
    });

    // Insérer des tarifs
    const tarifs = await prisma.tarifs.create({
        data: {
            weightRate: 1.60, // € par kg pour les poids > 10 kg
            volumeRate: 0,    // Pas de frais supplémentaires pour le volume
            baseRate: 0,      // Tarif de base
            fixedRate: 15.00, // Tarif fixe pour les poids <= 10 kg
        },
    });

    // Afficher les données insérées
    console.log({
        address1, address2, address3, address4, address5,
        agency1, agency2, agency3, agency4, agency5,
        transport1, tarifs,
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

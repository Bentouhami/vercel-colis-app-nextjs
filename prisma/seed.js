const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Insérer des addresses
    const address1 = await prisma.address.create({
        data: {
            street: 'rue de Bruxelles 1',
            number: '1',
            city: 'Bruxelles',
            zipCode: '2000',
            country: 'Belgique',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    const address2 = await prisma.address.create({
        data: {
            street: 'rue de Anvers 1',
            number: '1',
            city: 'Anvers',
            zipCode: '2000',
            country: 'Belgique',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    const address3 = await prisma.address.create({
        data: {
            street: 'rue de Mons 1',
            number: '1',
            city: 'Mons',
            zipCode: '7000',
            country: 'Belgique',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    const address4 = await prisma.address.create({
        data: {
            street: 'rue de Casablanca 1',
            number: '1',
            city: 'Casablanca',
            zipCode: '20000',
            country: 'Maroc',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    const address5 = await prisma.address.create({
        data: {
            street: 'rue de Marrakech 1',
            number: '1',
            city: 'Marrakech',
            zipCode: '40000',
            country: 'Maroc',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    // Insérer des agences
    const agency1 = await prisma.agency.create({
        data: {
            name: 'Agence Bruxelles',
            location: 'Bruxelles',
            createdAt: new Date(),
            updatedAt: new Date(),
            addressId: address1.id,
        },
    });

    const agency2 = await prisma.agency.create({
        data: {
            name: 'Agence Anvers',
            location: 'Anvers',
            createdAt: new Date(),
            updatedAt: new Date(),
            addressId: address2.id,
        },
    });

    const agency3 = await prisma.agency.create({
        data: {
            name: 'Agence Mons',
            location: 'Mons',
            createdAt: new Date(),
            updatedAt: new Date(),
            addressId: address3.id,
        },
    });

    const agency4 = await prisma.agency.create({
        data: {
            name: 'Agence Casablanca',
            location: 'Casablanca',
            createdAt: new Date(),
            updatedAt: new Date(),
            addressId: address4.id,
        },
    });

    const agency5 = await prisma.agency.create({
        data: {
            name: 'Agence Marrakech',
            location: 'Marrakech',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    console.log({
        address1, address2, address3, address4, address5,
        agency1, agency2, agency3, agency4, agency5,
        transport1,
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

import { prisma } from "@/lib/prisma";
//
// export async function handleEnvoiCreation(simulation) {
//     // 1. Create Envoi record
//     const envoi = await prisma.envoi.create({
//         data: {
//             trackingNumber: generateTrackingNumber(),
//             clientId: simulation.userId,
//             departureAgencyId: simulation.departureAgencyId,
//             arrivalAgencyId: simulation.destinationAgencyId,
//             totalWeight: simulation.totalWeight,
//             totalVolume: simulation.totalVolume,
//             totalPrice: simulation.totalPrice,
//             dateSent: new Date(),
//             status: 'PENDING',
//             destinataireId: simulation.destinataireId,
//         },
//     });
//
//     // 2. Add Parcels
//     const parcelsData = simulation.parcels.map(parcel => ({
//         ...parcel,
//         envoiId: envoi.id,
//     }));
//     await prisma.parcel.createMany({ data: parcelsData });
//
//     // 3. Update Transport
//     await prisma.transport.update({
//         where: { id: simulation.transportId },
//         data: {
//             currentWeight: { increment: simulation.totalWeight },
//             currentVolume: { increment: simulation.totalVolume },
//         },
//     });
//
//     // 4. Create Notification
//     await prisma.notification.create({
//         data: {
//             message: 'Votre envoi a été créé avec succès !',
//             userId: simulation.userId,
//             envoiId: envoi.id,
//             isRead: false,
//             createdAt: new Date(),
//         },
//     });
//
//     // Additional steps (e.g., user profile update) can also be added here
// }

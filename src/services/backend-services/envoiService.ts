// Path: src/services/backend-services/envoiService.ts

import prisma from "@/utils/db";

export async function cancelSimulation(envoiId: number): Promise<void> {
    try {
        // Vérifiez si l'envoi existe
        const envoi = await prisma.envoi.findUnique({
            where: {id: envoiId},
        });

        if (!envoi) {
            throw new Error(`Envoi avec ID ${envoiId} introuvable.`);
        }

        // une transaction Prisma pour effectuer les opérations
        await prisma.$transaction([
            // Supprimer les colis liés à l'envoi
            prisma.parcel.deleteMany({
                where: {envoiId},
            }),
            // Mettre à jour le statut de l'envoi
            prisma.envoi.update({
                where: {id: envoiId},
                data: {
                    simulationStatus: "CANCELLED",
                    status: null, // Vous pouvez ajuster selon les besoins
                },
            }),
        ]);

        console.log(`Simulation ${envoiId} annulée et parcels supprimés.`);
    } catch (error) {
        console.error("Erreur lors de l'annulation de la simulation :", error);
        throw error;
    }
}

export async function deleteParcelsByEnvoiId(envoiId: number) {
    try {
        await prisma.parcel.deleteMany({
            where: {envoiId},
        });
    } catch (error) {
        console.error("Erreur lors de la suppression des parcels:", error);
        throw error;
    }
}

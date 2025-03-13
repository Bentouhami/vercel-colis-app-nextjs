// path: src/services/dal/envois/EnvoiDAO.ts

import {Envoi as EnvoiPrisma} from "@prisma/client";
import prisma from "@/utils/db";
import {EnvoiStatus, SimulationStatus} from "@/services/dtos";
import {IEnvoiDAO} from "@/services/dal/DAO/envois/IEnvoiDAO";

/**
 * EnvoiDAO class is responsible for interacting with the Envoi table in the database.
 * It provides methods to retrieve, create, update, and delete envoi data.
 */
export class EnvoiDAO implements IEnvoiDAO {

    /**
     * Retrieves an envoi by its ID from the database.
     * @param id - The ID of the envoi to retrieve.
     * @returns {Promise<EnvoiPrisma | null>} The EnvoiDto object, or null if the envoi is not found.
     */
    async getEnvoiById(id: number): Promise<EnvoiPrisma | null> {
        const envoi = await prisma.envoi.findUnique({
            where: {id},
            include: {parcels: true}
        });

        if (!envoi) {
            return null;
        }
        return envoi;
    }

    /**
     * Updates an envoi in the database.
     * @param data - The data to update the envoi with.
     * @param id
     * @returns {Promise<EnvoiPrisma | null>} The updated EnvoiDto object, or null if the envoi is not found.
     */
    async updateEnvoi(id: number, data: any): Promise<EnvoiPrisma | null> {
        if (!data) {
            throw new Error("Envoi data not found");
        }

        try {
            // Update only the fields directly on the Envoi model
            const updatedEnvoi = await prisma.envoi.update({
                where: { id },
                data, // Use only the direct fields
            });

            if (!updatedEnvoi) {
                return null;
            }
            return updatedEnvoi;
        } catch (error) {
            console.error("Error updating envoi:", error);
            throw new Error("Error updating envoi");
        }
    }


    /**
     * Cancels a simulation and deletes the envoi.
     * @param envoiId - The ID of the envoi to cancel.
     * @returns {Promise<void>} A Promise that resolves when the simulation is cancelled.
     */
    async cancelSimulation(envoiId: number): Promise<void> {
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
                        simulationStatus: SimulationStatus.CANCELLED,
                        envoiStatus: EnvoiStatus.CANCELLED, // Vous pouvez ajuster selon les besoins
                    },
                }),
            ]);

        } catch (error) {
            console.error("Erreur lors de l'annulation de la simulation :", error);
            throw error;
        }
    }

    async deleteParcelsByEnvoiId(envoiId: number) {
        try {
            await prisma.parcel.deleteMany({
                where: {envoiId},
            });
        } catch (error) {
            console.error("Erreur lors de la suppression des parcels:", error);
            throw error;
        }
    }
}

// Export a single instance of the EnvoiDAO class for use throughout the application
export const envoiDAO = new EnvoiDAO(); // Singleton pattern
// path: src/services/dal/DAO/parcels/ParcelDAO.ts

import {IParcelDAO} from "@/services/dal/DAO/parcels/IParcelDAO";
import {ParcelDto} from "@/services/dtos";
import prisma from "@/utils/db";

class ParcelDAO implements IParcelDAO {
    async getParcelsBySimulationId(id: number): Promise<any | null> {
        if (!id) {
            return [];
        }

        try {
            const parcels = await prisma.parcel.findMany({
                where: {
                    envoiId: id,
                }
            });

            if (!parcels) {
                return [];
            }

            return parcels;

        } catch (error) {
            console.error("Error getting parcels by simulation ID:", error);
            throw error;
        }
    }

    async updateParcels(id: number, parcels: ParcelDto[]): Promise<void> {
        if (!id) {
            return;
        }

        try {
            await prisma.parcel.updateMany({
                where: {
                    envoiId: id,
                },
                data: {
                    ...parcels,
                },
            });
        } catch (error) {
            console.error("Error updating parcels:", error);
            throw error;
        }
    }

    async deleteParcelsBySimulationId(envoiId: number): Promise<void> {
        await prisma.parcel.deleteMany({
            where: {envoiId},
        });
    }

    async createParcels(parcels: ParcelDto[]): Promise<void> {
        await prisma.parcel.createMany({
            data: parcels.map((parcel) => ({
                ...parcel,
                envoiId: parcel.envoiId,
            })),
        });
    }
}

// Export a single instance of the ParcelDAO class for use throughout the application
export const parcelDAO = new ParcelDAO();
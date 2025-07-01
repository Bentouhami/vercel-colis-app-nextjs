// path: src/services/repositories/parcels/ParcelRepository.ts

import {IParcelRepository} from "@/services/repositories/parcels/IParcelRepository";
import {ParcelDto} from "@/services/dtos";
import {parcelDAO} from "@/services/dal/DAO/parcels/ParcelDAO";

export class ParcelRepository implements IParcelRepository {
    async getParcelsBySimulationId(id: number): Promise<ParcelDto[] | null> {
        // Check if the id is valid
        if (!id) {
            return null;
        }

        // Call the DAO to get the parcels
        try {
            const parcels = await parcelDAO.getParcelsBySimulationId(id);

            // Check if the parcels exist
            if (!parcels) {
                return null;
            }

            // Map the parcels to a ParcelDto[] and return it
            return parcels.map((parcel: { id: any; height: any; weight: any; width: any; length: any; envoiId: any; }) => ({
                id: parcel.id,
                height: parcel.height,
                weight: parcel.weight,
                width: parcel.width,
                length: parcel.length,
                envoiId: parcel.envoiId,
            }));

            // Handle any errors that may occur during the mapping process
        } catch (error) {
            console.error("Error getting parcels:", error);
            throw error;
        }
    }


    async deleteParcelsBySimulationId(envoiId: number): Promise<void> {
        await parcelDAO.deleteParcelsBySimulationId(envoiId);
    }

    async createParcels(parcels: ParcelDto[]): Promise<void> {
        await parcelDAO.createParcels(parcels);
    }
}

// Export a single instance of the ParcelRespository for use throughout the application
export const parcelRepository = new ParcelRepository();
// path: src/services/repositories/tarifs/TarifRepositories.ts

import {ITarifRepository} from "@/services/repositories/tarifs/ITarifRepositories";
import {tarifsDAO} from "@/services/dal/DAO/tarifs/TarifDAO";
import {TarifMapper} from "@/services/mappers/TarifMapper";
import {TarifsDto} from "@/services/dtos";

export class TarifsRepository implements ITarifRepository {
    async getTarifs(): Promise<TarifsDto | null> {
        // Call the DAO to get the tarifs
        try {
            const tarifs = await tarifsDAO.getTarifs();

            // Check if the tarifs exist
            if (!tarifs) {
                return null;
            }

            // Map the tarifs to a TarifsResponseDto and return it
            return TarifMapper.toDto(tarifs);

            // Handle any errors that may occur during the mapping process
        } catch (error) {
            console.error("Error getting tarifs:", error);
            throw error;
        }
    }
}

// Export a single instance
export const
    tarifsRepository = new TarifsRepository();
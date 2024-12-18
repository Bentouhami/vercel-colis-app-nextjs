// path: src/services/repositories/tarifs/TarifRepositories.ts

import {ITarifRepository} from "@/services/repositories/tarifs/ITarifRepositories";
import {tarifsDAO} from "@/services/dal/DAO/tarifs/TarifDAO";
import {TarifMapper} from "@/services/mappers/TarifMapper";
import {TarifsDto} from "@/services/dtos";

/**
 * This class provides methods for interacting with the tarifs table in the database.
 * @class TarifsRepository
 * @description This class is responsible for handling database operations related to tarifs. It provides methods for retrieving tarifs from the database.
 * @implements {ITarifRepository}
 *
 */
export class TarifsRepository implements ITarifRepository {

    /**
     * get tarifs from database and map it to a TarifsResponseDto
     * @returns {Promise<TarifsDto | null>} tarifs or null if not found
     */
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
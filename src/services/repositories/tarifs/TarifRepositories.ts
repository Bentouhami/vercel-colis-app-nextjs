// path: src/services/repositories/tarifs/TarifRepositories.ts

import {ITarifRepository} from "@/services/repositories/tarifs/ITarifRepositories";
import {tarifsDAO} from "@/services/dal/DAO/tarifs/TarifDAO";
import {TarifsDto} from "@/services/dtos";
import { prisma } from "@/utils/db";

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
            const tarifs = await prisma.tarifs.findFirst();

            // Check if the tarifs exist
            if (!tarifs) {
                return null;
            }

           // Prepare the tarifs object to return as TarifsDto and return it
            const tarifsObj: TarifsDto = {
                id: tarifs.id,
                weightRate: tarifs.weightRate.toNumber(),
                volumeRate: tarifs.volumeRate.toNumber(),
                baseRate: tarifs.baseRate.toNumber(),
                fixedRate: tarifs.fixedRate.toNumber(),
            };

            if (!tarifsObj) {
                return null;
            }
            return tarifsObj;
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
// path: src/services/dal/DAO/tarifs/TarifDAO.ts

import prisma from "@/utils/db";
import {ITarifDAO} from "@/services/dal/DAO/tarifs/ITarifDAO";
import {Tarifs as TarifsPrisma} from "@prisma/client";

/**
 * DAO for tarifs
 */

class TarifDAO implements ITarifDAO {

    /**
     * Retrieves tarifs from the database
     * @returns TarifsResponseDto or null if not found
     */
    async getTarifs(): Promise<TarifsPrisma | null> {
        try {
            // Get the tarifs from the database
            const tarifs = await prisma.tarifs.findFirst();

            // Check if the tarifs exist
            if (!tarifs) {
                return null;
            }

            // return tarifs;
            return tarifs;

            // Handle any errors that may occur during the database query
        } catch (error) {
            console.error("Error getting tarifs:", error);
            throw error;
        }
    }
}

// Export a single instance
export const
    tarifsDAO = new TarifDAO();
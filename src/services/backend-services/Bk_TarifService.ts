// path: src/services/backend-services/Bk_TarifService.ts

'use server';
import {TarifsDto} from "@/services/dtos";
import {tarifsRepository} from "@/services/repositories/tarifs/TarifRepositories";

/**
 * Find tarifs from the database
 * @returns {Promise<TarifsDto | null>} tarifs or null
 */
export async function findTarifs(): Promise<TarifsDto | null> {
    try {

        const tarifs = await tarifsRepository.getTarifs();

        if (!tarifs) {
            return null;
        }

        return tarifs;

    } catch (error) {
        return null;
    }
}

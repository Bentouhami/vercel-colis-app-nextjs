// path: src/services/repositories/tarifs/ITarifRepositories.ts

import {TarifsDto} from "@/services/dtos";

export interface ITarifRepository {
    /**
     * Retrieves tarifs from the database
     * @returns TarifsResponseDto or null if not found
     */
    getTarifs(): Promise<TarifsDto | null>;
}
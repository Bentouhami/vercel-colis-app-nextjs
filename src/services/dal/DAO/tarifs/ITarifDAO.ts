// path: src/services/dal/DAO/tarifs/ITarifDAO.ts

import {Tarifs as TarifsPrisma} from "@prisma/client";

export interface ITarifDAO {
    /**
     * Retrieves tarifs from the database
     * @returns TarifsResponseDto or null if not found
     */
    getTarifs(): Promise<TarifsPrisma | null>;
}
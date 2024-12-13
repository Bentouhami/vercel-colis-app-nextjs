// path: src/services/dal/DAO/agencies/IAgencyDAO.ts

import {Agency as AgencyPrisma} from "@prisma/client";

export interface IAgencyDAO {
    /**
     * Retrieves an agency by its ID
     * @param id The unique identifier of the agency
     * @returns An AgencyResponseDto or null if not found
     */
    getAgencyById(id: number): Promise<AgencyPrisma | null>;

}
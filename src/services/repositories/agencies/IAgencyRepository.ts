// path: src/services/interfaces/IAgencyRepository.ts

import {AgencyDto, AgencyResponseDto} from "@/services/dtos";

export interface IAgencyRepository {
    /**
     * Retrieves an agency by its ID
     * @param id The unique identifier of the agency
     * @returns An AgencyResponseDto or null if not found
     */
    getAgencyById(id: number): Promise<AgencyResponseDto | null>;
    getAgencyId(country: string, city: string, agencyName: string): Promise<number | null>;
    createAgency(agencyData: AgencyDto, staffId: number): Promise<AgencyResponseDto | null>;
    getAgencyIdForAdmin(adminId: number): Promise<number | null>;

}
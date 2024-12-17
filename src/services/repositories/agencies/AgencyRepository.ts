// path: src/services/repositories/agencies/AgencyRepository.ts

import {IAgencyRepository} from "@/services/repositories/agencies/IAgencyRepository";
import {AgencyResponseDto} from "@/services/dtos";
import {agencyDAO} from "@/services/dal/DAO/agencies/AgencyDAO";
import {AgencyMapper} from "@/services/mappers/AgencyMapper";

export class AgencyRepository implements IAgencyRepository {
    async getAgencyById(id: number): Promise<AgencyResponseDto | null> {
        // Check if the id is valid
        if (!id) {
            return null;
        }

        // Call the DAO to get the agency
        try {
            const agency = await agencyDAO.getAgencyById(id);

            // Check if the agency exists
            if (!agency) {
                return null;
            }

            // Map the agency to an AgencyResponseDto and return it
            return AgencyMapper.toAgencyResponseDto(agency);

            // Handle any errors that may occur during the mapping process
        } catch (error) {
            console.error("Error getting agency:", error);
            throw error;
        }
    }

    async getAgencyId(country: string, city: string, agencyName: string): Promise<number | null> {
        if (!country || !city || !agencyName) {
            return null;
        }
        try {
            const agency = await agencyDAO.getAgencyId(country, city, agencyName);

            if (!agency) {
                return null;
            }
            return agency;
        } catch (error) {
            console.error("Error getting agency id:", error);
            throw error;
        }

    }
}

export const agencyRepository = new AgencyRepository();
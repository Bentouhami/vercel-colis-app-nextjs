// path: src/backend-services/AgencyService.ts

import {AgencyResponseDto} from "@/utils/dtos";
import prisma from "@/utils/db";


/**
 * Find agency by name
 * @param agencyName - agency name
 * @param agencyName
 * @returns {Promise<AgencyResponseDto | null>} agency or null
 */
export async function findAgencyByName(agencyName: string): Promise<AgencyResponseDto | null> {
    const agency = await prisma.agency.findFirst({
        where: {
            name: agencyName,
        },
    }) as AgencyResponseDto | null;

    if (!agency) {
        return null;
    }

    return agency;
}

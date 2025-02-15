// path: src/backend-services/Bk_AgencyService.ts

import {FullAgencyDto, BaseAgencyDto} from "@/services/dtos";
import prisma from "@/utils/db";
import {agencyRepository} from "@/services/repositories/agencies/AgencyRepository";


/**
 * Find agency by name
 * @param agencyName - agency name
 * @param agencyName
 * @returns {Promise<FullAgencyDto | null>} agency or null
 */
export async function findAgencyByName(agencyName: string): Promise<FullAgencyDto | null> {
    const agency = await prisma.agency.findFirst({
        where: {
            name: agencyName,
        },
    }) as FullAgencyDto | null;

    if (!agency) {
        return null;
    }

    return agency;
}

export async function getAgencyId(country: string, city: string, agencyName: string): Promise<number | null> {

    try {
        const agencyId = await agencyRepository.getAgencyId(country, city, agencyName);


        if (!agencyId) {
            throw new Error("Agency not found");
        }
        return agencyId;
    } catch (error) {
        console.error("Error getting agency id:", error);
        throw error;
    }
}

export async function getAgencyById(id: number): Promise<BaseAgencyDto | null> {
    console.log("log ====> getAgencyById function called in src/services/backend-services/Bk_AgencyService.ts with id: ", id);
    try {
        const agency = await prisma.agency.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                location: true,
                address: {
                    select: {
                        id: true,
                        city: true,
                        country: true
                    },
                },
                capacity: true,
                availableSlots: true,
            },
        });

        console.log("log ====> agency in getAgencyById function called in src/services/backend-services/Bk_AgencyService.ts: ", agency);

        if (!agency) {
            throw new Error("Agency not found");
        }

        return agency;
    } catch (error) {
        console.error("Error getting agency:", error);
        throw error;
    }
}

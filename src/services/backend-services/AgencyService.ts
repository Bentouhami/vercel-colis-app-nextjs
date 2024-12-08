// path: src/backend-services/AgencyService.ts

import {AgencyResponseDto, BaseAgencyDto} from "@/services/dtos";
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

export async function getAgencyIdByCountryAndCityAndAgencyName(country: string, city: string, agencyName: string): Promise<number> {
    console.log("log ====> getAgencyIdByCountryAndCityAndAgencyName function called in src/services/backend-services/AgencyService.ts with country, city and agencyName: ", country, city, agencyName);
    try {
        const agencyId = await prisma.agency.findFirst({
            where: {
                name: agencyName,
                address: {
                    city: city,
                    country: country,
                },
            },
            select: {
                id: true
            },
        });

        console.log("log ====> agencyId in getAgencyIdByCountryAndCityAndAgencyName function called in src/services/backend-services/AgencyService.ts: ", agencyId);
        if (!agencyId) {
            throw new Error("Agency not found");
        }
        return agencyId.id;
    } catch (error) {
        console.error("Error getting agency id:", error);
        throw error;
    }
}

export async function getAgencyById(id: number): Promise<BaseAgencyDto | null> {
    console.log("log ====> getAgencyById function called in src/services/backend-services/AgencyService.ts with id: ", id);
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

        console.log("log ====> agency in getAgencyById function called in src/services/backend-services/AgencyService.ts: ", agency);

        if (!agency) {
            throw new Error("Agency not found");
        }

        return agency;
    } catch (error) {
        console.error("Error getting agency:", error);
        throw error;
    }
}
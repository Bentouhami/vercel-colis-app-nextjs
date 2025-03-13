// path: src/services/backend-services/Bk_CityService.ts
'use server';
import prisma from "@/utils/db";
import {CityDto} from "@/services/dtos/cities/CityDto";

/**
 * Get all cities for a country
 * @returns {CityDTO[]} array of cities
 * @param countryId
 */
export async function getCitiesPerCountry(countryId: number): Promise<CityDto[] | null> {


    if (!countryId || countryId === 0) {
        throw new Error("Country code is required");
    }
    try {
        const cities = await prisma.city.findMany({
            where: {
                countryId,
            },
            select: {
                id: true,
                name: true,
                country: {
                    select: {
                        id: true,
                        name: true,
                        iso2: true,
                        iso3: true,
                        phonecode: true,
                        capital: true,
                        currency: true,
                        latitude: true,
                        longitude: true,
                        emoji: true
                    }
                },
            }
        });
        return cities;
    } catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
    }
}


export async function getCityById(cityId: number): Promise<CityDto | null> {

    if (!cityId || cityId === 0) {
        throw new Error("City ID is required");
    }

    try {
        const city = await prisma.city.findUnique({
            where: {
                id: cityId,
            },
            select: {
                id: true,
                name: true,
                country: {
                    select: {
                        id: true,
                        name: true,
                        iso2: true,
                        iso3: true,
                        phonecode: true,
                        capital: true,
                        currency: true,
                        latitude: true,
                        longitude: true,
                        emoji: true
                    }
                },
            }
        });
        if (!city) {
            throw new Error("City not found");
        }
        return city;
    } catch (error) {
        console.error("Error fetching city:", error);
        throw error;
    }
}


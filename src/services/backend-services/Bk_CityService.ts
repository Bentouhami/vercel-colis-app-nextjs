// path: src/services/backend-services/Bk_CityService.ts
'use server';
import {CityDTO} from "@/services/dtos/countries/CountryDto";
import prisma from "@/utils/db";

/**
 * Get all cities for a country
 * @returns {CityDTO[]} array of cities
 * @param countryId
 */
export async function getCitiesPerCountry(countryId: number): Promise<CityDTO[] | null> {

    console.log("getCitiesPerCountry function called in path: src/services/backend-services/Bk_CityService.ts");

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
                latitude: true,
                longitude: true,
                countryId: true,
            }
        });
        return cities;
    } catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
    }
}


export async function getCityById(cityId: number): Promise<CityDTO | null> {
    console.log("getCityById function called in path: src/services/backend-services/Bk_CityService.ts");

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
                latitude: true,
                longitude: true,
                countryId: true,
            }
        });
        return city;
    } catch (error) {
        console.error("Error fetching city:", error);
        throw error;
    }
}


//
// export async function createCity(cityData: CityDTO): Promise<CityDTO | null> {
//     console.log("createCity function called in path: src/services/backend-services/Bk_CityService.ts");
//
//     if (!cityData) {
//         throw new Error("City data is required");
//     }
//
//     try {
//         const city = await prisma.city.create({
//             data: {
//                 name: cityData.name,
//                 latitude: cityData.latitude,
//                 longitude: cityData.longitude,
//                 countryId: cityData.countryId,
//             },
//         });
//         return city;
//     } catch (error) {
//         console.error("Error creating city:", error);
//         throw error;
//     }
// }


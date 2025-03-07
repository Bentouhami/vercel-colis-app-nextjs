// path: src/services/backend-services/Bk_CountryService.ts

import prisma from "@/utils/db";
import {CountryDto} from "@/services/dtos/countries/CountryDto";

/**
 * Check if country already exists in the database by name
 * @param countryName - country name
 * @returns {Promise<boolean>} true if country exists, false otherwise
 */
export async function isCountryAlreadyExist(countryName: string): Promise<CountryDto | null> {
    try {
        const country = await prisma.country.findFirst({
            where: {name: countryName},
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
            }
        });
        return country ? country : null;
    } catch (error) {
        console.error("Erreur lors de la vérification du pays :", error);
        throw error;
    }
}

export async function getAllCountries(): Promise<CountryDto[] | null> {
    console.log("getAllCountries function called in path: src/services/backend-services/Bk_CountryService.ts");
    try {

        const countries = await prisma.country.findMany({
            select: {
                id: true,
                name: true,
                iso2: true,
                iso3: true,
                phonecode: true,
                capital: true,
                currency: true,
                latitude: true,
                longitude: true
            }
        });
        console.log("countries:", countries);

        return countries || [];
    } catch (error) {
        console.error("Erreur lors de la récupération des pays :", error);
        throw error;
    }
}
//
// export async function getCountriesForAgencies(departureCountry: string): Promise<any[] | null> {
//     const countries = await prisma.city.findMany({
//         where: {
//             addresses: { some: { agency: { isNot: null } } }, // Vérifie si une agence est liée à une adresse
//             countryId: departureCountry ? { not: Number(departureCountry) } : undefined,
//         },
//         select: {
//             country: {
//                 select: {
//                     id: true,
//                     name: true
//                 }
//             }
//         },
//         distinct: ['countryId'] // Assure que les pays sont uniques
//     });
//
//     return countries || [];
// }
// path: src/services/frontend-services/city/CityService.ts

import {CityDTO} from "@/services/dtos/countries/CountryDto";
import axios from "axios";
import {API_DOMAIN} from "@/utils/constants";

/**
 * Get all cities for a country
 * @returns {CityDTO[]} array of cities
 * @param countryId
 */
export async function getCitiesPerCountry(countryId: number): Promise<CityDTO[] | null> {
    try {
        const response = await axios.get(`${API_DOMAIN}/cities/${countryId}`);

        if (!response.data) {
            throw new Error("No cities found");
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
    }
}

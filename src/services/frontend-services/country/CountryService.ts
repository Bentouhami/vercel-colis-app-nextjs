// path: src/services/frontend-services/country/CountryService.ts

import {CountryDto} from "@/services/dtos/countries/CountryDto";
import axios from "axios";
import {API_DOMAIN} from "@/utils/constants";

/**
 * Get all countries
 * @returns {CountryDto[]} array of countries
 */
export async function getAllCountries(): Promise<CountryDto[] | null> {
    try {
        const response = await axios.get(`${API_DOMAIN}/countries/all`);
        if (!response.data) {
            throw new Error("No data received from the server");
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching countries:", error);
        throw error;
    }
}
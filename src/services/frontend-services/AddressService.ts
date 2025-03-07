// path: src/services/frontend-services/AddressService.ts

'use client';

import {API_DOMAIN} from "@/utils/constants";
import axios from "axios";

// Récupérer les pays disponibles pour la simulation
export async function fetchCountries() {
    console.log("📡 fetchCountries function called");

    try {
        const response = await axios.get(`${API_DOMAIN}/countries`);

        // Extract and properly format the response
        const formattedCountries = response.data.map((item: { country: { id: number; name: string } }) => ({
            id: item.country.id,
            name: item.country.name,
        }));

        console.log("✅ Formatted countries:", formattedCountries);
        return formattedCountries;
    } catch (error) {
        console.error("❌ An error occurred while fetching countries:", error);
        throw error;
    }
}


// Récupérer les pays de destination disponibles pour la simulation (selon le pays de départ)
export async function fetchDestinationCountries(departureCountry: string) {
    console.log("📡 fetchDestinationCountries function called, departureCountry:", departureCountry);

    try {
        const response = await axios.get(`${API_DOMAIN}/countries`, {
            params: {departureCountry}
        });

        const formattedCountries = response.data.map((item: { country: { id: number; name: string } }) => ({
            id: item.country.id,
            name: item.country.name,
        }));

        console.log("✅ Destination Countries:", formattedCountries);
        return formattedCountries;
    } catch (error) {
        console.error("❌ Error fetching destination countries:", error);
        throw error;
    }
}


// Récupérer les villes disponibles pour un pays donné
export async function fetchCities(countryId: number) {
    console.log(`📡 fetchCities function called with countryId: ${countryId}`);

    try {
        const response = await axios.get(`${API_DOMAIN}/cities`, {
            params: {countryId: countryId}, // Send `countryId` as number
        });

        if (response.status === 200) {
            const formattedCities = response.data.map((city: { id: number; name: string }) => ({
                id: city.id, // Ensure `id` is correct
                name: city.name, // Ensure `name` is correct
            }));

            console.log("✅ Cities fetched:", formattedCities);
            return formattedCities;
        }
    } catch (error) {
        console.error("❌ Error fetching cities:", error);
        throw error;
    }
}


// Récupérer les agences disponibles pour une ville donnée
export async function fetchAgencies(cityId: number) {
    console.log(`📡 fetchAgencies function called with cityId: ${cityId}`);

    try {
        const response = await axios.get(`${API_DOMAIN}/agencies`, {
            params: { city: cityId }, // ✅ Ensure city ID is sent
        });

        if (response.status === 200) {
            const formattedAgencies = response.data.map((agency: { id: number; name: string }) => ({
                id: agency.id, // ✅ Ensure correct mapping
                name: agency.name,
            }));

            console.log("✅ Agencies fetched:", formattedAgencies);
            return formattedAgencies;
        }
    } catch (error) {
        console.error("❌ Error fetching agencies:", error);
        throw error;
    }
}


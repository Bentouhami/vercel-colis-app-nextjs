// path: src/services/frontend-services/AddressService.ts

'use client';

import {DOMAIN} from "@/utils/constants";

// Récupérer les pays disponibles pour la simulation
export async function fetchCountries() {
    console.log("fetchCountries function called");

    try {

        const response = await fetch(`${DOMAIN}/api/v1/countries`);
        if (!response.ok) {
            console.error("An error occurred while fetching countries: ", response.status);
            return null;
        }

        return  response.json();

    } catch (error) {
        console.error("An Error occurred while fetching countries: ", error);
        throw error;
    }

}

// Récupérer les pays de destination disponibles pour la simulation (selon le pays de départ)
export async function fetchDestinationCountries(departureCountry: string) {

    console.log("fetchDestinationCountries function called, departureCountry: ", departureCountry);

    const response = await fetch(`${DOMAIN}/api/v1/countries?departureCountry=${encodeURIComponent(departureCountry)}`);

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch destination countries');
    }
}

// Récupérer les villes disponibles pour un pays donné
export async function fetchCities(country: string) {
    console.log("fetchCities function called, country: ", country);


    const response = await fetch(`${DOMAIN}/api/v1/cities?country=${encodeURIComponent(country)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch cities');
    }
}

// Récupérer les agences disponibles pour une ville donnée
export async function fetchAgencies(city: string) {
    if (!city) {
        throw new Error('City parameter is required');
    }
    console.log("fetchAgencies function called, city: ", city);

    const response = await fetch(`${DOMAIN}/api/v1/agencies?city=${encodeURIComponent(city)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch agencies');
    }
}

// path: src/services/frontend-services/AddressService.ts

"use client";

import { API_DOMAIN } from "@/utils/constants";
import axios from "axios";
import apiClient from "@/utils/axiosInstance";

// Récupérer les pays disponibles pour la simulation
export async function getAllCountries() {
  try {
    const response = await apiClient.get(`/countries`);

    // Extract and properly format the response
    const formattedCountries = response.data.map(
      (item: { country: { id: number; name: string } }) => ({
        id: item.country.id,
        name: item.country.name,
      })
    );

    return formattedCountries;
  } catch (error) {
    console.error("An error occurred while fetching countries:", error);
    throw error;
  }
}

// Récupérer les pays de destination disponibles pour la simulation (selon le pays de départ)
export async function getDestinationCountries(departureCountry: string) {
  try {
    const response = await apiClient.get(`/countries`, {
      params: { departureCountry },
    });

    const formattedCountries = response.data.map(
      (item: { country: { id: number; name: string } }) => ({
        id: item.country.id,
        name: item.country.name,
      })
    );

    return formattedCountries;
  } catch (error) {
    console.error("Error fetching destination countries:", error);
    throw error;
  }
}

// Récupérer les villes disponibles pour un pays donné
export async function getCitiesByCountryId(countryId: number) {
  try {
    const response = await apiClient.get(`/cities`, {
      params: { countryId: countryId }, // Send `countryId` as number
    });

    if (response.status === 200) {
      const formattedCities = response.data.map(
        (city: { id: number; name: string }) => ({
          id: city.id, // Ensure `id` is correct
          name: city.name, // Ensure `name` is correct
        })
      );

      return formattedCities;
    }
  } catch (error) {
    console.error(" Error fetching cities:", error);
    throw error;
  }
}

// Récupérer les agences disponibles pour une ville donnée
export async function getAgenciesByCityId(cityId: number) {
  try {
    const response = await apiClient.get(`agencies`, {
      params: { city: cityId }, //  Ensure city ID is sent
    });

    if (response.status === 200) {
      const formattedAgencies = response.data.map(
        (agency: { id: number; name: string }) => ({
          id: agency.id, //  Ensure correct mapping
          name: agency.name,
        })
      );

      return formattedAgencies;
    }
  } catch (error) {
    console.error(" Error fetching agencies:", error);
    throw error;
  }
}

export async function getAgenciesLight(params?: {
  countryId?: number;
  cityId?: number;
  search?: string;
}) {
  const res = await apiClient.get("/agencies/light", { params });
  return res.data as { id: number; name: string }[];
}
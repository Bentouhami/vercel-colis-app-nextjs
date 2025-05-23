// path: src/services/frontend-services/AgencyService.ts
'use server';

import { API_DOMAIN } from "@/utils/constants";
import { AgencyResponseDto, CreateAgencyDto } from "@/services/dtos";

/**
 * Get agency id by country, city, and agency name
 * @param country - should be a numeric string (e.g. "21")
 * @param city - the city name (e.g. "Brussels")
 * @param agencyName - the agency name (e.g. "Agence de Bruxelles")
 * @returns Agency ID or null if not found
 */
export async function getAgencyId(country: string, city: string, agencyName: string): Promise<number | null> {
    if (!country || !city || !agencyName) {
        throw new Error("Missing Agency Data");
    }

    try {
        // First get the agency by ID
        const response = await fetch(`${API_DOMAIN}/agencies/get-agency-by-id/${agencyName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get agency id");
        }

        const data = await response.json();
        if (!data) {
            throw new Error("Failed to get agency id");
        }

        // Verify that the agency belongs to the correct city and country
        if (data.address.city.id.toString() !== city || 
            data.address.city.country.id.toString() !== country) {
            throw new Error("Agency does not match the selected city and country");
        }

        return data.id;
    } catch (error) {
        console.error("Error getting agency id:", error);
        throw error;
    }
}

/**
 * Link client to agency
 * @param agencyId
 * @param clientId
 * @returns boolean
 */
export async function linkClientToAgency(agencyId: number, clientId: number): Promise<boolean> {
    if (!agencyId || !clientId) {
        throw new Error("Missing Agency or Client Data");
    }

    try {
        const response = await fetch(`${API_DOMAIN}/agencies/link-client`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agencyId: agencyId,
                clientId: clientId
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to link client to agency");
        }
        return true;
    } catch (error) {
        throw error;
    }
}

export async function unlinkClientFromAgency(agencyId: number, clientId: number): Promise<boolean> {
    if (!agencyId || !clientId) {
        throw new Error("Missing Agency or Client Data");
    }

    try {
        const params = new URLSearchParams({
            agencyId: agencyId.toString(),
            clientId: clientId.toString(),
        });

        const response = await fetch(`${API_DOMAIN}/agencies/unlink-client?${params}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to unlink client from agency");
        }
        return true;
    } catch (error) {
        throw error;
    }
}

/**
 * Get agency by id
 * @param id
 * @returns AgencyDto | Error : AgencyDto if successful, Error if not
 */
export async function getAgencyById(id: number): Promise<AgencyResponseDto | Error> {
    if (!id) {
        return new Error("Missing Agency ID");
    }
    try {
        const response = await fetch(`${API_DOMAIN}/agencies/get-agency-by-id/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get agency by id");
        }

        const data = await response.json();
        if (!data) {
            throw new Error("Failed to get agency by id");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Create agency
 * @param agencyData
 * @returns AgencyResponseDto | Error : AgencyResponseDto if successful, Error if not   */
export async function createAgency(agencyData: CreateAgencyDto): Promise<AgencyResponseDto | Error> {
    if (!agencyData) {
        return new Error("Missing Agency Data");
    }

    try {
        const response = await fetch(`${API_DOMAIN}/agencies/create-agency`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agencyData),
        });

        if (!response.ok) {
            throw new Error("Failed to create agency");
        }

        const data = await response.json();
        if (!data) {
            throw new Error("Failed to create agency");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Update agency
 * @param agencyData
 * @returns AgencyResponseDto | Error: AgencyResponseDto if successful, Error if not   */
export async function updateAgency(agencyData: CreateAgencyDto): Promise<AgencyResponseDto | Error> {
    if (!agencyData) {
        return new Error("Missing Agency Data");
    }
    try {
        const response = await fetch(`${API_DOMAIN}/agencies/update-agency`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agencyData),
        });

        if (!response.ok) {
            throw new Error("Failed to update agency");
        }

        const data = await response.json();
        if (!data) {
            throw new Error("Failed to update agency");
        }
        return data;
    } catch (error) {
        throw error;
    }
}




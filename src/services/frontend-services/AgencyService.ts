// path: src/services/frontend-services/AgencyService.ts
'use server';

import axios from 'axios';
import {API_DOMAIN, DOMAIN} from "@/utils/constants";
import {AgencyDto} from "@/services/dtos";


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
        const response = await axios.get(`${API_DOMAIN}/agencies/findAgency`, {
            params: {
                country: country,       // expects a numeric string
                city: city,
                agency_name: agencyName,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            throw new Error("Failed to get agency id");
        }

        const data = response.data;
        if (!data) {
            throw new Error("Failed to get agency id");
        }

        return data.agencyId;
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
        const response = await axios.post(`${DOMAIN}/api/v1/agencies/link-client`, {
            agencyId: agencyId,
            clientId: clientId
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (response.status !== 200) {
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
        const response = await axios.delete(`${DOMAIN}/api/v1/agencies/unlink-client`, {
            params: {
                agencyId: agencyId,
                clientId: clientId
            },
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (response.status !== 200) {
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
export async function getAgencyById(id: number): Promise<AgencyDto | Error> {
    if (!id) {
        return new Error("Missing Agency ID");
    }
    try {
        const response = await axios.get(`${API_DOMAIN}/agencies/get-agency-by-id`, {
            params: {
                id: id
            },
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.status !== 200) {
            throw new Error("Failed to get agency by id");
        }

        const data = response.data;

        if (!data) {
            throw new Error("Failed to get agency by id");
        }

        return data;

    } catch (error) {
        throw error;
    }
}




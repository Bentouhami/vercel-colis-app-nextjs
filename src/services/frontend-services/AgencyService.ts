// path: src/services/frontend-services/AgencyService.ts
'use server';

import axios from 'axios';
import { DOMAIN } from "@/utils/constants";

/**
 * Get agency id by country, city, and agency name
 * @param country
 * @param city
 * @param agencyName
 * @returns Agency ID
 */
export async function getAgencyId(country: string, city: string, agencyName: string): Promise<number | null> {

    if (!country || !city || !agencyName) {
        throw new Error("Missing Agency Data");
    }

    try {
        const response = await axios.get(`${DOMAIN}/api/v1/agencies/findAgency`, {
            params: {
                country: country,
                city: city,
                agency_name: agencyName
            },
            headers: {
                "Content-Type": "application/json",
            }
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




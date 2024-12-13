// path: src/services/frontend-services/Bk_AgencyService.ts
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
export async function getAgencyIdByCountryAndCityAndAgencyName(country: string, city: string, agencyName: string): Promise<number> {
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




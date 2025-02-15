// Path: src/services/frontend-services/envoi/EnvoiService.ts

import {DOMAIN} from "@/utils/constants";
import {EnvoiDto, EnvoisListDto} from "@/services/dtos";
import axios from "axios";

/**
 * get envoi by id
 *  @return EnvoiDto if exits or null otherwise
 * @param envoiId
 */
export async function updateEnvoiDatas(envoiId: number): Promise<boolean> {
    if (!envoiId) {
        throw new Error("Invalid envoi ID");
    }

    try {
        console.log("log ====> envoiId in updateEnvoiDatas function called in path: src/services/frontend-services/envoi/EnvoiService.ts is : ", envoiId);

        const response = await axios.put(`${DOMAIN}/api/v1/envois/${envoiId}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                cache: "no-cache",
                pragma: "no-cache",
            }
        });

        if (!response.data) {
            console.log("log ====> response.data not found in updateEnvoiDatas function");
            return false;
        }

        console.log("log ====> updateEnvoiDatas successful response.data in path: src/services/frontend-services/envoi/EnvoiService.ts is : ", response.data);
        return true;
    } catch (error) {
        console.error("Error updating envoi:", error);
        throw error;
    }
}

/**
 * get envoi by id
 *  @return EnvoiDto if exits or null otherwise
 * @param envoiId
 */
export async function getEnvoiById(envoiId: number): Promise<EnvoiDto | null> {
    if (!envoiId) {
        throw new Error("Invalid envoi ID");
    }

    try {
        console.log("log ====> envoiId in getEnvoiById function called in path: src/services/frontend-services/envoi/EnvoiService.ts is : ", envoiId);

        const response = await axios.get(`${DOMAIN}/api/v1/envois/${envoiId}`, {
            headers: {
                'Content-Type': 'application/json',
                cache: "no-cache",
                pragma: "no-cache",
            }
        });

        if (!response.data) {
            return null;
        }
        console.log("log ====> getEnvoiById successful response.data in path: src/services/frontend-services/envoi/EnvoiService.ts is : ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting envoi:", error);
        throw error;
    }
}


export async function fetchUserDeliveries(userId: string): Promise<EnvoisListDto[]> {
    const response = await axios.get(`${DOMAIN}/api/v1/envois/user/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            cache: "no-cache",
            pragma: "no-cache",
        }
    });
    // Ensure the response is an array
    return Array.isArray(response.data) ? response.data : [response.data];
}

export async function createEnvoi(envoi: EnvoiDto): Promise<EnvoiDto> {
    const response = await axios.post(`${DOMAIN}/api/v1/envois`, envoi, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.data;
}

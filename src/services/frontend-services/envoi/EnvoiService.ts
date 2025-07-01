// Path: src/services/frontend-services/envoi/EnvoiService.ts

import {API_DOMAIN} from "@/utils/constants";
import {EnvoiDto, EnvoisListDto, ProfileDto} from "@/services/dtos";
import axios from "axios";
import {PaymentSuccessDto} from "@/services/dtos/envois/PaymentSuccessDto";

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
        const response = await axios.put(`${API_DOMAIN}/envois/${envoiId}`);

        return response.data;


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
export async function getEnvoiById(envoiId: number): Promise<PaymentSuccessDto | null> {
    if (!envoiId) {
        throw new Error("Invalid envoi ID");
    }

    try {

        const response = await axios.get(`${API_DOMAIN}/envois/${envoiId}`, {
            headers: {
                'Content-Type': 'application/json',
                cache: "no-cache",
                pragma: "no-cache",
            }
        });


        if (!response.data) {
            return null;
        }
        return response.data;
    } catch (error) {
        console.error("Error getting envoi:", error);
        throw error;
    }
}

export async function fetchUserDeliveries(userId: string | number | null, page: number = 1, limit: number = 5): Promise<{
    data: EnvoisListDto[],
    total: number
}> {
    try {
        const response = await axios.get(`${API_DOMAIN}/envois/user/${userId}?page=${page}&limit=${limit}`, {
            headers: {
                'Content-Type': 'application/json',
                cache: "no-cache",
                pragma: "no-cache",
            }
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return {data: [], total: 0};
        } else {
            throw new Error("Failed to fetch deliveries");
        }
    }
}


export async function createEnvoi(envoi: EnvoiDto): Promise<EnvoiDto> {
    const response = await axios.post(`${API_DOMAIN}/envois`, envoi, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.data;
}

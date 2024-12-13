// path: src/services/frontend-services/TarifsService.ts
import {TarifsDto} from "@/services/dtos";
import {DOMAIN} from "@/utils/constants";
import axios from "axios";
export async function getTarifs(): Promise<TarifsDto> {
    try {
        const response = await axios.get(`${DOMAIN}/api/v1/tarifs`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data as TarifsDto;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error getting tarifs:', error.message);

            if (error.response) {
                console.error('Server error response:', error.response.data);
                throw new Error(error.response.data?.error || 'Failed to get tarifs from the server');
            } else if (error.request) {
                console.error('No response from server:', error.request);
                throw new Error('No response from server. Please check your network connection.');
            }
        }

        console.error('Unexpected error getting tarifs:', error);
        throw new Error('An unexpected error occurred while getting tarifs');
    }
}


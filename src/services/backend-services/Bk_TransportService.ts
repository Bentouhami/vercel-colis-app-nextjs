// path: src/services/backend-services/Bk_TransportService.ts

import {TransportResponseDto, UpdateTransportRequestDto} from "@/services/dtos";
import {transportRepository} from "@/services/repositories/transports/TransportRepository";

/**
 * get transports
 * @returns TransportResponseDto[] | null - array of transports or null if not found
 */
export async function getTransports(): Promise<TransportResponseDto[] | null> {
    try {
        const response = await transportRepository.getTransports();
        if (!response) {
            return null;
        }
        return response;
    } catch (error) {
        console.error("Error getting transports:", error);
        throw error;
    }
}

/**
 * update transport
 * @param transport - The transport data to update.
 * @returns The updated transport.
 */
export async function updateTransport(transport: UpdateTransportRequestDto): Promise<TransportResponseDto | null> {
    try {
        const response = await transportRepository.updateTransport(transport);
        if (!response) {
            return null;
        }
        return response;
    } catch (error) {
        console.error("Error updating transport:", error);
        throw error;
    }
}
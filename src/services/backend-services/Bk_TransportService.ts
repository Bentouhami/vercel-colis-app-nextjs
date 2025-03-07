// path: src/services/backend-services/Bk_TransportService.ts

import {ProfileDto, TransportResponseDto, UpdateTransportRequestDto} from "@/services/dtos";
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

    if (!transport) {
        throw new Error("Invalid transport data");
    }
    console.log("log ====> updateTransport function called in src/services/frontend-services/transport/TransportService.ts");
    try {
        const response = await transportRepository.updateTransport(transport);
        if (!response) {
            console.log("log ====> response not found in updateTransport function");

            return null;
        }
        console.log("log ====> response found in updateTransport function after updating transport in path: src/services/frontend-services/transport/TransportService.ts is : ", response);

        return response;
    } catch (error) {
        console.error("Error updating transport:", error);
        throw error;
    }
}

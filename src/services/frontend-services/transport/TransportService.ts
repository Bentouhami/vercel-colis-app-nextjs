// path: src/services/frontend-services/transport/TransportService.ts

import {CreateTransportRequestDto, TransportResponseDto, UpdateTransportRequestDto} from "@/services/dtos";
import {DOMAIN} from "@/utils/constants";
import axios from "axios";


/**
 * get available transports in db
 * @function getTransports
 * @return Promise TransportResponseDto[] | null - array of transports or null if not found
 */
export async function getTransports(): Promise<TransportResponseDto[] | null> {

    console.log("log ====> getTransports function called in src/services/frontend-services/transport/TransportService.ts");

    try {
        // using axios to make the request
        const response = await axios.get(`${DOMAIN}/api/v1/transports`);
        if (!response.data) {
            console.log("log ====> response not found in getTransports function");
            return null
        }
        console.log("log ====> response found in getTransports function after getting transports in path: src/services/frontend-services/transport/TransportService.ts is : ", response.data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

/**
 * get a transport by id
 * @return TransportResponseDto
 * @param transportId
 */
export async function getTransportById(transportId: number): Promise<TransportResponseDto> {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/transports/${transportId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get transport");
        }

        const data = await response.json();

        if (!data) {
            throw new Error("Failed to get transport");
        }

        return data.data as TransportResponseDto;
    } catch (error) {
        throw error;
    }
}

/**
 * create transport in the db
 * @param transport type of CreateTransportRequestDto
 * @return the created transport as TransportResponseDto type
 */
export async function createTransport(transport: CreateTransportRequestDto): Promise<TransportResponseDto> {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/transports`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transport),
        });

        if (!response.ok) {
            throw new Error("Failed to create transport");
        }

        const data = await response.json();

        if (!data) {
            throw new Error("Failed to create transport");
        }

        return data.data as TransportResponseDto;
    } catch (error) {
        throw error;
    }
}

/**
 * Update transport.
 * @param transport - The transport data to update.
 * @returns The updated transport.
 */
export async function updateTransport(transport: UpdateTransportRequestDto): Promise<TransportResponseDto> {

    if (!transport) {
        throw new Error("Invalid transport data");
    }
    console.log("log ====> updateTransport function called in src/services/frontend-services/transport/TransportService.ts with transport: ", transport);
    try {
        console.log("log ====> transport in updateTransport function called in path: src/services/frontend-services/transport/TransportService.ts is : ", transport);
        // Use axios.put to send the PUT request
        const response = await axios.put(`${DOMAIN}/api/v1/transports`, transport);

        if (!response.data || !response.data.data) {
            console.log("log ====> response not found in updateTransport function");
            throw new Error("Unexpected response format");
        }


        console.log("log ====> response found in updateTransport function after updating transport in path: src/services/frontend-services/transport/TransportService.ts is : ", response.data.data);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Failed to update transport");
        } else {
            console.error("Unexpected error:", error);
            throw error;
        }
    }
}

/**
 * delete a transport
 * @param id
 */
export async function deleteTransport(id: number): Promise<void> {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/transports/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete transport");
        }

        const data = await response.json();

        if (!data) {
            throw new Error("Failed to delete transport");
        }

    } catch (error) {
        throw error;
    }
}

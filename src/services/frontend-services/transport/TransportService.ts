// path: src/services/frontend-services/transport/TransportService.ts

import {CreateTransportRequestDto, TransportResponseDto, UpdateTransportRequestDto} from "@/services/dtos";
import {API_DOMAIN, DOMAIN} from "@/utils/constants";
import axios from "axios";


/**
 * get available transports in db
 * @function getTransports
 * @return Promise TransportResponseDto[] | null - array of transports or null if not found
 */
export async function getTransports(): Promise<TransportResponseDto[] | null> {


    try {
        // using axios to make the request
        const response = await axios.get(`${DOMAIN}/api/v1/transports`);
        if (!response.data) {
            return null
        }
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
        const response = await fetch(`${API_DOMAIN}/transports/${transportId}`, {
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
        const response = await fetch(`${API_DOMAIN}/transports`, {
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
    try {
        // Use axios.put to send the PUT request
        const response = await axios.put(`${API_DOMAIN}/transports`, transport);

        if (!response.data || !response.data.data) {
            throw new Error("Unexpected response format");
        }


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
        const response = await fetch(`${API_DOMAIN}/transports/${id}`, {
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

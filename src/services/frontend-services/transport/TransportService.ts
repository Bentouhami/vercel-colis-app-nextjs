// path: src/services/frontend-services/transport/TransportService.ts

import {BaseTransportDto, TransportDto} from "@/utils/dtos";
import {DOMAIN} from "@/utils/constants";

export async function getTransports(): Promise<TransportDto[]> {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/transports`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get transports");
        }

        const data = await response.json();

        if (!data) {
            throw new Error("Failed to get transports");
        }

        return data.data as TransportDto[];
    } catch (error) {
        throw error;
    }
}

export async function getTransportById(id: number): Promise<TransportDto> {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/transports/${id}`, {
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

        return data.data as TransportDto;
    } catch (error) {
        throw error;
    }
}

export async function createTransport(transport: BaseTransportDto): Promise<TransportDto> {
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

        return data.data as TransportDto;
    } catch (error) {
        throw error;
    }
}

export async function updateTransport(transport: BaseTransportDto): Promise<TransportDto> {
    try {
        const response = await fetch(`${DOMAIN}/api/v1/transports`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transport),
        });

        if (!response.ok) {
            throw new Error("Failed to update transport");
        }

        const data = await response.json();

        if (!data) {
            throw new Error("Failed to update transport");
        }

        return data.data as TransportDto;
    } catch (error) {
        throw error;
    }
}

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

        return data.data as TransportDto;
    } catch (error) {
        throw error;
    }
}

// path: src/services/frontend-services/transport/TransportServiceCalc.ts
import {SimulationSummaryDto, TransportResponseDto} from "@/services/dtos";
import {getTransports} from "@/services/frontend-services/transport/TransportService";
import {MAX_ENVOI_VOLUME, MAX_ENVOI_WEIGHT} from '@/utils/constants';

/**
 * Finds suitable transport for the simulation based on volume, weight, and availability.
 * Updates the transport's availability if it no longer satisfies constraints for maximum shipment.
 * @param simulation - The simulation data containing volume and weight details.
 * @returns A suitable transport if found; otherwise, null.
 */
export async function findSuitableTransport(
    simulation: SimulationSummaryDto
): Promise<TransportResponseDto | null> {
    if (!simulation) {
        console.error("Simulation data is missing.");
        return null;
    }

    // Fetch transports from the data source
    const transports = await getTransports();

    // Check if there are any available transports
    if (!transports || transports.length === 0) {
        console.warn("No transports available.");
        return null;
    }

    const {totalVolume, totalWeight} = simulation;

    // Find a suitable transport
    const suitableTransport = transports.find((transport) => {
        // Skip transport if it is not available
        if (!transport.isAvailable) {
            return false;
        }

        // Calculate remaining volume and weight
        const remainingVolume = transport.baseVolume - transport.currentVolume;
        const remainingWeight = transport.baseWeight - transport.currentWeight;

        // Check if the transport can accommodate the simulation
        return (
            remainingVolume >= totalVolume &&
            remainingWeight >= totalWeight &&
            transport.isAvailable
        );
    });

    if (!suitableTransport) {
        console.info("No suitable transport found.");
        return null;
    }

    // Update the transport's current volume and weight
    suitableTransport.currentVolume += totalVolume;
    suitableTransport.currentWeight += totalWeight;

    // Recheck availability after update
    const remainingVolume = suitableTransport.baseVolume - suitableTransport.currentVolume;
    const remainingWeight = suitableTransport.baseWeight - suitableTransport.currentWeight;

    // If the transport cannot accommodate a maximum shipment, mark it as unavailable
    if (remainingWeight < MAX_ENVOI_WEIGHT || remainingVolume < MAX_ENVOI_VOLUME) {
        suitableTransport.isAvailable = false;
        console.warn(
            `Transport ${suitableTransport.id} marked as unavailable due to insufficient capacity.`
        );
    }

    // Return the suitable transport
    return suitableTransport;
}


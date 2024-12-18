// path: src/services/frontend-services/transport/TransportServiceCalc.ts

import {SimulationSummaryDto, TransportResponseDto} from "@/services/dtos";
import {getTransports} from "@/services/backend-services/Bk_TransportService";
import {updateTransport} from "@/services/frontend-services/transport/TransportService";

/**
 * find suitable transport for simulation based on current volume and weight of transports and simulation
 * @param simulation
 */
export async function findSuitableTransport(simulation: SimulationSummaryDto): Promise<TransportResponseDto | null> {
    if (!simulation) {
        console.error("Simulation not found");
        return null;
    }

    // Get transports
    const transports = await getTransports();
    // Verify if there are any transports available
    if (!transports || transports.length === 0) {
        console.error("No transports available");
        return null;
    }

    // destructure simulation data to get total volume and weight
    const {totalVolume, totalWeight} = simulation;

    // Find a transport that can accommodate the simulation
    const suitableTransport = transports.find((transport) => {

        // Check if the transport has enough volume and weight remaining
        const remainingVolume = transport.baseVolume - transport.currentVolume;

        const remainingWeight = transport.baseWeight - transport.currentWeight;

        // Check if the transport is available
        return remainingVolume >= totalVolume && remainingWeight >= totalWeight && transport.isAvailable;
    });

    if(!suitableTransport) {
        console.error("No suitable transport found");
        return null;
    }

    // set the new transport summary
    if (suitableTransport) {
        suitableTransport.currentVolume += totalVolume;
        suitableTransport.currentWeight += totalWeight;
    }


    // update transport current volume and weight
    // update transport current volume and weight
    const updatedTransport = await updateTransport(suitableTransport);
    if (!updatedTransport) {
        console.error("Failed to update transport current volume and weight");
        return null;
    }


    return suitableTransport ? suitableTransport : null;
}


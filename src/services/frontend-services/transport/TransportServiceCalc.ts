// path: src/services/frontend-services/transport/TransportServiceCalc.ts

import {SimulationSummaryDto, TransportResponseDto} from "@/services/dtos";
import {getTransports, updateTransport} from "@/services/frontend-services/transport/TransportService";

/**
 * find suitable transport for simulation based on current volume and weight of transports and simulation
 * @param simulation
 */
export async function findSuitableTransport(simulation: SimulationSummaryDto): Promise<TransportResponseDto | null> {

    if (!simulation) {
        console.error("Simulation not found");
        return null;
    }

    console.log("log ====> simulation in findSuitableTransport function called in path: src/services/frontend-services/transport/TransportServiceCalc.ts is : ", simulation);

    // Get transports
    const transports = await getTransports();
    // Verify if there are any transports available
    if (!transports || transports.length === 0) {
        console.error("No transports available");
        return null;
    }

    console.log("log ====> transports in findSuitableTransport function called in path: src/services/frontend-services/transport/TransportServiceCalc.ts is : ", transports);

    // destructure simulation data to get total volume and weight
    const {totalVolume, totalWeight} = simulation;

    console.log("log ====> totalVolume in findSuitableTransport function called in path: src/services/frontend-services/transport/TransportServiceCalc.ts is : ", totalVolume);

    console.log("log ====> totalWeight in findSuitableTransport function called in path: src/services/frontend-services/transport/TransportServiceCalc.ts is : ", totalWeight);
    // Find a transport that can accommodate the simulation
    const suitableTransport = transports.find((transport) => {

        // Check if the transport has enough volume and weight remaining
        const remainingVolume = transport.baseVolume - transport.currentVolume;

        console.log("log ====> remainingVolume in findSuitableTransport function called in path: src/services/frontend-services/transport/TransportServiceCalc.ts is : ", remainingVolume);

        const remainingWeight = transport.baseWeight - transport.currentWeight;

        console.log("log ====> remainingWeight in findSuitableTransport function called in path: src/services/frontend-services/transport/TransportServiceCalc.ts is : ", remainingWeight);
        // Check if the transport is available
        return remainingVolume >= totalVolume && remainingWeight >= totalWeight && transport.isAvailable;
    }) ;



    if (!suitableTransport) {
        console.error("No suitable transport found");
        return null;
    }

    console.log("log ====> suitableTransport in findSuitableTransport function called in path: src/services/frontend-services/transport/TransportServiceCalc.ts is : ", suitableTransport);

    // set the new transport summary
    if (suitableTransport) {
        suitableTransport.currentVolume += totalVolume;
        suitableTransport.currentWeight += totalWeight;
    }

    return suitableTransport;

}


// path: src/services/backend-services/Bk_SimulationService.ts
'use server';
import {
    CreatedSimulationResponseDto,
    CreateSimulationRequestDto,
    SimulationResponseDto,
    SimulationSummaryDto,
    UpdateEditedSimulationDto,
} from "@/services/dtos";
import prisma from "@/utils/db";
import {simulationRepository} from "@/services/repositories/simulations/SimulationRepository";
import {agencyRepository} from "@/services/repositories/agencies/AgencyRepository";
import {parcelRepository} from "@/services/repositories/parcels/ParcelRepository";

/**
 * get simulation by id
 * @return found simulation as a type of SimulationResponseDto or null if not found
 * @param simulationId
 */
export async function getSimulationById(simulationId: number): Promise<SimulationResponseDto | null> {
    try {
        // 1. Get simulation by using repository
        const simulation = await simulationRepository.getSimulationResponseById(simulationId);

        return simulation ? simulation : null;
    } catch (error) {
        console.error('Error getting simulation:', error);
        throw error;
    }
}

/**
 * create a simulation
 * @param simulationData type of CreateSimulationRequestDto
 * @return the created simulation as type or CreatedSimulationResponseDto
 */
export async function createSimulation(simulationData: CreateSimulationRequestDto): Promise<CreatedSimulationResponseDto | null> {

    if (!simulationData.departureAgencyId) {
        return null;
    }
    try {
        // Fetch the departure agency using its ID
        const departureAgency = await agencyRepository.getAgencyById(simulationData.departureAgencyId);
        if (!departureAgency) {
            throw new Error("Departure agency not found");
        }

        // Fetch the arrival agency using its ID
        if (!simulationData.arrivalAgencyId) {
            return null;
        }
        const arrivalAgency = await agencyRepository.getAgencyById(simulationData.arrivalAgencyId);
        if (!arrivalAgency) {
            throw new Error("Arrival agency not found");
        }

        // IMPORTANT: Check the nested fields properly.
        if (!departureAgency.address.city.name || !departureAgency.address.city.country.name) {
            throw new Error("Departure agency country or city is missing.");
        }

        if (!arrivalAgency.address.city.name || !arrivalAgency.address.city.country.name) {
            throw new Error("Arrival agency country or city is missing.");
        }


        const createdSimulationResponse = await simulationRepository.createSimulation(simulationData);


        if (!createdSimulationResponse) {
            return null;
        }
        return createdSimulationResponse;

    } catch (error) {
        console.error("Erreur lors de la sauvegarde de la simulation:", error);
        throw error;
    }
}


/**
 * Update the user ID of a simulation
 * @param id - The ID of the simulation to update
 * @param userId - The new user ID
 * @returns {Promise<void | null>} A Promise that resolves when the user ID is updated
 */
export async function updateSimulationUserId(id: number, userId: number): Promise<void | null> {

    try {
        const response = await simulationRepository.updateSimulationUserId(id, userId);

        if (!response) {
            return null;
        }


    } catch (error) {
        console.error('Error updating user id in simulation:', error);
        throw new Error("Error updating simulation");
    }
}


/**
 * Update the destinataire ID of a simulation
 * @param simulationId - The ID of the simulation to update
 * @param destinataireId - The new destinataire ID
 * @returns {Promise<void | null>} A Promise that resolves when the destinataire ID is updated
 */
export async function updateSimulationDestinataireId(simulationId: number, destinataireId: number): Promise<boolean> {

    if (!simulationId || !destinataireId) {
        throw new Error("Invalid simulation or destinataire ID");
    }

    try {
        const response = await simulationRepository.updateSimulationDestinataireId(simulationId, destinataireId);

        return response ? response : false;

    } catch (error) {
        console.error('Error updating destinataire id in simulation:', error);
        throw new Error("Error updating simulation");
    }
}

/**
 * update paid simulation
 * @param simulation as type of SimulationResponseDto
 * @param simulationIdAndToken as type of CreatedSimulationResponseDto
 */
export async function updatePaidEnvoi(simulation: SimulationResponseDto, simulationIdAndToken: CreatedSimulationResponseDto) {
    try {

        if (!simulationIdAndToken) {
            throw new Error("Simulation ID and token not found");
        }

        if (!simulation) {
            throw new Error("Simulation not found");
        }

        if (!simulation.simulationStatus || !simulation.envoiStatus) {
            throw new Error("Simulation envoiStatus or envoiStatus not found");
        }

        await prisma.envoi.update({
            where: {
                id: Number(simulationIdAndToken.id),
                verificationToken: simulationIdAndToken.verificationToken
            },
            data: {
                envoiStatus: simulation.envoiStatus,
                simulationStatus: simulation.simulationStatus,
                paid: true
            }

        });
    } catch (error) {
        console.error("Error updating simulation", error);
        throw new Error("Error updating simulation");
    }
}

/**
 * update simulation and parcels
 * @param simulationData
 * @return void or null
 */
export async function updateSimulationAndParcels(simulationData: UpdateEditedSimulationDto): Promise<void | null> {


    if (!simulationData || !simulationData.id) {
        throw new Error("Invalid simulation data");
    }

    const {id, parcels, ...simulationFields} = simulationData;

    // Ensure parcels are provided
    if (!parcels || parcels.length === 0) {
        throw new Error("Parcels data is required");
    }

    try {
        // 1. Delete all existing parcels for this simulation
        await parcelRepository.deleteParcelsBySimulationId(id);

        // 2. Add new parcels
        const parcelsToCreate = parcels.map((parcel) => ({
            height: parcel.height,
            width: parcel.width,
            length: parcel.length,
            weight: parcel.weight,
            envoiId: id, // linking parcels to the simulation
        }));
        await parcelRepository.createParcels(parcelsToCreate);

        // 3. Update simulation fields
        await simulationRepository.updateSimulation(simulationData.id, simulationFields);
    } catch (error) {
        console.error("Error updating simulation and replacing parcels:", error);
        throw new Error("Failed to update simulation and replace parcels");
    }

}

/**
 * get simulation summary
 * @param simulationId
 */
export async function getSimulationSummary(simulationId: number): Promise<SimulationSummaryDto | null> {

    if (!simulationId) return null;
    try {
        // get simulation summary
        const simulationSummary = await simulationRepository.getSimulationSummary(simulationId);

        if (!simulationSummary) return null;

        return simulationSummary;
    } catch (error) {
        console.error("Error getting simulation summary:", error);
        throw error;
    }
}

export async function updateSimulationTransportId(simulationId: number, transportId: number): Promise<boolean> {

    if (!simulationId || !transportId) {

        throw new Error("Invalid simulation or transport ID");
    }

    try {
        return await simulationRepository.updateSimulationTransportId(simulationId, transportId);

    } catch (error) {

        console.error("Error updating simulation transportId:", error);
        throw error;
    }
}



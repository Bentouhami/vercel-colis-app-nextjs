// path: src/services/backend-services/Bk_SimulationService.ts
'use server';
import {
    CreatedSimulationResponseDto,
    CreateSimulationRequestDto,
    FullSimulationDto,
    SimulationResponseDto,
    UpdateEditedSimulationDto,
} from "@/services/dtos";
import prisma from "@/utils/db";
import {simulationRepository} from "@/services/repositories/simulations/SimulationRepository";
import {agencyRepository} from "@/services/repositories/agencies/AgencyRepository";
import {parcelRepository} from "@/services/repositories/parcels/ParcelRepository";



export async function getSimulationById(id: number): Promise<SimulationResponseDto | null> {

    try {
        // 1. Get simulation by using repository
        const simulation = await simulationRepository.getSimulationResponseById(id);

        if (!simulation) {
            return null;
        }
        return simulation;
    } catch (error) {
        console.error('Error getting simulation:', error);
        throw error;
    }
}

export async function saveSimulation(simulationData: CreateSimulationRequestDto): Promise<CreatedSimulationResponseDto | null> {
    console.log("log ====> simulationData in saveSimulation function called in src/services/backend-services/Bk_SimulationService.ts: ", simulationData);

    if (!simulationData.departureAgencyId) {
        return null;
    }
    try {
        const departureAgency = await agencyRepository.getAgencyById(simulationData.departureAgencyId);

        // 3. get arrived date city, country and agency name from simulation by agencyId
        if (!simulationData.arrivalAgencyId) {
            return null;
        }
        const arrivalAgency = await agencyRepository.getAgencyById(simulationData.arrivalAgencyId);

        // 4. prepare needed data for simulation calculation and envoiStatus
        if (!departureAgency || !arrivalAgency) {
            return null;
        }

        console.log("log ====> departureAgency in saveSimulation function called in src/services/backend-services/Bk_SimulationService.ts: ", departureAgency);
        console.log("log ====> arrivalAgency in saveSimulation function called in src/services/backend-services/Bk_SimulationService.ts: ", arrivalAgency);

        if (!departureAgency.address.country || !departureAgency.address.city) {
            throw new Error("Departure agency country or city is missing.");
        }

        if (!arrivalAgency.address.country || !arrivalAgency.address.city) {
            throw new Error("Arrival agency country or city is missing.");
        }

        console.log("log ====> simulationData after getting agencies ids in saveSimulation function in path: src/services/backend-services/Bk_SimulationService.ts is : ", simulationData)


        const simulation = await simulationRepository.createSimulation(simulationData);

        if (!simulation) {
            return null;
        }
        return simulation;

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
 * @param id - The ID of the simulation to update
 * @param destinataireId - The new destinataire ID
 * @returns {Promise<void | null>} A Promise that resolves when the destinataire ID is updated
 */
export async function updateSimulationDestinataireId(id: number, destinataireId: number): Promise<void | null> {

    try {
        await simulationRepository.updateSimulationDestinataireId(id, destinataireId);

    } catch (error) {
        console.error('Error updating destinataire id in simulation:', error);
        throw new Error("Error updating simulation");
    }
}


export async function updatePaidEnvoi(simulation: SimulationResponseDto, simulationIdAndToken: CreatedSimulationResponseDto) {
    console.log("log ====> updateSimulation function called in src/services/backend-services/Bk_SimulationService.ts", simulation);
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

export async function updateSimulationAndParcels(simulationData: UpdateEditedSimulationDto): Promise<void | null> {

    console.log("log ====> simulationData in updateSimulationAndParcels function called in path: src/services/backend-services/Bk_SimulationService.ts: ", simulationData);


    if (!simulationData || !simulationData.id) {
        throw new Error("Invalid simulation data");
    }

    const { id, parcels, ...simulationFields } = simulationData;

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



        console.log("Simulation and parcels replaced successfully");
    } catch (error) {
        console.error("Error updating simulation and replacing parcels:", error);
        throw new Error("Failed to update simulation and replace parcels");
    }


}





// path: src/services/repositories/SimulationRepository.ts

import {ISimulationRepository} from "@/services/repositories/simulations/ISimulationRepository";
import {
    CreatedSimulationResponseDto,
    CreateSimulationRequestDto,
    SimulationResponseDto,
    UpdateEditedSimulationDto
} from "@/services/dtos";
import {simulationDAO} from "@/services/dal/DAO/simulations/SimulationDAO";
import {SimulationMapper} from "@/services/mappers/SimulationMapper";

export class SimulationRepository implements ISimulationRepository {
    createParcels(parcelsToCreate: {
        height: number;
        width: number;
        length: number;
        weight: number;
        envoiId: number;
    }[]) {
        throw new Error("Method not implemented.");
    }

    async getSimulationResponseById(id: number): Promise<SimulationResponseDto | null> {
        if (!id) {
            return null;
        }

        // Call the DAO to get the simulation
        try {
            const simulation = await simulationDAO.getSimulationResponseById(id);

            // Check if the simulation exists
            if (!simulation) {
                return null;
            }

            // Map the simulation to a SimulationRequestDto and return it
            return SimulationMapper.toSimulationResponseDto(simulation);

            // Handle any errors that may occur during the mapping process
        } catch (error) {
            console.error("Error getting simulation:", error);
            throw error;
        }
    }

    async createSimulation(simulationData: CreateSimulationRequestDto): Promise<CreatedSimulationResponseDto | null> {

        if (!simulationData) {
            throw new Error("Simulation data not found");
        }

        try {
            const simulation = await simulationDAO.createSimulation(simulationData);

            if (!simulation) {
                return null;
            }

            return SimulationMapper.toCreatedSimulationResponseDto(simulation);

        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la simulation:", error);
            throw error;
        }

    }

    async updateSimulationUserId(id: number, userId: number): Promise<void | null> {
        const response = await simulationDAO.updateSimulationUserId(id, userId);

        if (!response) {
            return null;
        }

    }

    async updateSimulationDestinataireId(id: number, destinataireId: number): Promise<void | null> {
        await simulationDAO.updateSimulationDestinataireId(id, destinataireId);

    }

    async updateSimulation(simulationId: number, simulation: any): Promise<void | null> {
        await simulationDAO.updateSimulation(simulationId, simulation);

    }

    async getSimulationWithParcelsById(id: number): Promise<any | null> {
        return await simulationDAO.getSimulationWithParcelsById(id);
    }
}

export const simulationRepository = new SimulationRepository();
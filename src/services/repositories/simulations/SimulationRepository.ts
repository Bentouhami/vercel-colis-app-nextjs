// path: src/services/repositories/SimulationRepository.ts

import {ISimulationRepository} from "@/services/repositories/simulations/ISimulationRepository";
import {SimulationResponseDto} from "@/services/dtos";
import {simulationDAO} from "@/services/dal/DAO/simulations/SimulationDAO";
import {SimulationMapper} from "@/services/mappers/SimulationMapper";

export class SimulationRepository implements ISimulationRepository {
    async getSimulationById(id: number): Promise<SimulationResponseDto | null> {
        // Check if the id is valid
        if (!id) {
            return null;
        }

        // Call the DAO to get the simulation
        try {
            const simulation = await simulationDAO.getSimulationById(id);

            // Check if the simulation exists
            if (!simulation) {
                return null;
            }

            // Map the simulation to a SimulationRequestDto and return it
            return SimulationMapper.toSimulationRequestDto(simulation);

            // Handle any errors that may occur during the mapping process
        } catch (error) {
            console.error("Error getting simulation:", error);
            throw error;
        }
    }
}

export const simulationRepository = new SimulationRepository();
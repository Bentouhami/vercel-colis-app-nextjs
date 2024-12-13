// path: src/services/interfaces/ISimulationRepository.ts

import {SimulationResponseDto} from "@/services/dtos";


export interface ISimulationRepository {
    /**
     * Retrieves a simulation by its ID
     * @param id The unique identifier of the simulation
     * @returns A SimulationRequestDto or null if not found
     */
    getSimulationById(id: number): Promise<SimulationResponseDto | null>;

    // You can add more method signatures as needed
    // For example:
    // createSimulation(simulation: CreateSimulationDto): Promise<SimulationRequestDto>;
    // updateSimulation(id: number, data: UpdateSimulationDto): Promise<SimulationRequestDto>;
    // deleteSimulation(id: number): Promise<boolean>;
}
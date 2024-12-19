// path: src/services/interfaces/ISimulationRepository.ts

import {CreatedSimulationResponseDto, CreateSimulationRequestDto, SimulationResponseDto} from "@/services/dtos";


export interface ISimulationRepository {
    /**
     * Retrieves a simulation by its ID
     * @param id The unique identifier of the simulation
     * @returns A SimulationRequestDto or null if not found
     */
    getSimulationResponseById(id: number): Promise<SimulationResponseDto | null>;

    createSimulation(simulationData: CreateSimulationRequestDto): Promise<CreatedSimulationResponseDto | null>;

    updateSimulationUserId(id: number, userId: number): Promise<any | null>;

    updateSimulationDestinataireId(id: number, destinataireId: number): Promise<boolean>;

    updateSimulationTransportId(simulationId: number, transportId: number): Promise<boolean>;

}
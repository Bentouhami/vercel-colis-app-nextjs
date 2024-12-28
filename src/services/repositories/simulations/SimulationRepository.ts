// path: src/services/repositories/SimulationRepository.ts

import {ISimulationRepository} from "@/services/repositories/simulations/ISimulationRepository";
import {
    CreatedSimulationResponseDto,
    CreateSimulationRequestDto,
    SimulationResponseDto,
    SimulationSummaryDto
} from "@/services/dtos";
import {simulationDAO} from "@/services/dal/DAO/simulations/SimulationDAO";
import {SimulationMapper} from "@/services/mappers/SimulationMapper";

/**
 * @class SimulationRepository
 * @classdesc This class is responsible for handling database operations related to simulations. it uses the SimulationDAO to interact with the database, and mappers to convert data between the database and the frontend.
 * @implements {ISimulationRepository}
 */
export class SimulationRepository implements ISimulationRepository {


    /**
     * getSimulationResponseById
     * @describe('id', () => {
     *      description: 'The ID of the simulation to retrieve',
     *      required: true,
     *      type: 'number',
     *  })

     * @returns SimulationResponseDto if found or null if not
     * @param envoiId
     */
    async getSimulationResponseById(envoiId: number): Promise<SimulationResponseDto | null> {
        if (!envoiId) {
            return null;
        }

        // Call the DAO to get the simulation
        try {

            console.log("log ====> envoiId in getSimulationResponseById function called in path: src/services/frontend-services/simulation/SimulationService.ts is : ", envoiId);

            const simulation = await simulationDAO.getSimulationResponseById(envoiId);

            // Check if the simulation exists
            if (!simulation) {
                return null;
            }


            console.log("log ====> simulation in getSimulationResponseById function called in path: src/services/frontend-services/simulation/SimulationService.ts returned from simulationDAO.getSimulationResponseById function is : ", simulation);

            // Map the simulation to a SimulationRequestDto and return it
            return SimulationMapper.toSimulationResponseDto(simulation);

            // Handle any errors that may occur during the mapping process
        } catch (error) {
            console.error("Error getting simulation:", error);
            throw error;
        }
    }

    /**
     * createSimulation
     * @describe('simulationData', () => {
     *      description: 'The data to create the simulation',
     *      required: true,
     *      type: 'CreateSimulationRequestDto',
     *  })
     * @param simulationData
     * @returns CreatedSimulationResponseDto if created or null if not
     */
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

    /**
     * updateSimulationUserId
     * @describe('simulationId', () => {
     *      description: 'The ID of the simulation to update',
     *      required: true,
     *      type: 'number',
     *  })
     * @describe('userId', () => {
     *      description: 'The new user ID',
     *      required: true,
     *      type: 'number',
     *  })
     * @param simulationId
     * @param userId
     * @returns void if updated or null if not
     */
    async updateSimulationUserId(simulationId: number, userId: number): Promise<void | null> {
        const response = await simulationDAO.updateSimulationUserId(simulationId, userId);

        if (!response) {
            return null;
        }

    }

    /**
     * updateSimulationDestinataireId,
     * updateSimulation destinataireId
     * @describe('simulationId', () => {
     *      description: 'The ID of the simulation to update',
     *      required: true,
     *      type: 'number',
     *  })
     * @describe('destinataireId', () => {
     *      description: 'The new destinataire ID',
     *      required: true,
     *      type: 'number',
     *  })
     * @param simulationId
     * @param destinataireId
     * @returns boolean if updated or null if not
     */
    async updateSimulationDestinataireId(simulationId: number, destinataireId: number): Promise<boolean> {

        if (!simulationId || !destinataireId) {
            throw new Error("Invalid simulation or destinataire ID");
        }
        console.log("updateSimulationDestinataireId function called in src/services/repositories/simulations/SimulationRepository.ts");

        const response = await simulationDAO.updateSimulationDestinataireId(simulationId, destinataireId);
        if (!response) {
            console.log("log ====> response not found in updateSimulationDestinataireId function");
            return false;
        }
        console.log("log ====> response found in updateSimulationDestinataireId function after updating destinataireId in path: src/services/repositories/simulations/SimulationRepository.ts is : ", response);
        return true;

    }

    /**
     * updateSimulation, update simulation in database.
     * @describe('simulationId', () => {
     *      description: 'The ID of the simulation to update',
     *      required: true,
     *      type: 'number',
     *  })
     * @describe('simulation', () => {
     *      description: 'The updated simulation data',
     *      required: true,
     *      type: 'any',
     *  })
     * @param simulationId
     * @param simulation
     * @returns void if updated or null if not
     */
    async updateSimulation(simulationId: number, simulation: any): Promise<void | null> {
        await simulationDAO.updateSimulation(simulationId, simulation);

    }

    /**
     * getSimulationWithParcelsById, get simulation with parcels by id from database
     * @describe('id', () => {
     *      description: 'The ID of the simulation to retrieve',
     *      required: true,
     *      type: 'number',
     *  })
     * @param id
     * @returns any if found or null if not
     */
    async getSimulationWithParcelsById(id: number): Promise<any | null> {
        return await simulationDAO.getSimulationWithParcelsById(id);
    }

    async getSimulationSummary(simulationId: number): Promise<SimulationSummaryDto | null> {
        if (!simulationId) return null;
        const simulation = await simulationDAO.getSimulationSummary(simulationId);

        if (!simulation) return null;
        // map the simulation to simulation summary dto
        const simulationSummary = SimulationMapper.toSimulationSummaryDto(simulation);

        if (!simulationSummary) return null;
        return simulationSummary;
    }

    async updateSimulationTransportId(simulationId: number, transportId: number): Promise<boolean> {

        if (!simulationId || !transportId) {
            console.log("log ====> simulationId or transportId not found in updateSimulationTransportId function");
            return false;
        }
        console.log("log ====> updateSimulationTransportId function called in src/services/repositories/simulations/SimulationRepository.ts");

        const response = await simulationDAO.updateSimulationTransportId(simulationId, transportId);

        if (!response) {

            console.log("log ====> response not found in updateSimulationTransportId function");
            return false;
        }
        console.log("log ====> response found in updateSimulationTransportId function after updating transportId in path: src/services/repositories/simulations/SimulationRepository.ts is : ", response);
        return true;

    }
}

export const simulationRepository = new SimulationRepository();
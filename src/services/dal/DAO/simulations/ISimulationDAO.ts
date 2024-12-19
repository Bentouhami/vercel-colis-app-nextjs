// path: src/services/dal/DAO/simulations/ISimulationDAO.ts


import {CreateSimulationRequestDto} from "@/services/dtos";
import {Envoi as EnvoiPrisma} from "@prisma/client";


export interface ISimulationDAO {

    getSimulationResponseById(id: number): Promise<EnvoiPrisma | null>;

    getSimulationWithParcelsById(id: number): Promise<any | null>;

    createSimulation(simulationData: CreateSimulationRequestDto): Promise<EnvoiPrisma | null>

    updateSimulationUserId(id: number, userId: number): Promise<void | null>;

    updateSimulationDestinataireId(id: number, destinataireId: number): Promise<boolean>;

    updateSimulationTransportId(simulationId: number, transportId: number): Promise<boolean>;
}
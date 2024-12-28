// path: src/services/repositories/envois/EnvoiRepository.ts

import {EnvoiDto, UpdateEnvoiDto} from "@/services/dtos";
import {IEnvoiRepository} from "@/services/repositories/envois/IEnvoiRepository";
import {envoiDAO} from "@/services/dal/DAO/envois/EnvoiDAO";
import {EnvoiMapper} from "@/services/mappers/EnvoiMapper";
import {simulationRepository} from "@/services/repositories/simulations/SimulationRepository";

/**
 * This class provides methods for interacting with the envois table in the database.
 * @class EnvoiRepository
 * @description This class is responsible for handling database operations related to envois. It provides methods for retrieving envois from the database.
 * @implements {IEnvoiRepository}
 *
 */
class EnvoiRepository implements IEnvoiRepository {

    /**
     * getEnvoiById
     * @describe('envoiId', () => {
     *      description: 'The ID of the envoi to retrieve',
     *      required: true,
     *      type: 'number',
     *  })
     * @param envoiId
     */
    async getEnvoiById(envoiId: number): Promise<EnvoiDto | null> {
        const envoi = await simulationRepository.getSimulationWithParcelsById(envoiId);

        if (!envoi) {
            return null;
        }
        return EnvoiMapper.toDto(envoi);
    }

    /**
     * updateEnvoi
     * @describe('envoi', () => {
     *      description: 'The updated envoi data',
     *      required: true,
     *      type: 'UpdateEnvoiDto',
     *  })
     * @param id
     * @param envoi
     * @returns UpdatedEnvoiDto if updated or null if not
     */
    async updateEnvoi(id: number, envoi: any): Promise<EnvoiDto | null> {
        if (!envoi) {
            throw new Error("Envoi data not found");
        }

        try {
            console.log(
                "log ====> envoi in updateEnvoi in EnvoiRepository.ts in path: src/services/repositories/envois/EnvoiRepository.ts is : ",
                envoi
            );

            // Pass the updated data to the DAO
            const response = await envoiDAO.updateEnvoi(id, envoi);

            if (!response) {
                return null;
            }

            console.log(
                "log ====> response found in updateEnvoi function after updating envoi in path: src/services/repositories/envois/EnvoiRepository.ts is : ",
                response
            );

            // Map the updated response back to DTO
            const updatedEnvoi = EnvoiMapper.toDto(response);

            if (!updatedEnvoi) {
                console.log("log ====> updatedEnvoi not found in updateEnvoi function");
                return null;
            }

            console.log(
                "log ====> updatedEnvoi in updateEnvoi after mapping to EnvoiDto in path: src/services/repositories/envois/EnvoiRepository.ts is : ",
                updatedEnvoi
            );

            return updatedEnvoi;
        } catch (error) {
            console.error("Error updating envoi:", error);
            throw new Error("Error updating envoi");
        }
    }


    /**
     * cancelSimulation
     * @describe('envoiId', () => {
     *      description: 'The ID of the envoi to cancel',
     *      required: true,
     *      type: 'number',
     *  })
     * @param envoiId
     */
    async cancelSimulation(envoiId: number): Promise<void> {
        await envoiDAO.cancelSimulation(envoiId);
    }

    /**
     * deleteParcelsByEnvoiId
     * @describe('envoiId', () => {
     *      description: 'The ID of the envoi to delete the parcels from',
     *      required: true,
     *      type: 'number',
     *  })
     * @param envoiId
     */
    async deleteParcelsByEnvoiId(envoiId: number) {
        await envoiDAO.deleteParcelsByEnvoiId(envoiId);
    }
}

export const envoiRepository = new EnvoiRepository();
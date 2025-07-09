// path: src/services/dal/DAO/transports/TransportDAO.ts

import { UpdateTransportRequestDto} from "@/services/dtos";
import {ITransportDAO} from "@/services/dal/DAO/transports/ITransportDAO";
import { prisma } from "@/utils/db";
import {Transport as TransportPrisma} from "@prisma/client";


/**
 * This class provides methods for interacting with the transport table in the database.
 * @class TransportDAO
 * @description This class is responsible for handling database operations related to transports. It provides methods for retrieving transports from the database.
 * @implements {ITransportDAO}
 *
 */
class TransportDAO implements ITransportDAO {

    /**
     * Retrieves all transports from the database.
     * @returns {Promise<TransportPrisma[] | null>} A promise that resolves to an array of transports or null if no transports are found.
     */
    async getTransports(): Promise<TransportPrisma[] | null> {
       return await prisma.transport.findMany();
    }

    async updateTransport(transport: UpdateTransportRequestDto) : Promise <TransportPrisma | null> {

        if (!transport) {
            throw new Error("Invalid transport data");
        }
        const response = await prisma.transport.update({
            where: {id: transport.id},
            data: {
                number: transport.number,
                baseVolume: transport.baseVolume,
                baseWeight: transport.baseWeight,
                currentVolume: transport.currentVolume,
                currentWeight: transport.currentWeight,
                isAvailable: transport.isAvailable
            }
        });

        if (!response) {
            return null;
        }

        return response;

    }
}
export const transportDAO = new TransportDAO();
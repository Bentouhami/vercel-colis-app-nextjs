// path: src/services/repositories/transports/TransportRepository.ts

import {TransportResponseDto, UpdateTransportRequestDto} from "@/services/dtos";
import {ITransportRepository} from "@/services/repositories/transports/ITransportRepository";
import {transportDAO} from "@/services/dal/DAO/transports/TransportDAO";
import {Transport as TransportPrisma} from "@prisma/client";
import {TransportMapper} from "@/services/mappers/TransportMapper";

/**
 * This class provides methods for interacting with the transports table in the database.
 * @class TransportRepository
 * @description This class is responsible for handling database operations related to transports. It provides methods for retrieving transports from the database.
 * @implements {ITransportRepository}
 *
 */
class TransportRepository implements ITransportRepository {

    async getTransports(): Promise<TransportResponseDto[] | null> {
        const transports = await transportDAO.getTransports();

        if (!transports) {
            return null;
        }
        return TransportMapper.getTransports(transports);
    }

    async updateTransport(transport: UpdateTransportRequestDto) {
        const response = await transportDAO.updateTransport(transport);

        if (!response) {
            return null;
        }

    }
}

export const transportRepository = new TransportRepository();


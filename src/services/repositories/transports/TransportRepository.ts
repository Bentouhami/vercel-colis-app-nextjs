// path: src/services/repositories/transports/TransportRepository.ts

import {ProfileDto, TransportResponseDto, UpdateTransportRequestDto} from "@/services/dtos";
import {ITransportRepository} from "@/services/repositories/transports/ITransportRepository";
import {transportDAO} from "@/services/dal/DAO/transports/TransportDAO";
import {Transport as TransportPrisma} from "@prisma/client";
import {TransportMapper} from "@/services/mappers/TransportMapper";
import {userDAO} from "@/services/dal/DAO/users/UserDAO";
import {UserMapper} from "@/services/mappers/UserMapper";
import {getUserProfileById} from "@/services/frontend-services/UserService";

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

    async updateTransport(transport: UpdateTransportRequestDto) : Promise<TransportResponseDto | null> {
        const response = await transportDAO.updateTransport(transport);

        if (!response) {
            return null;
        }
        console.log("log ====> response found in updateTransport function after updating transport in path: src/services/repositories/transports/TransportRepository.ts is : ", response);


        const updatedTransport = TransportMapper.toDto(response);
        if (!updatedTransport) {
            console.log("log ====> updatedTransport not found in updateTransport function");
            return null;
        }

        console.log("log ====> updatedTransport in updateTransport after mapping to TransportResponseDto in path: src/services/repositories/transports/TransportRepository.ts is : ", updatedTransport);
        return updatedTransport;

    }

    async getUserProfileById(userId: number) : Promise<ProfileDto | null> {

        if (!userId) return null;
        const user = await userDAO.getUserById(userId);

        if (!user) return null;

        return UserMapper.toUserProfile(user);

    }
}

export const transportRepository = new TransportRepository();


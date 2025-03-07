// path: src/services/repositories/transports/TransportRepository.ts

import {ProfileDto, TransportResponseDto, UpdateTransportRequestDto} from "@/services/dtos";
import {ITransportRepository} from "@/services/repositories/transports/ITransportRepository";
import prisma from "@/utils/db";

/**
 * This class provides methods for interacting with the transport table in the database.
 * @class TransportRepository
 * @description This class is responsible for handling database operations related to transports. It provides methods for retrieving transports from the database.
 * @implements {ITransportRepository}
 *
 */
class TransportRepository implements ITransportRepository {

    async getTransports(): Promise<TransportResponseDto[] | null> {
        const transports = await prisma.transport.findMany();

        if (!transports) {
            return null;
        }

        // Map each transport to TransportResponseDto, converting Decimal to number
        return transports.map(transport => ({
            id: transport.id,
            number: transport.number,
            baseVolume: transport.baseVolume.toNumber(),
            baseWeight: transport.baseWeight.toNumber(),
            currentVolume: transport.currentVolume.toNumber(),
            currentWeight: transport.currentWeight.toNumber(),
            isAvailable: transport.isAvailable,
        }));
    }


    async updateTransport(transport: UpdateTransportRequestDto): Promise<TransportResponseDto | null> {
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
        console.log("log ====> response found in updateTransport function after updating transport in path: src/services/repositories/transports/TransportRepository.ts is : ", response);

        // Map the updated transport to a TransportResponseDto and return it
        const updatedTransport : TransportResponseDto = {
            id: response.id,
            number: response.number,
            baseVolume: response.baseVolume.toNumber(),
            baseWeight: response.baseWeight.toNumber(),
            currentVolume: response.currentVolume.toNumber(),
            currentWeight: response.currentWeight.toNumber(),
            isAvailable: response.isAvailable,
        }
        if (!updatedTransport) {
            console.log("log ====> updatedTransport not found in updateTransport function");
            return null;
        }

        console.log("log ====> updatedTransport in updateTransport after mapping to TransportResponseDto in path: src/services/repositories/transports/TransportRepository.ts is : ", updatedTransport);


        return updatedTransport;

    }

}

export const transportRepository = new TransportRepository();


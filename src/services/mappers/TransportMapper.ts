// path: src/services/mappers/TransportMapper.ts
import {CreateTransportRequestDto, TransportResponseDto} from "@/services/dtos";
import {Transport as TransportPrisma} from "@prisma/client";

export class TransportMapper {
    static toDto(transport: TransportPrisma): TransportResponseDto {
        if (!transport) {
            throw new Error("Invalid transport data");
        }
        return {
            id: transport.id,
            number: transport.number,
            baseVolume: Number(transport.baseVolume),
            baseWeight: Number(transport.baseWeight),
            currentVolume: Number(transport.currentVolume),
            currentWeight: Number(transport.currentWeight),
            isAvailable: transport.isAvailable
        };
    }

    static toCreateDto(transport: TransportPrisma): CreateTransportRequestDto {
        return {
            number: transport.number,
            baseVolume: Number(transport.baseVolume),
            baseWeight: Number(transport.baseWeight),
            currentVolume: Number(transport.currentVolume),
            currentWeight: Number(transport.currentWeight),
            isAvailable: transport.isAvailable
        };
    }

    static toUpdateDto(transport: TransportPrisma): CreateTransportRequestDto {
        return {
            number: transport.number,
            baseVolume: Number(transport.baseVolume),
            baseWeight: Number(transport.baseWeight),
            currentVolume: Number(transport.currentVolume),
            currentWeight: Number(transport.currentWeight),
            isAvailable: transport.isAvailable
        };
    }

    static getTransports(transports: TransportPrisma[]): TransportResponseDto[] {
        return transports.map(transport => this.toDto(transport));
    }
}
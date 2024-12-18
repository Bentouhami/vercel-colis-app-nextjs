// path: src/services/mappers/TransportMapper.ts
import {CreateTransportRequestDto, TransportResponseDto} from "@/services/dtos";
import {Transport} from "@prisma/client";

export class TransportMapper {
    static toDto(transport: Transport): TransportResponseDto {
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

    static toCreateDto(transport: Transport): CreateTransportRequestDto {
        return {
            number: transport.number,
            baseVolume: Number(transport.baseVolume),
            baseWeight: Number(transport.baseWeight),
            currentVolume: Number(transport.currentVolume),
            currentWeight: Number(transport.currentWeight),
            isAvailable: transport.isAvailable
        };
    }

    static toUpdateDto(transport: Transport): CreateTransportRequestDto {
        return {
            number: transport.number,
            baseVolume: Number(transport.baseVolume),
            baseWeight: Number(transport.baseWeight),
            currentVolume: Number(transport.currentVolume),
            currentWeight: Number(transport.currentWeight),
            isAvailable: transport.isAvailable
        };
    }

    static getTransports(transports: Transport[]): TransportResponseDto[] {
        return transports.map(transport => this.toDto(transport));
    }
}
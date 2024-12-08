// Transport Mapper
import {BaseTransportDto, TransportDto} from "@/services/dtos";
import {Transport} from "@prisma/client";

export class TransportMapper {
    static toDto(transport: Transport): TransportDto {
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

    static toCreateDto(transport: Transport): BaseTransportDto {
        return {
            number: transport.number,
            baseVolume: Number(transport.baseVolume),
            baseWeight: Number(transport.baseWeight),
            currentVolume: Number(transport.currentVolume),
            currentWeight: Number(transport.currentWeight),
            isAvailable: transport.isAvailable
        };
    }
}
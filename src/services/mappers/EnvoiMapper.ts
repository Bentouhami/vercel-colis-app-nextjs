// path: src/services/mappers/EnvoiMapper.ts

import {EnvoiDto, EnvoiResponseDto, UpdateEnvoiDto} from "@/services/dtos";
import {EnvoiStatusMapper, SimulationStatusMapper} from "@/services/mappers/enums";
import {ParcelMapper} from "@/services/mappers/ParcelMapper";
import {Envoi as EnvoiPrisma, Parcel as ParcelPrisma} from "@prisma/client";

export class EnvoiMapper {
    static toDto(envoi: EnvoiPrisma): EnvoiDto {

        console.log("log ====> envoi in EnvoiMapper.ts in path: src/services/mappers/EnvoiMapper.ts is : ", envoi);
        const {
            id,
            userId,
            destinataireId,
            departureAgencyId,
            arrivalAgencyId,
            transportId,
            simulationStatus,
            envoiStatus,
            totalWeight,
            totalVolume,
            totalPrice,
            departureDate,
            arrivalDate,
            trackingNumber,
            qrCodeUrl,
            paid,
            verificationToken,
            comment,
        } = envoi;
        return {
            id,
            userId: userId!,
            destinataireId: destinataireId!,
            departureAgencyId,
            arrivalAgencyId,
            transportId: transportId!,
            simulationStatus: SimulationStatusMapper.toDtoStatus(simulationStatus),
            envoiStatus: EnvoiStatusMapper.toDtoStatus(envoiStatus),
            totalWeight,
            totalVolume,
            totalPrice,
            departureDate,
            arrivalDate,
            trackingNumber: trackingNumber!,
            qrCodeUrl: qrCodeUrl!,
            paid,
            verificationToken,
            comment : comment!,

        };
    }

    static toResponseDto(envoi: EnvoiPrisma & { parcels: ParcelPrisma[] }): EnvoiResponseDto {
        const {
            id,
            userId,
            departureAgencyId,
            arrivalAgencyId,
            transportId,
            simulationStatus,
            envoiStatus,
            totalWeight,
            totalVolume,
            totalPrice,
            departureDate,
            arrivalDate,
            trackingNumber,
            destinataireId,
            paid,
            qrCodeUrl,
            parcels,
        } = envoi;

        return {
            id,
            userId: userId!,
            destinataireId: destinataireId!,
            transportId: transportId!,
            departureAgencyId,
            arrivalAgencyId,
            simulationStatus: SimulationStatusMapper.toDtoStatus(simulationStatus),
            envoiStatus: EnvoiStatusMapper.toDtoStatus(envoiStatus),
            totalWeight,
            totalVolume,
            totalPrice,
            paid,
            departureDate,
            arrivalDate,
            trackingNumber: trackingNumber!,
            qrCodeUrl: qrCodeUrl!,
            parcels: ParcelMapper.toDtos(parcels),
        };
    }

    static toUpdateEnvoiDto(envoi: any): UpdateEnvoiDto {
        return {
            id: envoi.id,
            envoiStatus: EnvoiStatusMapper.toDtoStatus(envoi.envoiStatus),
            simulationStatus: SimulationStatusMapper.toDtoStatus(envoi.simulationStatus),

            departureDate: envoi.departureDate,
            arrivalDate: envoi.arrivalDate,
            userId: envoi.userId!,
            transportId: envoi.transportId!,
            parcels: ParcelMapper.toDtos(envoi.parcels),

        };
    }
}
// path: src/services/mappers/EnvoiMapper.ts


// Envoi Mapper
import {UserMapper} from "@/services/mappers/UserMapper";
import {Agency, Envoi, Parcel, User} from "@prisma/client";
import {EnvoiDto, EnvoiStatus} from "@/services/dtos";
import {AgencyMapper} from "@/services/mappers/AgencyMapper";
import {ParcelMapper} from "@/services/mappers/ParcelMapper";
import {SimulationStatusMapper} from "@/services/mappers/enums/SimulationStatusMapper";
import {EnvoiStatusMapper} from "@/services/mappers/enums/EnvoiStatusMapper";

export class EnvoiMapper {
    static toDto(
        envoi: Envoi & {
            client?: User,
            destinataire?: User,
            departureAgency?: Agency,
            arrivalAgency?: Agency,
            parcels?: Parcel[]
        }
    ): EnvoiDto {
        return {
            id: envoi.id,
            trackingNumber: envoi.trackingNumber || undefined,
            qrCodeUrl: envoi.qrCodeUrl || undefined,
            userId: envoi.userId || undefined,
            user: envoi.client ? UserMapper.toDto(envoi.client) : undefined,
            destinataireId: envoi.destinataireId || undefined,
            destinataire: envoi.destinataire ? UserMapper.toDto(envoi.destinataire) : undefined,
            transportId: envoi.transportId || undefined,
            departureAgencyId: envoi.departureAgencyId,
            departureAgency: envoi.departureAgency ? AgencyMapper.toDto(envoi.departureAgency) : undefined,
            arrivalAgencyId: envoi.arrivalAgencyId,
            arrivalAgency: envoi.arrivalAgency ? AgencyMapper.toDto(envoi.arrivalAgency) : undefined,
            simulationStatus: SimulationStatusMapper.toDtoStatus(envoi.simulationStatus),
            status: envoi.status !== null
                ? EnvoiStatusMapper.toDtoStatus(envoi.status)
                : EnvoiStatus.PENDING,
            totalWeight: envoi.totalWeight,
            totalVolume: envoi.totalVolume,
            totalPrice: envoi.totalPrice,
            departureDate: envoi.departureDate,
            arrivalDate: envoi.arrivalDate,
            verificationToken: envoi.verificationToken,
            comment: envoi.comment || undefined,
            parcels: envoi.parcels ? envoi.parcels.map(ParcelMapper.toDto) : []
        };
    }
}

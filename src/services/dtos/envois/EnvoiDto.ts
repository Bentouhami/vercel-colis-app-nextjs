// path : src/services/dtos/envois/EnvoiDto.ts


// -------------------- Envoi DTOs --------------------
import {UserDto} from "@/services/dtos/users/UserDto";
import {AgencyDto} from "@/services/dtos/agencies/AgencyDto";
import {ParcelDto} from "@/services/dtos/parcels/ParcelDto";
import {EnvoiStatus, SimulationStatus} from "@/services/dtos/enums/EnumsDto";

export interface EnvoiDto {
    id?: number;
    trackingNumber?: string;
    qrCodeUrl?: string;
    userId?: number;
    user?: UserDto;
    destinataireId?: number;
    destinataire?: UserDto;
    transportId?: number;
    departureAgencyId: number;
    departureAgency?: AgencyDto;
    arrivalAgencyId: number;
    arrivalAgency?: AgencyDto;
    simulationStatus: SimulationStatus;
    envoiStatus: EnvoiStatus;
    totalWeight: number;
    totalVolume: number;
    totalPrice: number;
    departureDate: Date;
    arrivalDate: Date;
    verificationToken: string;
    comment?: string;
    parcels?: ParcelDto[];
}

// DTO for creating a new envoi
export interface CreateEnvoiDto extends Omit<EnvoiDto, "id" | "trackingNumber" | "qrCodeUrl" | "user" | "destinataire" | "departureAgency" | "arrivalAgency" | "parcels"> {
    parcels: Omit<ParcelDto, "id" | "envoiId">[];
}

// DTO for updating an existing envoi
export interface UpdateEnvoiDto extends Partial<CreateEnvoiDto> {
    id: number;
}

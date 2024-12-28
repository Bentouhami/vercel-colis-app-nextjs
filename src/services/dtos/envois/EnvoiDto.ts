// path : src/services/dtos/envois/EnvoiDto.ts


// -------------------- Envoi DTOs --------------------
import {UserDto} from "@/services/dtos/users/UserDto";
import {AgencyDto} from "@/services/dtos/agencies/AgencyDto";
import {ParcelDto} from "@/services/dtos/parcels/ParcelDto";
import {EnvoiStatus, SimulationStatus} from "@/services/dtos/enums/EnumsDto";
export interface EnvoiDto {
    id?: number;
    destinationId?: number;
    trackingNumber?: string;
    qrCodeUrl?: string;
    userId?: number;
    client?: UserDto;
    destinataireId?: number;
    destinataire?: UserDto;
    transportId?: number;
    departureAgencyId: number;
    departureAgency?: AgencyDto | null; // Allow null
    arrivalAgencyId: number;
    arrivalAgency?: AgencyDto | null; // Allow null
    simulationStatus: SimulationStatus;
    envoiStatus: EnvoiStatus;
    paid: boolean;
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
export interface UpdateEnvoiDto extends Partial<Omit<EnvoiDto, "id">> {
    id: number;
}

export interface EnvoiResponseDto {
    id: number;
    destinataireId: number;
    trackingNumber: string;
    qrCodeUrl: string;
    arrivalAgencyId: number;
    departureAgencyId: number;
    envoiStatus: EnvoiStatus;
    simulationStatus: SimulationStatus;
    userId: number;
    paid: boolean;
    transportId: number;
    parcels: ParcelDto[];
    totalWeight: number;
    totalVolume: number;
    totalPrice: number;
    departureDate: Date;
    arrivalDate: Date;
}

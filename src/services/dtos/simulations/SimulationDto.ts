// path: src/services/dtos/simulations/SimulationDto.ts


// SimulationResultsDto: used when getting simulation details from the frontend
import {CreateParcelDto} from "@/services/dtos/parcels/ParcelDto";
import {EnvoiStatus, SimulationStatus} from "@/services/dtos/enums/EnumsDto";

// Interface utilisée pour les requêtes de création d'un nouvel envoi depuis le frontend. Cela inclut les informations nécessaires pour créer un envoi.

export interface EnvoiDtoRequest {
    userId?: number;
    destinataireId?: number;
    departureAgencyId: number;
    arrivalAgencyId: number;
    transportId?: number;
    parcels: CreateParcelDto[];
    totalWeight: number;
    totalVolume: number;
    totalPrice: number;
    departureDate: Date;
    arrivalDate: Date;
    comment?: string;
}

export interface BaseEnvoiDto {
    id: number;
    trackingNumber: string | null;
    qrCodeUrl?: string | null;
    simulationStatus: SimulationStatus;
    status: EnvoiStatus | null;
    totalWeight: number;
    totalVolume: number;
    totalPrice: number;
    paid: boolean;
    departureDate: Date;
    arrivalDate: Date;
    createdAt: Date;
    updatedAt: Date;
    verificationToken: string;
}


export interface SimulationDtoRequest {
    departureCountry: string;
    departureCity: string;
    departureAgency: string;
    destinationCountry: string;
    destinationCity: string;
    destinationAgency: string;
    parcels: CreateParcelDto[];
    // SimulationCalculationTotalsDto: SimulationCalculationTotalsDto;
}

// DTO for calculation results related to simulation
export interface SimulationCalculationTotalsDto {
    totalWeight: number;
    totalVolume: number;
    totalPrice: number;
    departureDate: Date;
    arrivalDate: Date;
}

// SimulationResultsDto: used when getting simulation details from the frontend
export interface BaseSimulationDto extends SimulationCalculationTotalsDto , SimulationDtoRequest{
    departureAgencyId: number | null;
    arrivalAgencyId: number | null;
    simulationStatus: SimulationStatus;
    status: EnvoiStatus;
    parcels: CreateParcelDto[];
}

export interface StatusSimulationAndEnvoiStatus {
    simulationStatus: SimulationStatus | null;
    status: EnvoiStatus | null;
}

// Response DTO for a created simulation, used when receiving a new simulation ID and token
export interface CreatedSimulationResponseDto {
    id: number;
    trackingNumber: string;
    verificationToken: string;
}

export interface SimulationDto extends StatusSimulationAndEnvoiStatus, SimulationCalculationTotalsDto {
    userId: number | null;
    destinataireId: number | null;
    departureCountry: string | null;
    departureCity: string | null;
    departureAgency: string | null;
    destinationCountry: string | null;
    destinationCity: string | null;
    destinationAgency: string | null;
    parcels: CreateParcelDto[];
    trackingNumber: string | null;
}

// DTO for a simulation with user and destination IDs, typically used in backend processing and database storage
export interface SimulationWithIds extends BaseSimulationDto {
    userId: number | null;
    destinataireId: number | null;
}

// DTO for a fully prepared simulation with IDs, ready for storage or full data transmission
export interface FullSimulationDto extends SimulationWithIds {
    id: number;
}

// DTO for a prepared simulation with only user and destinataire IDs, used before calculation
export interface UpdatingSimulationWithIdsDto {
    userId: number | null;
    destinataireId: number | null;

}

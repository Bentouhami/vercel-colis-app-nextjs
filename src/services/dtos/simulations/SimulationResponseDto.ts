// path: src/services/dtos/simulations/SimulationDto.ts


// SimulationResultsDto: used when getting simulation details from the frontend
import {CreateParcelDto, ParcelDto} from "@/services/dtos/parcels/ParcelDto";
import {EnvoiStatus, SimulationStatus} from "@/services/dtos/enums/EnumsDto";
import {AgencyDto, TransportDto} from "@/services/dtos";

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
export interface BaseSimulationDto extends SimulationCalculationTotalsDto {
    userId?: number | null;
    destinataireId?: number | null;
    departureAgencyId: number | null;
    arrivalAgencyId: number | null;
    simulationStatus: SimulationStatus;
    envoiStatus: EnvoiStatus;
    parcels: CreateParcelDto[];
}

export interface StatusSimulationAndEnvoiStatus {
    simulationStatus: SimulationStatus | null;
    envoiStatus: EnvoiStatus | null;
}

// Response DTO for a created simulation, used when receiving a new simulation ID and token
export interface CreatedSimulationResponseDto {
    id: number;
    verificationToken: string;
}

export interface SimulationResponseDto extends StatusSimulationAndEnvoiStatus, SimulationCalculationTotalsDto {
    userId: number | null;
    destinataireId: number | null;
    departureCountry: string | null;
    departureCity: string | null;
    departureAgency: string | null;
    destinationCountry: string | null;
    destinationCity: string | null;
    destinationAgency: string | null;
    parcels: CreateParcelDto[];
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

// Response for created simulation
export interface CreatedSimultionDto {
    id: number;
    transportId: number;
    departureAgencyId: number;
    arrivalAgencyId: number;
    simulationStatus: SimulationStatus;
    totalWeight: number;
    totalVolume: number;
    totalPrice: number;
    departureDate: Date;
    arrivalDate: Date;
    arrivalAgency: AgencyDto;
    departureAgency: AgencyDto;
    transport: TransportDto;
    parcels: ParcelDto[];

}

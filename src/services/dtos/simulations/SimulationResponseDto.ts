// path: src/services/dtos/simulations/SimulationDto.ts


// SimulationResultsDto: used when getting simulation details from the frontend
import {CreateParcelDto} from "@/services/dtos/parcels/ParcelDto";
import {EnvoiStatus, SimulationStatus} from "@/services/dtos/enums/EnumsDto";

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

export interface SimulationSummaryDto extends SimulationCalculationTotalsDto, StatusSimulationAndEnvoiStatus {
    id: number;
    transportId: number | null;
}


// SimulationResultsDto: used when getting simulation details from the frontend
export interface CreateSimulationRequestDto extends SimulationCalculationTotalsDto, StatusSimulationAndEnvoiStatus {
    userId?: number | null;
    destinataireId?: number | null;
    departureAgencyId: number;
    arrivalAgencyId: number;
    parcels: CreateParcelDto[];
}

export interface UpdateEditedSimulationDto extends Partial<CreateSimulationRequestDto> {
    id: number;
}

export interface StatusSimulationAndEnvoiStatus {
    simulationStatus: SimulationStatus;
    envoiStatus: EnvoiStatus;
}

// Response DTO for a created simulation, used when receiving a new simulation ID and token
export interface CreatedSimulationResponseDto {
    id: number;
    verificationToken: string;
}

export interface SimulationResponseDto extends StatusSimulationAndEnvoiStatus, SimulationCalculationTotalsDto {
    id: number;
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

export interface PartielUpdateSimulationDto extends Partial<SimulationResponseDto> {
}

// DTO for a simulation with user and destination IDs, typically used in backend processing and database storage
export interface SimulationWithIds extends CreateSimulationRequestDto {
    userId: number | null;
    destinataireId: number | null;
}

// DTO for a fully prepared simulation with IDs, ready for storage or full data transmission
export interface FullSimulationDto extends SimulationWithIds {
    id: number;
}

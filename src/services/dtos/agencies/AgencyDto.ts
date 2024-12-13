// path: src/services/dtos/agencies/AgencyDto.ts

// -------------------- Agency DTOs --------------------
import {AddressDto, AddressResponseDto, UpdateAddressDto} from "@/services/dtos/addresses/AddressDto";

export interface AgencyDto {
    id?: number;
    name: string;
    location?: string;
    addressId: number;
    address?: AddressDto;
    capacity: number;
    availableSlots: number;
}

// DTO for creating a new agency
export interface CreateAgencyDto extends Omit<AgencyDto, "id" | "address"> {
}

// DTO for updating an existing agency
export interface UpdateAgencyDto extends Partial<CreateAgencyDto> {
    id: number;
}

export interface BaseAgencyDto {
    name: string;
    location: string | null;
    address: UpdateAddressDto;
    capacity: number;
    availableSlots: number;
}

export interface FullAgencyDto extends BaseAgencyDto {
    id: number;
}

export interface AgencyResponseDto {
    id: number;
    name: string;
    location: string | null;
    address: AddressResponseDto;
    capacity: number;
    availableSlots: number;
}


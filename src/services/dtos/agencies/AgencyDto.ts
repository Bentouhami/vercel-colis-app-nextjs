// path: src/services/dtos/agencies/AgencyDto.ts

// -------------------- Agency DTOs --------------------
import {AddressDto, AgencyAddressDto} from "@/services/dtos/addresses/AddressDto";

export interface AgencyDto {
    id?: number;
    name: string;
    location?: string;
    email?: string;
    phoneNumber?: string;
    vatNumber?: string;
    addressId: number;
    address?: AddressDto;
    capacity?: number | null;
    availableSlots?: number | null;
    createdAt: Date;
    updatedAt: Date;
}

// DTO for creating a new agency
export interface CreateAgencyDto extends Partial<AgencyDto> {
}

// DTO for updating an existing agency
export interface UpdateAgencyDto extends Partial<CreateAgencyDto> {
    id: number;
}

export interface BaseAgencyDto {
    name: string;
    location: string | null;
    address: AgencyAddressDto;
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
    vatNumber: string | null;
    email: string | null;
    phoneNumber: string | null;
    address: AgencyAddressDto;
    capacity: number | null;
    availableSlots: number | null;
}


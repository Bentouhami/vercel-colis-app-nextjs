// path: src/services/dtos/addresses/AddressDto.ts


// -------------------- Address DTOs --------------------
import {CityDto} from "@/services/dtos/cities/CityDto";

export interface AddressDto {
    id?: number;
    street: string;
    complement?: string | null;
    streetNumber?: string | null;
    boxNumber?: string | null;
    cityId?: number;
    city:  CityDto;
}

// DTO for creating a new address

// DTO for updating an existing address
export interface UpdateAddressDto extends Partial<AddressResponseDto> {
    id: number;
}

export interface AddressResponseDto  {
    id?: number;
    street?: string;
    complement?: string | null;
    streetNumber?: string | null;
    boxNumber?: string | null;
    cityId: number;
}

// dto for user address same as agency address juste to make this clear
export interface UserAddressDto extends AddressDto {
    city: CityDto;
}

// dto for agency address same as user address juste to make this clear
export interface AgencyAddressDto extends AddressDto {
  city: CityDto;
}

export interface CreateAddressDto {
    street?: string;
    complement?: string | null;
    streetNumber?: string | null;
    boxNumber?: string | null;
    city: CityDto;
}


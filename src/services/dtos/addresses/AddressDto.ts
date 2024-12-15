// path: src/services/dtos/addresses/AddressDto.ts


// -------------------- Address DTOs --------------------
export interface AddressDto {
    id?: number;
    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
}

// DTO for creating a new address

// DTO for updating an existing address
export interface UpdateAddressDto extends Partial<AddressResponseDto> {
    id: number;
}

export interface AddressResponseDto  {
    id?: number;
    street: string;
    number: string | null;
    city: string;
    zipCode: string;
    country: string;
}


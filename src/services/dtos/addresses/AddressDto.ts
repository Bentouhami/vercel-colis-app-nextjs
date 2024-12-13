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
export type CreateAddressDto = Omit<AddressDto, "id" | "latitude" | "longitude">;

// DTO for updating an existing address
export interface UpdateAddressDto extends Partial<CreateAddressDto> {
    id: number;
}

export interface AddressResponseDto  {
    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}

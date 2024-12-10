// path: src/services/dtos/addresses/AddressDto.ts


// -------------------- Address DTOs --------------------
export interface AddressDto {
    id?: number;
    street: string;
    number: string | null;
    city: string;
    zipCode: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
}
// DTO for the created address
export interface CreatedAddressDto {
    id: number;
    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}
// DTO for the found address
export interface FoundAddressDto {
    id: number;
    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}

// DTO for creating a new address
export interface CreateAddressDto {
    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}


// DTO for updating an existing address
export interface UpdateAddressDto extends Partial<CreateAddressDto> {
    id: number;
}


// DTOs for my project – ColiApp

export interface CreateAddressDto {
    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}

// DTO for User update
export interface UpdateAddressDto {

    street?: string;
    number?: string;
    city?: string;
    zipCode?: string;
    country?: string;
}

// DTO for User create
export interface CreateUserDto {
    firstName: string;
    lastName: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
    password: string;
    // checkPassword: string;
    image: string;
    address: CreateAddressDto;

}

// create Destinataire DTO
export interface CreateDestinataireDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

// DTO for User response
export interface UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    image?: string | null;
    role: string;
}

// DTO for User login
export interface LoginUserDto {
    email: string;
    password: string;
}


export interface RegisterUserDto {
    firstName: string;
    lastName: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
    password: string;
    address: CreateAddressDto;
}


// DTO for Parcel create
export interface CreateParcelDto {
    height: number; // hauteur en cm
    width: number; // largeur en cm
    length: number; // longueur en cm
    weight: number; // poids en kg
}


// DTO for simulation envoi
export interface SimulationEnvoisDto {
    departureCountry: string;
    departureCity: string;
    departureAgency: string;
    destinationCountry: string;
    destinationCity: string;
    destinationAgency: string;

    packages: CreateParcelDto[];
}

// STO for Tarifs
export interface TarifsDto {
    weightRate: number;
    volumeRate: number;
    baseRate: number;
    fixedRate: number;

}

// DTO for simulation results
export interface SimulationResultsDto {
    departureCountry: string;
    departureCity: string;
    departureAgency: string;
    destinationCountry: string;
    destinationCity: string;
    destinationAgency: string;
    packages: CreateParcelDto[];
    totalWeight: number;
    totalVolume: number;
    totalPrice: number;
    departureDate: string;
    arrivalDate: string;
}

// DTO for Destinataire (the client, whom will receive the parcel)
export interface CreateDestinataireDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: CreateAddressDto;
}

// DTO for validated envoi
export interface ValidatedEnvoisDto {
    departureCountry: string;
    departureCity: string;
    departureAgency: string;
    destinationCountry: string;
    destinationCity: string;
    destinationAgency: string;
    packages: CreateParcelDto[];
    CreateDestinataireDto: CreateDestinataireDto;
    destinataire: CreateDestinataireDto;
}

// DTOs for ColisApp

// Base DTOs
export enum Role {
    CLIENT = "CLIENT",
    DESTINATAIRE = "DESTINATAIRE",
    ADMIN = "ADMIN",
}

export interface BaseDestinataireDto {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phoneNumber: string;

}

// DTO for User response without a password
export interface FullUserResponseDto extends BaseUserDto {
    id: number;
    role: Role;
    image: string | '';
    isVerified: boolean;
    emailVerified: Date;
    verificationToken: string;
    verificationTokenExpires: Date;
}

export interface UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: Date;
    email: string;
    phoneNumber: string;
    image: string | '',
    role: Role;
}

export interface DestinataireResponseWithRoleDto {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phoneNumber: string;
    image: string | '',
    role: Role;
}

export interface BaseUserDto extends BaseDestinataireDto {
    birthDate: Date;
    address: BaseAddressDTO | FullAddressDTO;
}


export interface BaseClientDto extends BaseUserDto {
    password: string;
}

export interface UserModelDto {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    birthDate: Date;
    phoneNumber: string;
    email: string;
    role: Role;
    image: string | '',
    isVerified: boolean;
    emailVerified: Date;
    verificationToken: string;
    verificationTokenExpires: Date;
    addressId: number;
}

// Register and Login DTOs
export interface FullUserDto extends BaseClientDto {
    id: number;
    role: Role;
    image: string | '',
    isVerified: boolean;
    emailVerified: Date;
    verificationToken: string;
    verificationTokenExpires: Date;
}

// Register and Login DTOs
export interface CreateFullUserDto extends BaseClientDto {
    role: Role;
    verificationToken: string;
    verificationTokenExpires: Date;
}


export interface DestinataireResponseDto extends BaseDestinataireDto {
    id: number;
}


export interface LoginUserDto {
    email: string;
    password: string;
}

export interface UserLoginResponseDto {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    image: string | null;
    role: Role;
    isVerified: boolean;
    emailVerified: Date | null;
    verificationToken: string | null;
    verificationTokenExpires: Date | null;
}


// Address DTOs
export interface BaseAddressDTO {
    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}

// full Address DTO
export interface FullAddressDTO extends BaseAddressDTO {
    id: number;
}

// Parcel DTOs
export interface CreateParcelDto {
    height: number; // en cm
    width: number; // en cm
    length: number; // en cm
    weight: number; // en kg
}

// Simulation DTOs
export interface SimulationEnvoisDto {
    departureCountry: string;
    departureCity: string;
    departureAgency: string;
    destinationCountry: string;
    destinationCity: string;
    destinationAgency: string;
    packages: CreateParcelDto[];
}

// Tarifs and results
export interface TarifsDto {
    weightRate: number;
    volumeRate: number;
    baseRate: number;
    fixedRate: number;
}

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

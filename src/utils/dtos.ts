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
    image: string | null;
    role: Role;
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
    name: string | null;
    email: string;
    phoneNumber: string;
    image: string | null; // Allow null here
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

// Full Address DTO
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


// Tarifs and results
export interface TarifsDto {
    weightRate: number;
    volumeRate: number;
    baseRate: number;
    fixedRate: number;
}


// Simulation DTOs
// SimulationResultsDto: used when getting simulation details from the frontend
export interface BaseSimulationDto {
    departureCountry: string;
    departureCity: string;
    departureAgency: string;
    destinationCountry: string;
    destinationCity: string;
    destinationAgency: string;
    parcels: CreateParcelDto[];
}

// DTO for calculation results related to simulation
export interface SimulationCalculationTotalsDto {
    totalWeight: number;
    totalVolume: number;
    totalPrice: number | null;
    departureDate: Date;
    arrivalDate: Date;
}


export enum SimulationStatus {
    DRAFT = "DRAFT",
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

// Response DTO for a created simulation, used when receiving a new simulation ID and token
export interface CreatedSimulationResponseDto {
    id: number;
    verificationToken: string;
}

// DTO combining base simulation data and calculation totals without IDs, used for sending data without user or destination details
export interface SimulationWithoutIds extends BaseSimulationDto, SimulationCalculationTotalsDto {
    status: SimulationStatus;
}

// DTO for a simulation with user and destination IDs, typically used in backend processing and database storage
export interface SimulationWithIds extends SimulationWithoutIds {
    userId: number | null;
    destinataireId: number | null;
}

// DTO for a fully prepared simulation with IDs, ready for storage or full data transmission
export interface FullSimulationDto extends SimulationWithIds {
    id: number;
}

// DTO for a prepared simulation with only user and destinataire IDs, used before calculation
export interface PreparedSimulation extends BaseSimulationDto {
    userId: number | null;
    destinataireId: number | null;
    status: SimulationStatus;

}


// Agency DTOs
export interface BaseAgencyDto {
    name: string;
    location: string;
    addressId: number;
    capacity: number;
    availableSlots: number;
}

export interface AgencyResponseDto extends BaseAgencyDto {
    id: number;
}

export interface AgencyFullResponseDto extends BaseAgencyDto, AgencyResponseDto {

    Address: FullAddressDTO;
    updatedAt: Date;
    createdAt: Date;
}

export interface MessageBodyDto
{
    phone: string
    subject: string
    name: string
    message: string
    email: string
}
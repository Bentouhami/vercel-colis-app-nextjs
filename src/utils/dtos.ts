// path : src/utils/dtos.ts

// ------------------ DTOs généraux ------------------
export interface PaginationDto {
    page: number; // Page actuelle
    pageSize: number; // Nombre d'éléments par page
}

// Base DTOs

// Enums matching the database schema
export enum Roles {
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN',
    DESTINATAIRE = 'DESTINATAIRE',
    AGENCY_ADMIN = 'AGENCY_ADMIN'
}

export enum SimulationStatus {
    DRAFT = 'DRAFT',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum EnvoiStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED'
}

export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    RESCHEDULED = 'RESCHEDULED',
    COMPLETED = 'COMPLETED',
    MISSED = 'MISSED',
    IN_PROGRESS = 'IN_PROGRESS'
}

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
export type CreateAddressDto = Omit<AddressDto, "id">;

// DTO for updating an existing address
export interface UpdateAddressDto extends Partial<CreateAddressDto> {
    id: number;
}

// -------------------- User DTOs --------------------
export interface UserDto {
    id?: number;
    firstName?: string;
    lastName?: string;
    name?: string;
    birthDate?: Date;
    email: string;
    phoneNumber?: string;
    password?: string;
    image?: string;
    roles?: Roles[];
    agencyId?: number;
    isVerified?: boolean;
    emailVerified?: Date;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    addressId?: number;
    address?: AddressDto;
}

// DTO for creating a new user
export interface CreateUserDto extends Omit<UserDto, "id" | "isVerified" | "emailVerified" | "addressId" | "address"> {
    password: string; // Obligatoire
    address: CreateAddressDto; // Adresse complète requise
    verificationTokenExpires: Date; // Date d'expiration du token de vérification de l'email
    verificationToken: string; // Token de vérification de l'email
}

export type RegisterClientDto =
    Required<Pick<UserDto, "firstName" | "lastName" | "birthDate" | "phoneNumber" | "email" | "password">>
    & {
    address: CreateAddressDto; // Champ supplémentaire obligatoire
};

// DTO for updating an existing user
export interface UpdateUserDto extends Partial<CreateUserDto> {
    id: number; // Required to identify the user to update
}

export type CreateDestinataireDto = Required<Pick<UserDto, "firstName" | "lastName" | "email" | "phoneNumber" | "image" | "roles">>;

export type UserResponseDto = Required<Pick<UserDto, "id" | "firstName" | "lastName" | "birthDate" | "phoneNumber" | "email" | "image" | "roles">>;


// DTO for User response without a password
export type FullUserResponseDto = Omit<UserDto, "password"> & {
    address: CreateAddressDto;
};


// -------------------- Parcel DTOs --------------------
export interface ParcelDto {
    id?: number;
    height: number;
    weight: number;
    width: number;
    length: number;
    envoiId: number;
}

// DTO for creating a new parcel
export type CreateParcelDto = Omit<ParcelDto, "id" | "envoiId">;


// -------------------- Agency DTOs --------------------
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

// -------------------- Envoi (Shipment) DTOs --------------------
export interface EnvoiDto {
    id?: number;
    trackingNumber?: string;
    qrCodeUrl?: string;
    userId?: number;
    user?: UserDto;
    destinataireId?: number;
    destinataire?: UserDto;
    transportId?: number;
    departureAgencyId: number;
    departureAgency?: AgencyDto;
    arrivalAgencyId: number;
    arrivalAgency?: AgencyDto;
    simulationStatus: SimulationStatus;
    status: EnvoiStatus;
    totalWeight: number;
    totalVolume: number;
    totalPrice: number;
    departureDate: Date;
    arrivalDate: Date;
    verificationToken: string;
    comment?: string;
    parcels?: ParcelDto[];
}

// DTO for creating a new envoi
export interface CreateEnvoiDto extends Omit<EnvoiDto, "id" | "trackingNumber" | "qrCodeUrl" | "user" | "destinataire" | "departureAgency" | "arrivalAgency" | "parcels"> {
    parcels: Omit<ParcelDto, "id" | "envoiId">[];
}

// DTO for updating an existing envoi
export interface UpdateEnvoiDto extends Partial<CreateEnvoiDto> {
    id: number;
}

export interface DestinataireResponseWithRoleDto {
    id: number;
    firstName: string;
    lastName: string;
    name: string | null;
    email: string;
    phoneNumber: string;
    image: string | null; // Allow null here
    roles: Roles[];
}

export interface BaseUserDto extends CreateDestinataireDto {
    birthDate: Date;
    address: CreateAddressDto | UpdateAddressDto;
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
    roles: Roles[];
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
    roles: Roles[];
    image: string | '',
    isVerified: boolean;
    emailVerified: Date;
    verificationToken: string;
    verificationTokenExpires: Date;
}

// Register and Login DTOs
export interface CreateFullUserDto extends BaseClientDto {
    roles: Roles[];
    verificationToken: string;
    verificationTokenExpires: Date;
}

export interface DestinataireResponseDto extends CreateDestinataireDto {
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
    roles: Roles[];
    isVerified: boolean;
    emailVerified: Date | null;
    verificationToken: string | null;
    verificationTokenExpires: Date | null;
}

// Tarifs and results
export interface TarifsDto {
    weightRate: number;
    volumeRate: number;
    baseRate: number;
    fixedRate: number;
}


// SimulationResultsDto: used when getting simulation details from the frontend
export interface SimulationDtoRequest extends StatusSimulationAndEnvoiStatus {
    departureCountry: string;
    departureCity: string;
    departureAgency: string;
    destinationCountry: string;
    destinationCity: string;
    destinationAgency: string;
    parcels: CreateParcelDto[];
    SimulationCalculationTotalsDto: SimulationCalculationTotalsDto;
}

// DTO for calculation results related to simulation
export interface SimulationCalculationTotalsDto {
    totalWeight: number;
    totalVolume: number;
    totalPrice: number | null;
    departureDate: Date;
    arrivalDate: Date;
}

// SimulationResultsDto: used when getting simulation details from the frontend
export interface BaseSimulationDto extends SimulationCalculationTotalsDto {
    departureAgencyId: number | null;
    arrivalAgencyId: number | null;
    simulationStatus: SimulationStatus;
    status: EnvoiStatus;
    parcels: CreateParcelDto[];
}

export interface StatusSimulationAndEnvoiStatus {
    simulationStatus: SimulationStatus | null;
    status: EnvoiStatus | null;
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

export interface SimulationDto extends StatusSimulationAndEnvoiStatus, SimulationCalculationTotalsDto {
    userId: number;
    destinataireId: number;
    departureCountry: string;
    departureCity: string;
    departureAgency: string;
    destinationCountry: string;
    destinationCity: string;
    destinationAgency: string;
    parcels: CreateParcelDto[];
}

// DTO for a simulation with user and destination IDs, typically used in backend processing and database storage
export interface SimulationWithIds extends BaseSimulationDto {
    userId: number | null;
    destinataireId: number | null;
}

// DTO for a fully prepared simulation with IDs, ready for storage or full data transmission
export interface FullSimulationDto extends SimulationWithIds {
    id: number;
}

// DTO for a prepared simulation with only user and destinataire IDs, used before calculation
export interface UpdatingSimulationWithIdsDto {
    userId: number | null;
    destinataireId: number | null;

}


// Agency DTOs
export interface BaseAgencyDto {
    name: string;
    location: string;
    address: UpdateAddressDto;
    capacity: number;
    availableSlots: number;
}

export interface AgencyResponseDto extends BaseAgencyDto {
    id: number;
}

// DTO for a transport
export interface TransportDto extends BaseTransportDto {
    id: number;
}

export interface BaseTransportDto {
    number: string;
    baseVolume: number;
    baseWeight: number;
    currentVolume: number;
    currentWeight: number;
    isAvailable: boolean;
}


// -------------------- Appointment DTOs --------------------
export interface AppointmentDto {
    id?: number;
    envoiId: number;
    envoi?: EnvoiDto;
    agencyId: number;
    agency?: AgencyDto;
    date: Date;
    status: AppointmentStatus;
}

// DTO for creating a new appointment
export interface CreateAppointmentDto extends Omit<AppointmentDto, "id" | "envoi" | "agency" | "status"> {
}

// DTO for updating an existing appointment
export interface UpdateAppointmentDto extends Partial<CreateAppointmentDto> {
    id: number;
}

// -------------------- Notification DTOs --------------------
export interface NotificationDto {
    id?: number;
    message: string;
    envoisId: number;
    agencyId: number;
    userId: number;
    destinataireId: number;
    envoiId: number;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// -------------------- Coupon DTOs --------------------
export interface CouponDto {
    id?: number;
    couponCode: string;
    discountAmount: number;
    discountPercentage: number;
    numberOfUses: number;
    startDate: Date;
    expirationDate?: Date;
    termsAndConditions?: string;
}

// DTO for creating a new coupon
export type CreateCouponDto = Omit<CouponDto, "id">;

// DTO for updating an existing coupon
export interface UpdateCouponDto extends Partial<CreateCouponDto> {
    id: number;
}

export interface MessageBodyDto {
    phone: string
    subject: string
    name: string
    message: string
    email: string
}
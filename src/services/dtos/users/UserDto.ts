// path: src/services/dtos/users/UserDto.ts


// -------------------- User DTOs --------------------
import {Roles} from "@/services/dtos/enums/EnumsDto";
import {AddressDto, AddressResponseDto, UpdateAddressDto} from "@/services/dtos/addresses/AddressDto";

export interface UserDto {
    id: number;
    firstName?: string;
    lastName?: string;
    name?: string;
    birthDate?: Date;
    email: string;
    phoneNumber?: string;
    password?: string;
    image?: string | null;
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
    address: AddressDto; // Adresse complète requise
    verificationTokenExpires: Date; // Date d'expiration du token de vérification de l'email
    verificationToken: string; // Token de vérification de l'email
}

// export interface
export type RegisterClientDto =
    Required<Pick<UserDto, "firstName" | "lastName" | "birthDate" | "phoneNumber" | "email" | "password">>
    & {
    address: AddressDto; // Champ supplémentaire obligatoire
};


// DTO for updating an existing user
export interface UpdateUserDto extends Partial<Omit<UserDto, "id">> {
    id: number; // Required to identify the user to update
}

export type CreateDestinataireDto = Required<Pick<UserDto, "firstName" | "lastName" | "name" | "email" | "phoneNumber" | "image" | "roles">>;

export type UserResponseDto = Required<Pick<UserDto, "id" | "firstName" | "lastName" | "birthDate" | "phoneNumber" | "email" | "image" | "roles">>;


// DTO for User response without a password
export type FullUserResponseDto = Omit<UserDto, "password"> & {
    address: AddressDto;
};


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
    address: AddressResponseDto | UpdateAddressDto;
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
    // address: AddressDto;
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
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    name: string;
    phoneNumber: string;
    Address: AddressResponseDto;
    image: string | null;
    roles: Roles[];
    isVerified: boolean;
    emailVerified: Date | null;
    verificationToken: string | null;
    verificationTokenExpires: Date | null;
}

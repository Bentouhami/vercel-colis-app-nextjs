// path: src/services/dtos/users/UserDto.ts


// -------------------- User DTOs --------------------
import {Roles} from "@/services/dtos/enums/EnumsDto";
import {AddressDto, CreateAddressDto, CreatedAddressDto, UpdateAddressDto} from "@/services/dtos/addresses/AddressDto";

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
    Address: AddressDto;
}


export interface CreateUserDto {
    firstName: string;
    lastName: string;
    name: string;
    birthDate: Date;
    email: string;
    phoneNumber: string;
    password: string;
    verificationToken: string;
    verificationTokenExpires: Date;
    Address: {
        connect: { id: number }; // Associe une adresse existante par son ID
    };
}


// DTO for the created user response
export interface CreatedUserDto {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    birthDate: Date;
    email: string;
    phoneNumber: string;
    image?: string | null;
    roles: Roles[];
    isVerified: boolean;
    addressId: number;
    Address: AddressDto;
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

export type CreateDestinataireDto = Required<Pick<UserDto, "firstName" | "lastName" | "name" | "email" | "phoneNumber" | "image" | "roles">>;

export type UserResponseDto = Required<Pick<UserDto, "id" | "firstName" | "lastName" | "birthDate" | "phoneNumber" | "email" | "image" | "roles">>;


// DTO for User response without a password
export type FullUserResponseDto = Omit<UserDto, "password"> & {
    Address: CreateAddressDto;
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
    name: string;
    phoneNumber: string;
    image: string | null;
    roles: Roles[];
    isVerified: boolean;
    emailVerified: Date | null;
    verificationToken: string | null;
    verificationTokenExpires: Date | null;
}

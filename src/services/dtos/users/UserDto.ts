// path: src/services/dtos/users/UserDto.ts


// -------------------- User DTOs --------------------
import {RoleDto} from "@/services/dtos/enums/EnumsDto";
import {AddressDto, AddressResponseDto, UpdateAddressDto, UserAddressDto} from "@/services/dtos";

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
    role?: RoleDto;
    agencyId?: number;
    isVerified?: boolean;
    emailVerified?: Date;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    userAddresses?: UserAddressDto | null;
}

// DTO for creating a new user
export interface CreateUserDto extends Omit<UserDto, "id" | "isVerified" | "emailVerified" | "userAddresses"> {
    password: string; // Obligatoire
    userAddresses: AddressDto; // Adresse complète requise
    verificationTokenExpires: Date; // Date d'expiration du token de vérification de l'email
    verificationToken: string; // Token de vérification de l'email
}

// export interface
export type RegisterClientDto =
    Required<Pick<UserDto, "firstName" | "lastName" | "birthDate" | "phoneNumber" | "email" | "password">>
    & {
    userAddresses: UserAddressDto; // Champ supplémentaire obligatoire
};


// DTO for updating an existing user
export interface UpdateUserDto extends Partial<Omit<UserDto, "id">> {
    id: number; // Required to identify the user to update
}

export type CreateDestinataireDto = Required<Pick<UserDto, "firstName" | "lastName" | "name" | "email" | "phoneNumber" | "image" | "role">>;

export type UserResponseDto = Required<Pick<UserDto, "id" | "firstName" | "lastName" | "birthDate" | "phoneNumber" | "email" | "image" | "role">>;


// DTO for User response without a password
export type FullUserResponseDto = Omit<UserDto, "password"> & {
    userAddresses: UserAddressDto;
};


export interface DestinataireResponseWithRoleDto {
    id: number;
    firstName: string;
    lastName: string;
    name: string | null;
    email: string;
    phoneNumber: string;
    image: string | null; // Allow null here
    role: RoleDto;
}

export interface BaseUserDto extends CreateDestinataireDto {
    birthDate: Date;
    userAddresses: AddressResponseDto | UpdateAddressDto;
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
    role: RoleDto;
    userAddresses: UserAddressDto;
    image: string | '',
    isVerified: boolean;
    emailVerified: Date;
    verificationToken: string;
    verificationTokenExpires: Date;
    userAddressesId: number;
}

// Register and Login DTOs
export interface FullUserDto extends BaseClientDto {
    id: number;
    role: RoleDto;
    image: string | '',
    isVerified: boolean;
    emailVerified: Date;
    verificationToken: string;
    verificationTokenExpires: Date;
}

// Register and Login DTOs
export interface CreateFullUserDto extends BaseClientDto {
    role: RoleDto;
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
    userAddresses: UserAddressDto;
    image: string | null;
    role: RoleDto;
    isVerified: boolean;
    emailVerified: Date | null;
    verificationToken: string | null;
    verificationTokenExpires: Date | null;
}


export interface UserLoginDto {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    name: string;
    phoneNumber: string;
    userAddresses: UserAddressDto;
    image: string | null;
    role: RoleDto;
    isVerified: boolean;
    emailVerified: Date | null;
    verificationToken: string | null;
    verificationTokenExpires: Date | null;
}


// DTO for User Profile
export interface ProfileDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    name: string;
    phoneNumber: string;
    userAddresses: UserAddressDto;
    image: string | null;
    role: RoleDto;
    isVerified: boolean;
}


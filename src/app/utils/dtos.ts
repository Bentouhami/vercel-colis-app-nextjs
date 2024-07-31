// DTO for Address
import {Address} from "@prisma/client";

export interface CreateAddressDto {

    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}

// DTO for User update
export interface UpdateAddressDto {

    street: string;
    number: string;
    city: string;
    zipCode: string;
    country: string;
}

// DTO for User create
export interface CreateUserDto {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: boolean;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    address: CreateAddressDto;
}

// DTO for User response
export interface UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: boolean;
    phoneNumber: string;
    email: string;
    role: string;
}

// DTO for User login
export interface LoginUserDto {
    email: string;
    password: string;
}

// DTO for User update profile
export interface UpdateUserProfileDto {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: boolean;
    phoneNumber?: string;
    email?: string;
    password?: string;
    Address?: CreateAddressDto;
}

// DTO for Agency
export interface AgencyDto {
    id: number;
    name: string;
    location: string;
    address: Address;
}


// Parcel Dto
export interface ParcelDto {
    height: number; // hauteur en cm
    width: number; // largeur en cm
    length: number; // longueur en cm
    weight: number; // poids en kg
}
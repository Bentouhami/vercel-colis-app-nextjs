// path: src/services/mappers/AddressMapper.ts

import {Address as AddressPrisma} from '@prisma/client'
import {AddressDto, AddressResponseDto} from "@/services/dtos";

export class AddressMapper {
    // Map Prisma Address to AddressDto
    static toDto(address: AddressPrisma): AddressDto {
        return {
            id: address.id,
            street: address.street,
            number: address.number || '',
            city: address.city,
            zipCode: address.zipCode,
            country: address.country,
            latitude: address.latitude || undefined,
            longitude: address.longitude || undefined
        }
    }

    // Map Prisma Address to Create Address DTO
    static toResponseDto(address: AddressPrisma): AddressResponseDto {
        return {
            id: address.id ?? null,
            number: address.number || '',
            street: address.street,
            city: address.city,
            zipCode: address.zipCode,
            country: address.country
        }
    }

    static toUpdateDto(address: AddressPrisma): AddressDto {
        return {
            id: address.id,
            street: address.street,
            number: address.number || '',
            city: address.city,
            zipCode: address.zipCode,
            country: address.country,
            latitude: address.latitude || undefined,
            longitude: address.longitude || undefined
        }
    }
}
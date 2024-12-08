// path: src/services/mappers/AddressMapper.ts

import {Address as PrismaAddress} from '@prisma/client'
import {AddressDto, CreateAddressDto} from "@/services/dtos";

export class AddressMapper {
    // Map Prisma Address to AddressDto
    static toDto(address: PrismaAddress): AddressDto {
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
    static toCreateDto(address: PrismaAddress): CreateAddressDto {
        return {
            street: address.street,
            number: address.number || '',
            city: address.city,
            zipCode: address.zipCode,
            country: address.country
        }
    }

    static toUpdateDto(address: PrismaAddress): AddressDto {
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
// path: src/services/mappers/AddressMapper.ts

import {Address as PrismaAddress} from '@prisma/client'
import {AddressDto, CreateAddressDto, CreatedAddressDto, FoundAddressDto} from "@/services/dtos";

export class AddressMapper {
    // Map Prisma Address to AddressDto
    static toDto(address: PrismaAddress): CreatedAddressDto {
        return {
            id: address.id,
            street: address.street,
            number: address.number || '',
            city: address.city,
            zipCode: address.zipCode,
            country: address.country,
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

    // Map Prisma Address to Found Address DTO
    static toFoundAddressDto(address: PrismaAddress): CreatedAddressDto {
        return {
            id: address.id,
            street: address.street,
            number: address.number || '',
            city: address.city,
            zipCode: address.zipCode,
            country: address.country,
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
        }
    }

    static toCreatedAddressDto(createdAddress: PrismaAddress): CreatedAddressDto {
        return {
            id: createdAddress.id,
            street: createdAddress.street,
            number: createdAddress.number || '',
            city: createdAddress.city,
            zipCode: createdAddress.zipCode,
            country: createdAddress.country,
        }
    }

    // Map many Prisma Address to Created Address DTO
    static toAddressesDtos(createdAddresses: PrismaAddress[]): AddressDto[] {
        return createdAddresses.map(this.toDto);
    }
}
// path: src/backend-services/Bk_AddressService.ts
'use server';
import {AddressDto, AddressResponseDto, UpdateAddressDto} from "@/services/dtos";
import prisma from "@/utils/db";

/**
 * Check if address already exists in the database by street, number, city, zipCode and country fields
 * @param address - address object
 * @returns {Promise<UpdateAddressDto | null>} address or null
 */
export async function isAddressAlreadyExist(address: AddressResponseDto): Promise<AddressDto | null> {
    try {
        const addressFound = await prisma.address.findFirst({
            where: {
                street: address.street,
                number: address.number,
                city: address.city,
                zipCode: address.zipCode,
                country: address.country,
            },
            select: {
                id: true,
                street: true,
                number: true,
                city: true,
                zipCode: true,
                country: true,
            }

        }) as AddressDto;

        if (!addressFound) {
            return null;
        }
        return addressFound;
    } catch (error) {
        console.error("Error checking address:", error);
        throw error;
    }
}

/**
 * Create address in the database
 * @param address - address object
 * @param address
 * @returns {Promise<UpdateAddressDto | null>} address or null
 */
export async function createAddress(address: AddressResponseDto): Promise<AddressDto | null> {
    try {
        const addressCreated = await prisma.address.create({
            data: {
                street: address.street,
                number: address.number,
                city: address.city,
                zipCode: address.zipCode,
                country: address.country,
            },
            select: {
                id: true,
                street: true,
                number: true,
                city: true,
                zipCode: true,
                country: true,
            }
        }) as AddressDto;

        if (!addressCreated) {
            return null;
        }
        return addressCreated;
    } catch (error) {
        console.error("Error creating address:", error);
        throw error;
    }
}
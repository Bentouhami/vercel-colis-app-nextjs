// path: src/backend-services/AddresseService.ts
'use server';
import {BaseAddressDTO, FullAddressDTO} from "@/utils/dtos";
import prisma from "@/utils/db";

/**
 * Check if address already exists in the database by street, number, city, zipCode and country fields
 * @param address - address object
 * @returns {Promise<FullAddressDTO | null>} address or null
 */
export async function isAddressAlreadyExist(address: BaseAddressDTO): Promise<FullAddressDTO | null> {
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

        }) as FullAddressDTO;

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
 * @returns {Promise<FullAddressDTO | null>} address or null
 */
export async function createAddress(address: BaseAddressDTO): Promise<FullAddressDTO | null> {
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
        }) as FullAddressDTO;

        if (!addressCreated) {
            return null;
        }
        return addressCreated;
    } catch (error) {
        console.error("Error creating address:", error);
        throw error;
    }
}
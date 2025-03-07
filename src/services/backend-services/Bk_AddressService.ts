// path: src/backend-services/Bk_AddressService.ts
'use server';
import {AddressDto, AddressResponseDto, UpdateAddressDto, UserAddressDto} from "@/services/dtos";
import prisma from "@/utils/db";

/**
 * Check if address already exists in the database by street, streetNumbe, city, zipCode and country fields
 * @param address - address object
 * @returns {Promise<UpdateAddressDto | null>} address or null
 */
export async function getAddressByStreetAndCityId(address: UserAddressDto): Promise<AddressDto | null> {
    try {
        // Vérifier si le pays existe
        const country = await prisma.country.findFirst({
            where: {name: address.city.country.name},
            select: {
                id: true,
                name: true
            }

        });

        if (!country) {
            console.error(`Le pays '${address.city.country.name}' n'existe pas.`);
            return null;
        }

        // Vérifier si la ville existe dans ce pays
        const city = await prisma.city.findFirst({
            where: {
                name: address.city.name,
                countryId: country.id
            },
            select: {
                id: true,
                name: true,
                country: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }

        });

        if (!city) {
            console.error(`La ville '${address.city}' n'existe pas dans '${address.city.country.name}'.`);
            return null;
        }

        // Vérifier si l'adresse existe avec cityId et countryId
        const addressFound = await prisma.address.findFirst({
            where: {
                street: address.street,
                streetNumber: address.streetNumber,
                cityId: city.id,
            },
            select: {
                id: true,
                street: true,
                streetNumber: true,
                cityId: true,
                city: {
                    select: {
                        id: true,
                        name: true,
                        country: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
            }
        });

        return addressFound || null;
    } catch (error) {
        console.error("Erreur lors de la vérification de l'adresse :", error);
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
                streetNumbe: address.streetNumbe,
                city: address.city,
                zipCode: address.zipCode,
                country: address.country,
            },
            select: {
                id: true,
                street: true,
                streetNumbe: true,
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

export async function getAllAddresses(): Promise<AddressDto | null> {

    const addresses = await addressRepository.getAllAddresses();


    return null;

}
// path: src/backend-services/Bk_AddressService.ts
'use server';
import {AddressDto, UpdateAddressDto} from "@/services/dtos";
import prisma from "@/utils/db";
import {FrontendAddressType} from "@/utils/validationSchema";

/**
 * Check if address already exists in the database by street, streetNumber, city, zipCode and country fields
 * @param address - address object
 * @returns {Promise<UpdateAddressDto | null>} address or null
 */
export async function getAddressByStreetAndCityId(address: FrontendAddressType): Promise<AddressDto | null> {
    try {
        // Vérifier si le pays existe
        const country = await prisma.country.findFirst({
            where: {name: address.country},
            select: {
                id: true,
                name: true
            }

        });

        if (!country) {
            console.error(`Le pays '${address.city}' n'existe pas.`);
            return null;
        }

        // Vérifier si la ville existe dans ce pays
        const city = await prisma.city.findFirst({
            where: {
                name: address.city,
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
            console.error(`La ville '${address.city}' n'existe pas dans '${address.city}'.`);
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
                boxNumber: true,
                complement: true,
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

        if (!addressFound) {
            console.error("Error getting address:");
            return null;
        }
        // prepare address obj to be returned

        const addressObj = function () {
            return {
                id: addressFound.id,
                street: addressFound.street,
                complement: addressFound.complement,
                streetNumber: addressFound.streetNumber,
                boxNumber: addressFound.boxNumber,
                cityId: addressFound.cityId,

                city: {
                    id: addressFound.city.id,
                    name: addressFound.city.name,

                    country: {
                        id: addressFound.city.country.id,
                        name: addressFound.city.country.name,
                    }
                }
            };
        }()

        return addressObj || null;
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
export async function createAddress(address: FrontendAddressType): Promise<AddressDto | null> {
    try {

        const addressCreated = await prisma.$transaction(async (tx) => {
            // Find Country
            const country = await tx.country.findFirst({
                where: {name: address.city},
                select: {id: true},
            });
            if (!country) throw new Error("Le pays spécifié est introuvable.");

            //  Find City
            const city = await tx.city.findFirst({
                where: {name: address.city, countryId: country.id},
                select: {id: true},
            });
            if (!city) throw new Error("La ville spécifiée est introuvable.");

            // Find/Create Address
            let existingAddress = await tx.address.findFirst({
                where: {street: address.street, streetNumber: address.streetNumber, cityId: city.id},
                select: {
                    id: true,
                    street: true,
                    streetNumber: true,
                    cityId: true,
                    boxNumber: true,
                    complement: true,
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
                },
            });

            if (!existingAddress) {
                existingAddress = await tx.address.create({
                    data: {
                        street: address.street!,
                        complement: address.complement ? address.complement : null,
                        streetNumber: address.streetNumber,
                        boxNumber: address.boxNumber || null,
                        cityId: city.id,
                    },
                    select: {
                        id: true,
                        street: true,
                        streetNumber: true,
                        cityId: true,
                        boxNumber: true,
                        complement: true,
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
            }

            return existingAddress;
        });

        if (!addressCreated) {
            return null;
        }
        return addressCreated;
    } catch (error) {
        console.error("Error creating address:", error);
        throw error;
    }
}


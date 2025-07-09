// path: src/services/repositories/addresses/AddressRepository.ts

import {AddressDto, AgencyAddressDto, CreateAddressDto, UpdateAddressDto, UserAddressDto} from "@/services/dtos";
import { prisma } from "@/utils/db";
import {IAddressRepository} from "@/services/repositories/addresses/IAddressRepository";
import {undefined} from "zod";
import {FrontendAddressType} from "@/utils/validationSchema";

export class AddressRepository implements IAddressRepository {

    async getAddressByStreetAndCityId(street: string, cityId: number): Promise<AddressDto | null> {
        try {
            const address = await prisma.address.findFirst({
                where: {
                    street: street,
                    cityId: cityId,
                },
                select: {
                    id: true,
                    street : true,
                    streetNumber: true,
                    complement: true,
                    boxNumber: true,
                    city: {
                        select: {
                            id: true,
                            name: true,
                            country: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!address) {
                console.error("Error getting address:");
            }

            // prepare the address object to return
            const addressObj: AddressDto = {
                id: address?.id,
                street: address?.street!,
                complement: address?.complement,
                streetNumber: address?.streetNumber,
                boxNumber: address?.boxNumber,
                cityId: address?.city.id,
                city: address?.city!,
            };
            return addressObj;
        } catch (error) {
            console.error("Error getting address:", error);
            throw error;
        }
    }

    async createAddress(addressData: FrontendAddressType): Promise<AddressDto | null> {
        try {
            const addressCreated = await prisma.$transaction(async (tx) => {
                // Find Country
                const country = await tx.country.findFirst({
                    where: {name: addressData.country},
                    select: {id: true},
                });
                if (!country) throw new Error("Le pays spécifié est introuvable.");

                //  Find City
                const city = await tx.city.findFirst({
                    where: {name: addressData.city, countryId: country.id},
                    select: {id: true},
                });
                if (!city) throw new Error("La ville spécifiée est introuvable.");

                // Find/Create Address
                let existingAddress = await tx.address.findFirst({
                    where: {street: addressData.street, streetNumber: addressData.streetNumber, cityId: city.id},
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
                            street: addressData.street!,
                            complement: addressData.complement ? addressData.complement : null,
                            streetNumber: addressData.streetNumber,
                            boxNumber: addressData.boxNumber || null,
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

                // prepare address obj to be returned

                const addressObj = function () {
                    return {
                        id: existingAddress.id,
                        street: existingAddress.street,
                        complement: existingAddress.complement,
                        streetNumber: existingAddress.streetNumber,
                        boxNumber: existingAddress.boxNumber,
                        cityId: existingAddress.cityId,

                        city: {
                            id: existingAddress.cityId,
                            name: existingAddress.city.name,

                            country: {
                                id: existingAddress.city.country.id,
                                name: existingAddress.city.country.name,
                            }
                        }
                    };
                }()

                return existingAddress;
            });

            if(!addressCreated){
                return null;
            }
            return addressCreated;

        } catch (error) {
            console.error("Error creating address:", error);
            throw error;
        }
    }

    async deleteAddress(addressId: number): Promise<void> {

    }

    async updateAddress(addressData: UpdateAddressDto): Promise<AddressDto | null> {
        return null;
    }
}

export const addressRepository = new AddressRepository();

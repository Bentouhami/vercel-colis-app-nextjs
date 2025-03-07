// path: src/services/repositories/envois/EnvoiRepository.ts

import {
    AgencyAddressDto, AgencyDto,
    EnvoiDto,
    EnvoiStatus,
    RoleDto,
    SimulationStatus,
    UserAddressDto,
    UserDto
} from "@/services/dtos";
import {IEnvoiRepository} from "@/services/repositories/envois/IEnvoiRepository";
import {envoiDAO} from "@/services/dal/DAO/envois/EnvoiDAO";
import {simulationRepository} from "@/services/repositories/simulations/SimulationRepository";
import prisma from "@/utils/db";
import {PaymentSuccessDto} from "@/services/dtos/envois/PaymentSuccessDto";

/**
 * This class provides methods for interacting with the envoi table in the database.
 * @class EnvoiRepository
 * @description This class is responsible for handling database operations related to envois. It provides methods for retrieving envois from the database.
 * @implements {IEnvoiRepository}
 *
 */
class EnvoiRepository implements IEnvoiRepository {

    /**
     * getEnvoiById
     * @describe('envoiId', () => {
     *      description: 'The ID of the envoi to retrieve',
     *      required: true,
     *      type: 'number',
     *  })
     * @param envoiId
     */
    async getEnvoiById(envoiId: number): Promise<EnvoiDto | null> {
        const envoi = await simulationRepository.getSimulationWithParcelsById(envoiId);

        if (!envoi) {
            return null;
        }
        return envoi;
    }

    /**
     * updateEnvoi
     * @describe('envoi', () => {
     *      description: 'The updated envoi data',
     *      required: true,
     *      type: 'UpdateEnvoiDto',
     *  })
     * @param id
     * @param data
     * @returns UpdatedEnvoiDto if updated or null if not
     */
    async updateEnvoi(id: number, data: any): Promise<EnvoiDto | null> {
        if (!data) {
            throw new Error("Envoi data not found");
        }

        try {
            console.log(
                "log ====> envoi in updateEnvoi in EnvoiRepository.ts in path: src/services/repositories/envois/EnvoiRepository.ts is : ",
                data
            );

            // Pass the updated data to the DAO
            const envoi = await prisma.envoi.update({
                where: { id },
                data,
                include: {
                    client: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            name: true,
                            birthDate: true,
                            email: true,
                            phoneNumber: true,
                            image: true,
                            role: true,
                            isVerified: true,
                            emailVerified: true,
                            verificationToken: true,
                            verificationTokenExpires: true,
                            userAddresses: {
                                select: {
                                    address: {
                                        select: {
                                            id: true,
                                            cityId: true,
                                            complement: true,
                                            street: true,
                                            streetNumber: true,
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
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        },
                    },
                    destinataire: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            name: true,
                            birthDate: true,
                            email: true,
                            phoneNumber: true,
                            image: true,
                            role: true,
                            isVerified: true,
                            emailVerified: true,
                            verificationToken: true,
                            verificationTokenExpires: true,
                            userAddresses: {
                                select: {
                                    address: {
                                        select: {
                                            id: true,
                                            cityId: true,
                                            complement: true,
                                            street: true,
                                            streetNumber: true,
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
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        },
                    },
                    departureAgency: {
                        select: {
                            id: true,
                            name: true,
                            location: true,
                            addressId: true,
                            capacity: true,
                            availableSlots: true,
                            createdAt: true,
                            updatedAt: true,
                            address: {
                                select: {
                                    id: true,
                                    cityId: true,
                                    complement: true,
                                    street: true,
                                    streetNumber: true,
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
                            },
                        },
                    },
                    arrivalAgency: {
                        select: {
                            id: true,
                            name: true,
                            location: true,
                            addressId: true,
                            capacity: true,
                            availableSlots: true,
                            createdAt: true,
                            updatedAt: true,
                            address: {
                                select: {
                                    id: true,
                                    cityId: true,
                                    complement: true,
                                    street: true,
                                    streetNumber: true,
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
                            },
                        },
                    },
                    parcels: {
                        select: {
                            id: true,
                            envoiId: true,
                            weight: true,
                            length: true,
                            width: true,
                            height: true,
                        },
                    },
                },
            });
            if (!envoi) {
                return null;
            }

            console.log(
                "log ====> response found in updateEnvoi function after updating envoi in path: src/services/repositories/envois/EnvoiRepository.ts is : ",
                envoi
            );

            // Map the updated response back to DTO

            console.log("log ====> envoi in getSimulationWithParcelsById function called in src/services/frontend-services/envoi/SimulationService.ts is : ", envoi);

            // prepare the parcels object to return as ParcelDto[]
            const parcels = envoi.parcels.map(parcel => ({

                id: parcel.id,
                envoiId: parcel.envoiId,
                height: parcel.height.toNumber(),
                weight: parcel.weight.toNumber(),
                width: parcel.width.toNumber(),
                length: parcel.length.toNumber(),
            }));

            // prepare envoiStatus object to return as EnvoiStatusDto
            const envoiStatus = envoi.envoiStatus as EnvoiStatus;

            // prepare simulationStatus object to return as SimulationStatusDto
            const simulationStatus = envoi.simulationStatus as SimulationStatus;

            // prepare clientAddress object to return as AddressDto
            const clientUserAddress = envoi.client?.userAddresses[0].address;

            const clientAddresses: UserAddressDto = {
                id: clientUserAddress?.id,
                street: clientUserAddress?.street,
                complement: clientUserAddress?.complement!,
                streetNumber: clientUserAddress?.streetNumber!,
                boxNumber: clientUserAddress?.boxNumber!,
                cityId: clientUserAddress?.cityId!,
                city: {
                    id: clientUserAddress?.city?.id!,
                    name: clientUserAddress?.city?.name!,
                    country: {
                        id: clientUserAddress?.city?.country?.id!,
                        name: clientUserAddress?.city?.country?.name!,
                    }
                }
            };

            // prepare a client object to return as UserDto
            const client: UserDto = {
                id: envoi.client?.id!,
                firstName: envoi.client?.firstName ?? '',
                lastName: envoi.client?.lastName ?? '',
                name: envoi.client?.name ? `${envoi.client?.lastName} ${envoi.client?.firstName}` : '',
                birthDate: envoi.client?.birthDate!,
                email: envoi.client?.email ?? '',
                phoneNumber: envoi.client?.phoneNumber ?? '',
                image: envoi.client?.image,
                role: envoi.client?.role as RoleDto,
                isVerified: envoi.client?.isVerified || false,
                emailVerified: envoi.client?.emailVerified ?? new Date(),
                verificationToken: envoi.client?.verificationToken ?? '',
                verificationTokenExpires: envoi.client?.verificationTokenExpires ?? new Date(),
                userAddresses: clientAddresses,
            };

            // prepare clientAddress object to return as AddressDto
            // Prepare addresses array
            const destinataireAddresses = envoi.destinataire?.userAddresses ?? [];
            const destinataireUserAddress = destinataireAddresses.length
                ? destinataireAddresses[0].address
                : null;

            // 1) Define this variable in the parent scope (not just in the if/else).
            let destinataireAddress: UserAddressDto | null = null;

            if (!destinataireUserAddress) {
                // If no address found, either skip or fill with defaults
                // For example:
                destinataireAddress = null;
            } else {
                // 2) Assign it here:
                destinataireAddress = {
                    id: destinataireUserAddress.id,
                    street: destinataireUserAddress.street,
                    complement: destinataireUserAddress.complement ?? '',
                    streetNumber: destinataireUserAddress.streetNumber ?? '',
                    boxNumber: destinataireUserAddress.boxNumber ?? '',
                    cityId: destinataireUserAddress.cityId ?? 0,
                    city: {
                        id: destinataireUserAddress.city?.id ?? 0,
                        name: destinataireUserAddress.city?.name ?? '',
                        country: {
                            id: destinataireUserAddress.city?.country?.id ?? 0,
                            name: destinataireUserAddress.city?.country?.name ?? '',
                        },
                    },
                };
            }

            // 3) Now `destinataireAddress` is in scope for creating the user DTO:
            const desinataire: UserDto = {
                id: envoi.destinataire?.id!,
                firstName: envoi.destinataire?.firstName ?? '',
                lastName: envoi.destinataire?.lastName ?? '',
                name: envoi.destinataire?.name
                    ? `${envoi.destinataire?.lastName} ${envoi.destinataire?.firstName}`
                    : '',
                birthDate: envoi.destinataire?.birthDate!,
                email: envoi.destinataire?.email ?? '',
                phoneNumber: envoi.destinataire?.phoneNumber ?? '',
                image: envoi.destinataire?.image,
                role: envoi.destinataire?.role as RoleDto,
                isVerified: envoi.destinataire?.isVerified || false,
                emailVerified: envoi.destinataire?.emailVerified ?? new Date(),
                verificationToken: envoi.destinataire?.verificationToken ?? '',
                verificationTokenExpires: envoi.destinataire?.verificationTokenExpires ?? new Date(),

                // 4) Set userAddresses to either the built address or null
                userAddresses: destinataireAddress,
            };


            // prepare the departure agency address object to return as AgencyAddressDto

            const departureAgencyAddress: AgencyAddressDto = {
                id: envoi.departureAgency?.address?.id,
                street: envoi.departureAgency?.address?.street,
                complement: envoi.departureAgency?.address?.complement!,
                streetNumber: envoi.departureAgency?.address?.streetNumber!,
                boxNumber: envoi.departureAgency?.address?.boxNumber!,
                cityId: envoi.departureAgency?.address?.cityId!,
                city: {
                    id: envoi.departureAgency?.address?.city?.id!,
                    name: envoi.departureAgency?.address?.city?.name!,
                    country: {
                        id: envoi.departureAgency?.address?.city?.country?.id!,
                        name: envoi.departureAgency?.address?.city?.country?.name!,
                    }
                }
            };

            // prepare departureAgency object to return as AgencyDto
            const departureAgency: AgencyDto = {
                id: envoi.departureAgency?.id,
                name: envoi.departureAgency?.name ?? '',
                location: envoi.departureAgency?.location!,
                addressId: envoi.departureAgency?.addressId!,
                address: departureAgencyAddress,
                capacity: envoi.departureAgency?.capacity!,
                availableSlots: envoi.departureAgency?.availableSlots!,
                createdAt: envoi.departureAgency?.createdAt!,
                updatedAt: envoi.departureAgency?.updatedAt!,
            };

            // prepare the arrival agency address object to return as AgencyAddressDto

            const arrivalAgencyAddress: AgencyAddressDto = {
                id: envoi.arrivalAgency?.address?.id,
                street: envoi.arrivalAgency?.address?.street,
                complement: envoi.arrivalAgency?.address?.complement!,
                streetNumber: envoi.arrivalAgency?.address?.streetNumber!,
                boxNumber: envoi.arrivalAgency?.address?.boxNumber!,
                cityId: envoi.arrivalAgency?.address?.cityId!,
                city: {
                    id: envoi.arrivalAgency?.address?.city?.id!,
                    name: envoi.arrivalAgency?.address?.city?.name!,
                    country: {
                        id: envoi.arrivalAgency?.address?.city?.country?.id!,
                        name: envoi.arrivalAgency?.address?.city?.country?.name!,
                    }
                }
            };

            // prepare arrivalAgency object to return as AgencyDto
            const arrivalAgency: AgencyDto = {
                id: envoi.arrivalAgency?.id!,
                name: envoi.arrivalAgency?.name!,
                location: envoi.arrivalAgency?.location!,
                addressId: envoi.arrivalAgency?.addressId!,
                address: arrivalAgencyAddress,
                capacity: envoi.arrivalAgency?.capacity!,
                availableSlots: envoi.arrivalAgency?.availableSlots!,
                createdAt: envoi.arrivalAgency?.createdAt!,
                updatedAt: envoi.arrivalAgency?.updatedAt!,
            }

            // finally, prepare the envoi object to return as SimulationResponseDto
            const simulationObj: EnvoiDto = {
                id: envoi.id,
                trackingNumber: envoi.trackingNumber ?? '',
                qrCodeUrl: envoi.qrCodeUrl ?? '',
                envoiStatus: envoi.envoiStatus as EnvoiStatus,
                simulationStatus: envoi.simulationStatus as SimulationStatus,
                paid: envoi.paid,
                userId: envoi.userId!,
                destinataireId: envoi.destinataireId!,
                transportId: envoi.transportId!,
                departureAgencyId: envoi.departureAgencyId,
                arrivalAgencyId: envoi.arrivalAgencyId,
                totalWeight: envoi.totalWeight,
                totalVolume: envoi.totalVolume,
                totalPrice: envoi.totalPrice,
                departureDate: envoi.departureDate,
                arrivalDate: envoi.arrivalDate,
                verificationToken: envoi.verificationToken,
                comment: envoi.comment ?? undefined,
                parcels,
                client: client,
                destinataire: desinataire,
                arrivalAgency: arrivalAgency,
                departureAgency: departureAgency,

            };
            // map the envoi to a SimulationRequestDto and return it
            return simulationObj;

        } catch (error) {
            console.error("Error updating envoi:", error);
            throw new Error("Error updating envoi");
        }
    }


    /**
     * cancelSimulation
     * @describe('envoiId', () => {
     *      description: 'The ID of the envoi to cancel',
     *      required: true,
     *      type: 'number',
     *  })
     * @param envoiId
     */
    async cancelSimulation(envoiId: number): Promise<void> {
        await envoiDAO.cancelSimulation(envoiId);
    }

    /**
     * deleteParcelsByEnvoiId
     * @describe('envoiId', () => {
     *      description: 'The ID of the envoi to delete the parcels from',
     *      required: true,
     *      type: 'number',
     *  })
     * @param envoiId
     */
    async deleteParcelsByEnvoiId(envoiId: number) {
        await envoiDAO.deleteParcelsByEnvoiId(envoiId);
    }

    /**
     * Get payment success data by ID
     * @return PaymentSuccessDto
     * @param id
     */
    async getPaymentSuccessDataById(id: number): Promise<PaymentSuccessDto | null> {
        // Return only the fields needed for PaymentSuccessDto
        const envoi = await prisma.envoi.findUnique({
            where: { id },
            select: {
                id: true,
                paid: true,
                simulationStatus: true,
                trackingNumber: true,
                qrCodeUrl: true,
                userId: true,
                arrivalAgencyId: true,
            },
        });

        if (!envoi) {
            return null;
        }

        // Return it directly, or map it if you want to rename fields, etc.
        // Because 'envoi' matches PaymentSuccessDto exactly, we can return as-is:
        return envoi as PaymentSuccessDto;
    }
}

export const envoiRepository = new EnvoiRepository();
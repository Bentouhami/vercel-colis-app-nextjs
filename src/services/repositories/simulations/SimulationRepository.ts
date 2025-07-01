// path: src/services/repositories/SimulationRepository.ts

import {ISimulationRepository} from "@/services/repositories/simulations/ISimulationRepository";
import {
    AgencyAddressDto,
    AgencyDto,
    CreatedSimulationResponseDto,
    CreateSimulationRequestDto,
    EnvoiDto,
    EnvoiStatus,
    RoleDto,
    SimulationResponseDto,
    SimulationStatus,
    SimulationSummaryDto,
    UserAddressDto,
    UserDto
} from "@/services/dtos";
import {simulationDAO} from "@/services/dal/DAO/simulations/SimulationDAO";
import prisma from "@/utils/db";

/**
 * @class SimulationRepository
 * @classdesc This class is responsible for handling database operations related to simulations. it uses the SimulationDAO to interact with the database, and mappers to convert data between the database and the frontend.
 * @implements {ISimulationRepository}
 */
export class SimulationRepository implements ISimulationRepository {


    /**
     * getSimulationResponseById
     * @describe('id', () => {
     *      description: 'The ID of the simulation to retrieve',
     *      required: true,
     *      type: 'number',
     *  })

     * @returns SimulationResponseDto if found or null if not
     * @param envoiId
     */
    async getSimulationResponseById(envoiId: number): Promise<SimulationResponseDto | null> {

        if (!envoiId) {
            return null;
        }
        try {

            const simulation = await prisma.envoi.findUnique({
                where: {id: envoiId},
                include: {
                    departureAgency: {
                        select: {
                            id: true,
                            name: true,
                            address: {
                                select: {
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
                            address: {
                                select: {
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
                            weight: true,
                            length: true,
                            width: true,
                            height: true,
                        },
                    },
                },
            });

            // Check if the simulation exists
            if (!simulation) {
                return null;
            }


            // Prepare the simulation object to return as SimulationResponseDto
            const simulationObj: SimulationResponseDto = {
                id: simulation.id,
                userId: simulation.userId,
                destinataireId: simulation.destinataireId,
                simulationStatus: simulation.simulationStatus as SimulationStatus,
                envoiStatus: simulation.envoiStatus as EnvoiStatus,
                totalWeight: simulation.totalWeight,
                totalVolume: simulation.totalVolume,
                totalPrice: simulation.totalPrice,
                departureDate: simulation.departureDate,
                arrivalDate: simulation.arrivalDate,
                departureCountry: simulation.departureAgency?.address?.city.country.name,
                departureCity: simulation.departureAgency?.address?.city.name,
                departureAgency: simulation.departureAgency?.name,
                destinationCountry: simulation.arrivalAgency?.address?.city.country.name,
                destinationCity: simulation.arrivalAgency?.address?.city.name,
                destinationAgency: simulation.arrivalAgency?.name,
                parcels: simulation.parcels.map(parcel => ({
                    weight: parcel.weight.toNumber(),
                    length: parcel.length.toNumber(),
                    width: parcel.width.toNumber(),
                    height: parcel.height.toNumber(),
                })),
            };

            return simulationObj ? simulationObj : null;
            // Handle any errors that may occur during the mapping process
        } catch (error) {
            console.error("Error getting simulation:", error);
            throw error;
        }
    }

    /**
     * createSimulation
     * @describe('simulationData', () => {
     *      description: 'The data to create the simulation',
     *      required: true,
     *      type: 'CreateSimulationRequestDto',
     *  })
     * @param simulationData
     * @returns CreatedSimulationResponseDto if created or null if not
     */
    async createSimulation(simulationData: CreateSimulationRequestDto): Promise<CreatedSimulationResponseDto | null> {

        if (!simulationData) {
            throw new Error("Simulation data not found");
        }

        try {
            const simulation = await prisma.envoi.create({
                data: {
                    departureAgencyId: simulationData.departureAgencyId,
                    arrivalAgencyId: simulationData.arrivalAgencyId,
                    simulationStatus: simulationData.simulationStatus,
                    envoiStatus: simulationData.envoiStatus,
                    totalWeight: simulationData.totalWeight,
                    totalVolume: simulationData.totalVolume,
                    totalPrice: simulationData.totalPrice,
                    departureDate: simulationData.departureDate,
                    arrivalDate: simulationData.arrivalDate,
                    userId: simulationData.userId ? simulationData.userId : null,
                    destinataireId: simulationData.destinataireId ? simulationData.destinataireId : null,
                    parcels: {
                        create: simulationData.parcels.map(parcel => ({
                            height: parcel.height,
                            width: parcel.width,
                            length: parcel.length,
                            weight: parcel.weight,
                        })),
                    },
                },

            });
            if (!simulation) {
                return null;
            }

            // Prepare the simulation object to return as CreatedSimulationResponseDto and return it
            const simulationObj: CreatedSimulationResponseDto = {
                id: simulation.id,
                verificationToken: simulation.verificationToken,
            };

            if (!simulationObj) {
                return null;
            }
            return simulationObj;

        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la simulation:", error);
            throw error;
        }

    }

    /**
     * updateSimulationUserId
     * @describe('simulationId', () => {
     *      description: 'The ID of the simulation to update',
     *      required: true,
     *      type: 'number',
     *  })
     * @describe('userId', () => {
     *      description: 'The new user ID',
     *      required: true,
     *      type: 'number',
     *  })
     * @param simulationId
     * @param userId
     * @returns void if updated or null if not
     */
    async updateSimulationUserId(simulationId: number, userId: number): Promise<void | null> {
        const response = await simulationDAO.updateSimulationUserId(simulationId, userId);

        if (!response) {
            return null;
        }

    }

    /**
     * updateSimulationDestinataireId,
     * updateSimulation destinataireId
     * @describe('simulationId', () => {
     *      description: 'The ID of the simulation to update',
     *      required: true,
     *      type: 'number',
     *  })
     * @describe('destinataireId', () => {
     *      description: 'The new destinataire ID',
     *      required: true,
     *      type: 'number',
     *  })
     * @param simulationId
     * @param destinataireId
     * @returns boolean if updated or null if not
     */
    async updateSimulationDestinataireId(simulationId: number, destinataireId: number): Promise<boolean> {

        if (!simulationId || !destinataireId) {
            throw new Error("Invalid simulation or destinataire ID");
        }

        const response = await simulationDAO.updateSimulationDestinataireId(simulationId, destinataireId);
        if (!response) {
            return false;
        }
        return true;

    }

    /**
     * updateSimulation, update simulation in database.
     * @describe('simulationId', () => {
     *      description: 'The ID of the simulation to update',
     *      required: true,
     *      type: 'number',
     *  })
     * @describe('simulation', () => {
     *      description: 'The updated simulation data',
     *      required: true,
     *      type: 'any',
     *  })
     * @param simulationId
     * @param simulation
     * @returns void if updated or null if not
     */
    async updateSimulation(simulationId: number, simulation: any): Promise<void | null> {
        await simulationDAO.updateSimulation(simulationId, simulation);

    }

    /**
     * getSimulationWithParcelsById, get simulation with parcels by id from database
     * @describe('id', () => {
     *      description: 'The ID of the simulation to retrieve',
     *      required: true,
     *      type: 'number',
     *  })
     * @param id
     * @returns any if found or null if not
     */
    async getSimulationWithParcelsById(id: number): Promise<EnvoiDto | null> {

        if (!id) return null;
        try {
            const simulation = await prisma.envoi.findUnique({
                where: {id},
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

            if (!simulation) {
                return null;
            }

            // prepare the parcels object to return as ParcelDto[]
            const parcels = simulation.parcels.map(parcel => ({
                id: parcel.id,
                envoiId: parcel.envoiId,
                height: parcel.height.toNumber(),
                weight: parcel.weight.toNumber(),
                width: parcel.width.toNumber(),
                length: parcel.length.toNumber(),
            }));

            // prepare envoiStatus object to return as EnvoiStatusDto
            const envoiStatus = simulation.envoiStatus as EnvoiStatus;

            // prepare simulationStatus object to return as SimulationStatusDto
            const simulationStatus = simulation.simulationStatus as SimulationStatus;

            // prepare clientAddress object to return as AddressDto
            const clientUserAddress = simulation.client?.userAddresses[0].address;

            const clientAddresses: UserAddressDto = {
                id: clientUserAddress?.id,
                street: clientUserAddress?.street!,
                streetNumber: clientUserAddress?.streetNumber!,
                complement: clientUserAddress?.complement!,
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
                id: simulation.client?.id!,
                firstName: simulation.client?.firstName ?? '',
                lastName: simulation.client?.lastName ?? '',
                name: simulation.client?.name ? `${simulation.client?.lastName} ${simulation.client?.firstName}` : '',
                birthDate: simulation.client?.birthDate!,
                email: simulation.client?.email ?? '',
                phoneNumber: simulation.client?.phoneNumber ?? '',
                image: simulation.client?.image,
                role: simulation.client?.role as RoleDto,
                isVerified: simulation.client?.isVerified || false,
                emailVerified: simulation.client?.emailVerified ?? new Date(),
                verificationToken: simulation.client?.verificationToken ?? '',
                verificationTokenExpires: simulation.client?.verificationTokenExpires ?? new Date(),
                userAddresses: clientAddresses,
            };

            // prepare clientAddress object to return as AddressDto
            const destinataireAddresses = simulation.destinataire?.userAddresses ?? [];

            // If empty, either skip or set a default
            let destinataireAddress: UserAddressDto | null = null;

            if (destinataireAddresses.length > 0) {
                // userAddresses[0] is safe
                const {id, street, complement, streetNumber, boxNumber, cityId, city} =
                    destinataireAddresses[0].address;

                destinataireAddress = {
                    id,
                    street,
                    complement: complement ?? '',
                    streetNumber: streetNumber ?? '',
                    boxNumber: boxNumber ?? '',
                    cityId: cityId ?? 0,
                    city: {
                        id: city?.id ?? 0,
                        name: city?.name ?? '',
                        country: {
                            id: city?.country?.id ?? 0,
                            name: city?.country?.name ?? '',
                        },
                    },
                };
            }

            // Then:
            const destinataire: UserDto = {
                id: simulation.destinataire?.id!,
                firstName: simulation.destinataire?.firstName ?? '',
                lastName: simulation.destinataire?.lastName ?? '',
                name: simulation.destinataire?.name ?? '',
                birthDate: simulation.destinataire?.birthDate!,
                email: simulation.destinataire?.email ?? '',
                phoneNumber: simulation.destinataire?.phoneNumber ?? '',
                image: simulation.destinataire?.image,
                role: simulation.destinataire?.role as RoleDto,
                isVerified: simulation.destinataire?.isVerified || false,
                emailVerified: simulation.destinataire?.emailVerified ?? new Date(),
                verificationToken: simulation.destinataire?.verificationToken ?? '',
                verificationTokenExpires: simulation.destinataire?.verificationTokenExpires ?? new Date(),
                userAddresses: destinataireAddress, // could be null
            };

            // prepare the departure agency address object to return as AgencyAddressDto

            const departureAgencyAddress: AgencyAddressDto = {
                id: simulation.departureAgency?.address?.id,
                street: simulation.departureAgency?.address?.street,
                complement: simulation.departureAgency?.address?.complement!,
                streetNumber: simulation.departureAgency?.address?.streetNumber!,
                boxNumber: simulation.departureAgency?.address?.boxNumber!,
                cityId: simulation.departureAgency?.address?.cityId!,
                city: {
                    id: simulation.departureAgency?.address?.city?.id!,
                    name: simulation.departureAgency?.address?.city?.name!,
                    country: {
                        id: simulation.departureAgency?.address?.city?.country?.id!,
                        name: simulation.departureAgency?.address?.city?.country?.name!,
                    }
                }
            };

            // prepare departureAgency object to return as AgencyDto
            const departureAgency: AgencyDto = {
                id: simulation.departureAgency?.id,
                name: simulation.departureAgency?.name ?? '',
                location: simulation.departureAgency?.location!,
                addressId: simulation.departureAgency?.addressId!,
                address: departureAgencyAddress,
                capacity: simulation.departureAgency?.capacity!,
                availableSlots: simulation.departureAgency?.availableSlots!,
                createdAt: simulation.departureAgency?.createdAt!,
                updatedAt: simulation.departureAgency?.updatedAt!,
            };

            // prepare the arrival agency address object to return as AgencyAddressDto

            const arrivalAgencyAddress: AgencyAddressDto = {
                id: simulation.arrivalAgency?.address?.id,
                street: simulation.arrivalAgency?.address?.street,
                complement: simulation.arrivalAgency?.address?.complement!,
                streetNumber: simulation.arrivalAgency?.address?.streetNumber!,
                boxNumber: simulation.arrivalAgency?.address?.boxNumber!,
                cityId: simulation.arrivalAgency?.address?.cityId!,
                city: {
                    id: simulation.arrivalAgency?.address?.city?.id!,
                    name: simulation.arrivalAgency?.address?.city?.name!,
                    country: {
                        id: simulation.arrivalAgency?.address?.city?.country?.id!,
                        name: simulation.arrivalAgency?.address?.city?.country?.name!,
                    }
                }
            };

            // prepare arrivalAgency object to return as AgencyDto
            const arrivalAgency: AgencyDto = {
                id: simulation.arrivalAgency?.id!,
                name: simulation.arrivalAgency?.name!,
                location: simulation.arrivalAgency?.location!,
                addressId: simulation.arrivalAgency?.addressId!,
                address: arrivalAgencyAddress,
                capacity: simulation.arrivalAgency?.capacity!,
                availableSlots: simulation.arrivalAgency?.availableSlots!,
                createdAt: simulation.arrivalAgency?.createdAt!,
                updatedAt: simulation.arrivalAgency?.updatedAt!,
            }

            // finally, prepare the simulation object to return as SimulationResponseDto
            const simulationObj: EnvoiDto = {
                id: simulation.id,
                trackingNumber: simulation.trackingNumber ?? '',
                qrCodeUrl: simulation.qrCodeUrl ?? '',
                envoiStatus: envoiStatus,
                simulationStatus: simulationStatus,
                paid: simulation.paid,
                userId: simulation.userId!,
                destinataireId: simulation.destinataireId!,
                transportId: simulation.transportId!,
                departureAgencyId: simulation.departureAgencyId,
                arrivalAgencyId: simulation.arrivalAgencyId,
                totalWeight: simulation.totalWeight,
                totalVolume: simulation.totalVolume,
                totalPrice: simulation.totalPrice,
                departureDate: simulation.departureDate,
                arrivalDate: simulation.arrivalDate,
                verificationToken: simulation.verificationToken,
                comment: simulation.comment ?? undefined,
                parcels,
                client: client,
                destinataire: destinataire,
                arrivalAgency: arrivalAgency,
                departureAgency: departureAgency,

            };
            // map the simulation to a SimulationRequestDto and return it
            return simulationObj;

            // Handle any errors that may occur during the mapping process
        } catch (error) {
            console.error("Error getting simulation:", error);
            throw error;
        }
    }

    async getSimulationSummary(simulationId: number): Promise<SimulationSummaryDto | null> {
        if (!simulationId) return null;
        const simulation = await simulationDAO.getSimulationSummary(simulationId);

        if (!simulation) return null;
        // map the simulation to simulation summary dto
        const simulationSummary = await prisma.envoi.findFirst({
            where: {id: simulationId},
        });

        if (!simulationSummary) {
            return null;
        }

        // Prepare the simulation object to return as SimulationSummaryDto and return it
        const simulationSummaryObj: SimulationSummaryDto = {
            id: simulationSummary.id,
            transportId: simulationSummary.transportId,
            simulationStatus: simulationSummary.simulationStatus as SimulationStatus,
            envoiStatus: simulationSummary.envoiStatus as EnvoiStatus,
            totalWeight: simulationSummary.totalWeight,
            totalVolume: simulationSummary.totalVolume,
            totalPrice: simulationSummary.totalPrice,
            departureDate: simulationSummary.departureDate,
            arrivalDate: simulationSummary.arrivalDate
        };

        if (!simulationSummaryObj) {
            return null;
        }
        return simulationSummaryObj;
    }

    async updateSimulationTransportId(simulationId: number, transportId: number): Promise<boolean> {

        if (!simulationId || !transportId) {
            return false;
        }

        const response = await simulationDAO.updateSimulationTransportId(simulationId, transportId);

        return response;


    }
}

export const simulationRepository = new SimulationRepository();
// path: src/services/dal/DAO/simulations/SimulationDAO.ts


import prisma from "@/utils/db";
import {Envoi as EnvoiPrisma} from "@prisma/client";
import {CreateSimulationRequestDto} from "@/services/dtos";
import {ISimulationDAO} from "@/services/dal/DAO/simulations/ISimulationDAO";


/**
 * @class SimulationDAO
 * @description This class provides methods for interacting with the simulation table in the database.
 * @classdesc This class is responsible for handling database operations related to simulations. It provides methods for creating, updating, and retrieving simulations from the database. It also includes methods for updating the destinataireId of a simulation.
 * @implements {ISimulationDAO}
 *
 */
class SimulationDAO implements ISimulationDAO {

    /**
     * get simulation response by id
     * @param id
     * @returns EnvoiPrisma if found or null if not
     */
    async getSimulationResponseById(id: number): Promise<EnvoiPrisma | null> {
        if (!id) return null;
        try {
            const simulation = await prisma.envoi.findUnique({
                where: {id},
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
                                    // Include the city and, within it, the related country
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
            return simulation;
        } catch (error) {
            console.error("Error getting simulation:", error);
            throw error;
        }
    }

    /**
     * Creates a new simulation in the database
     * @param simulationData The data to create the simulation
     * @returns The created simulation or null if an error occurred
     */

    async createSimulation(simulationData: CreateSimulationRequestDto): Promise<EnvoiPrisma | null> {

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
            return simulation;

        } catch (error) {
            console.error("Error creating simulation:", error);
            throw error;
        }

    }

    /**
     * update simulation useId
     * @param simulationId
     * @param userId
     */
    async updateSimulationUserId(simulationId: number, userId: number): Promise<void | null> {
        const response = await prisma.envoi.update({
            where: {id: simulationId},
            data: {
                userId: userId,
            }
        });

        if (!response) {
            return null;
        }

    }

    /**
     * Updates the destinataireId of a simulation in the database
     * @param simulationId The ID of the simulation to update
     * @param destinataireId The new destinataireId
     * @returns true if the update was successful, false otherwise
     */
    async updateSimulationDestinataireId(simulationId: number, destinataireId: number): Promise<boolean> {

        if (!simulationId || !destinataireId) {
            throw new Error("Invalid simulation or destinataire ID");
        }

        try {
            const response = await prisma.envoi.update({
                where: {id: simulationId},
                data: {
                    destinataireId: destinataireId,
                }
            });
            if (!response) {
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error updating destinataireId:", error);
            return false; // Failure
        }
    }

    /**
     * Retrieves a simulation with its parcels by its ID
     * @param id The ID of the simulation
     * @returns The simulation with its parcels or null if not found
     */
    async getSimulationWithParcelsById(id: number): Promise<any | null> {
        return await prisma.envoi.findUnique({
            where: {
                id: id
            },
            include: {parcels: true}
        });
    }

    /**
     * Updates a simulation in the database
     * @param simulationId The ID of the simulation to update
     * @param simulation The updated simulation data
     * @returns The updated simulation or null if an error occurred
     */
    async updateSimulation(simulationId: number, simulation: any): Promise<any | null> {
        await prisma.envoi.update({
            where: {id: simulationId},
            data: {
                ...simulation,
            }
        });

    }

    /**
     * get simulation summary
     * @param simulationId
     */
    async getSimulationSummary(simulationId: number): Promise<EnvoiPrisma | null> {
        if (!simulationId) return null;
        try {
            return await prisma.envoi.findFirst({
                where: {id: simulationId},
            })

        } catch (error) {
            throw new Error("Error while fetching the simulation summary")
        }
    }


    async updateSimulationTransportId(simulationId: number, transportId: number): Promise<boolean> {


        if (!simulationId || !transportId) {
            return false;
        }

        try {
            const response = await prisma.envoi.update({
                where: {id: simulationId},
                data: {
                    transportId: transportId
                }
            });

            if (!response) {
                return false;
            }
            return true;

        } catch (error) {
            throw new Error("Error while updating the simulation transportId")
        }

    }
}

// Export a single instance
export const
    simulationDAO = new SimulationDAO();

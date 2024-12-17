// path: src/services/dal/DAO/simulations/SimulationDAO.ts


import prisma from "@/utils/db";
import {Envoi as EnvoiPrisma} from "@prisma/client";
import {CreateSimulationRequestDto, UpdateEditedSimulationDto} from "@/services/dtos";
import {ISimulationDAO} from "@/services/dal/DAO/simulations/ISimulationDAO";

class SimulationDAO implements ISimulationDAO {
    async getSimulationResponseById(id: number): Promise<EnvoiPrisma | null> {

        if (!id) {
            return null;
        }

        try {
            // Get the simulation from the database
            const simulation = await prisma.envoi.findUnique({
                where: {
                    id,
                },
                include: {
                    departureAgency: {
                        select: {
                            id: true,
                            name: true,
                            address: {
                                select: {
                                    country: true,
                                    city: true,
                                }
                            }
                        }
                    },
                    arrivalAgency: {
                        select: {
                            id: true,
                            name: true,
                            address: {
                                select: {
                                    country: true,
                                    city: true,
                                }
                            }
                        }
                    },
                    parcels: {
                        select: {
                            weight: true,
                            length: true,
                            width: true,
                            height: true,
                        }
                    }
                }

            });

            // Check if the simulation exists
            if (!simulation) {
                return null;
            }

            // return simulation;
            return simulation;

            // Handle any errors that may occur during the database query
        } catch (error) {
            console.error("Error getting simulation:", error);
            throw error;
        }
    }

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

            console.log("log ====> simulation after saving in DAO in path: src/services/dal/DAO/simulations/SimulationDAO.ts is : ", simulation);

            return simulation;

        } catch (error) {
            console.error("Error creating simulation:", error);
            throw error;
        }

    }

    async updateSimulationUserId(id: number, userId: number): Promise<void | null> {
        const response = await prisma.envoi.update({
            where: {id},
            data: {
                userId: userId,
            }
        });

        if (!response) {
            return null;
        }

    }

    async updateSimulationDestinataireId(id: number, destinataireId: number): Promise<void | null> {
        const response = await prisma.envoi.update({
            where: {id},
            data: {
                destinataireId: destinataireId,
            }
        });

        if (!response) {
            return null;
        }

    }

    async updateSimulation(simulatioId : number, simulation: any): Promise<any | null> {
        await prisma.envoi.update({
            where: {id: simulatioId},
            data: {
                ...simulation,
            }
        });

    }

    async getSimulationWithParcelsById(id: number): Promise<any | null> {
        return await prisma.envoi.findUnique({
            where: {
                id: id
            },
            include: { parcels: true}
        });
    }
}

// Export a single instance
export const
    simulationDAO = new SimulationDAO();

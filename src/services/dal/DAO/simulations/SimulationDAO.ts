// path: src/services/dal/DAO/simulations/SimulationDAO.ts


import prisma from "@/utils/db";
import {Envoi as EnvoiPrisma} from "@prisma/client";

class SimulationDAO implements ISimulationDAO {
    async getSimulationById(id: number): Promise<EnvoiPrisma | null> {

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
            console.log("log ====> DAO: simulation in getSimulationById function called in src/services/dal/DAO/simulations/SimulationDAO.ts: ", simulation);
            return simulation;

            // Handle any errors that may occur during the database query
        } catch
            (e) {
            return null;
        }
    }
}

// Export a single instance
export const
    simulationDAO = new SimulationDAO();

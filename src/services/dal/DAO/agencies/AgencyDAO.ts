// path: src/services/dal/DAO/agencies/AgencyDAO.ts

import prisma from "@/utils/db";
import {IAgencyDAO} from "@/services/dal/DAO/agencies/IAgencyDAO";
import {Agency as AgencyPrisma} from "@prisma/client";


class AgencyDAO implements IAgencyDAO {
    async getAgencyById(id: number): Promise<AgencyPrisma | null> {

        if (!id) {
            return null;
        }

        try {
            // Get the agency from the database
            const agency = await prisma.agency.findUnique({
                where: {
                    id,
                },
                include: {
                    address: {
                        select: {
                            street: true,
                            number: true,
                            city: true,
                            zipCode: true,
                            country: true,
                        }
                    },
                },
            });

            // Check if the agency exists
            if (!agency) {
                return null;
            }

            // return agency;
            console.log("log ====> DAO: agency in getAgencyById function called in src/services/dal/DAO/agencies/AgencyDAO.ts: ", agency);


            return agency;

            // Handle any errors that may occur during the database query
        } catch (error) {
            throw new Error("Error getting agency by ID: " + error);
        }
    }

    async getAgencyId(country: string, city: string, agencyName: string): Promise<number | null> {
        if (!country || !city || !agencyName) {
            return null;
        }

        try {
            const agency = await prisma.agency.findFirst({
                where: {
                    name: agencyName,
                    address: {
                        city: city,
                        country: country,
                    },
                },
                select: {
                    id: true
                },
            });

            if (!agency) {
                return null;
            }
            return agency.id;
        } catch (error) {
            console.error("Error getting agency id:", error);
            throw error;
        }

    }
}

// Export a single instance
export const
    agencyDAO = new AgencyDAO();
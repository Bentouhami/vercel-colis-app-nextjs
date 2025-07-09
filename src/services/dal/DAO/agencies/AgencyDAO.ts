// path: src/services/dal/DAO/agencies/AgencyDAO.ts

import { prisma } from "@/utils/db";
import {IAgencyDAO} from "@/services/dal/DAO/agencies/IAgencyDAO";
import {Agency as AgencyPrisma} from "@prisma/client";

class AgencyDAO implements IAgencyDAO {
    async getAgencyById(id: number): Promise<AgencyPrisma | null> {
        if (!id) {
            return null;
        }

        try {
            // Get the agency from the database with the correct fields
            const agency = await prisma.agency.findUnique({
                where: {id},
                include: {
                    address: true,
                },
            });

            if (!agency) {
                return null;
            }
            return agency;
        } catch (error) {
            throw new Error("Error getting agency by ID: " + error);
        }
    }

    async getAgencyId(country: string, city: string, agencyName: string): Promise<number | null> {
        if (!country || !city || !agencyName) {
            return null;
        }

        // Convert country to a number for comparison
        const countryId = Number(country);
        try {
            const agency = await prisma.agency.findFirst({
                where: {
                    name: agencyName,
                    address: {
                        // Use nested filters to match the related city and its country
                        city: {
                            name: city,
                            country: {
                                id: countryId,
                            },
                        },
                    },
                },
                select: {id: true},
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

export const agencyDAO = new AgencyDAO();

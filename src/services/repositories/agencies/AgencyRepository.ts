// path: src/services/repositories/agencies/AgencyRepository.ts

import { IAgencyRepository } from "@/services/repositories/agencies/IAgencyRepository";
import {AddressResponseDto, AgencyAddressDto, AgencyResponseDto} from "@/services/dtos";
import { agencyDAO } from "@/services/dal/DAO/agencies/AgencyDAO";
import prisma from "@/utils/db";

export class AgencyRepository implements IAgencyRepository {
    async getAgencyById(id: number): Promise<AgencyResponseDto | null> {
        if (!id) {
            return null;
        }
        try {
            const agency = await prisma.agency.findUnique({
                where: { id },
                include: {
                    address: {
                        include: {
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
                            },
                        },
                    },
                },
            });

            if (!agency) {
                return null;
            }
            // prepare the address object to return
            const address: AgencyAddressDto = {
                id: agency.address.id,
                street: agency.address.street ?? "",
                complement: agency.address.complement ?? undefined,
                streetNumber: agency.address.streetNumber ?? undefined,
                boxNumber: agency.address.boxNumber ?? undefined,
                cityId: agency.address.cityId,
                city: agency.address.city,
            };

            // prepare an AgencyResponseDto from agency
            const agencyObj: AgencyResponseDto = {
                id: agency.id,
                name: agency.name,
                location: agency.location,
                address: address,
                capacity: agency.capacity || null,
                availableSlots: agency.availableSlots || null,
            };
            if (!agencyObj) {
                return null;
            }
            return agencyObj;
        } catch (error) {
            console.error("Error getting agency:", error);
            throw error;
        }

    }

    async getAgencyId(country: string, city: string, agencyName: string): Promise<number | null> {
        if (!country || !city || !agencyName) {
            return null;
        }
        try {
            const agencyId = await agencyDAO.getAgencyId(country, city, agencyName);
            if (!agencyId) {
                return null;
            }
            return agencyId;
        } catch (error) {
            console.error("Error getting agency id:", error);
            throw error;
        }
    }
}

export const agencyRepository = new AgencyRepository();

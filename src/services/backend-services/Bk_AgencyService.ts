// path: src/backend-services/Bk_AgencyService.ts

import {AgencyDto, AgencyResponseDto, FullAgencyDto} from "@/services/dtos";
import {prisma} from "@/utils/db";
import {agencyRepository} from "@/services/repositories/agencies/AgencyRepository";

export async function getLightAgencies(filters?: {
    countryId?: number;
    cityId?: number;
    search?: string;
}) {
    return prisma.agency.findMany({
        where: {
            address: {
                city: {
                    countryId: filters?.countryId,
                    id: filters?.cityId,
                },
            },
            name: filters?.search
                ? {contains: filters.search, mode: "insensitive"}
                : undefined,
        },
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}

/**
 * Find agency by name
 * @param agencyName - agency name
 * @param agencyName
 * @returns {Promise<FullAgencyDto | null>} agency or null
 */
export async function findAgencyByName(agencyName: string): Promise<FullAgencyDto | null> {
    const agency = await prisma.agency.findFirst({
        where: {
            name: agencyName,
        },
    }) as FullAgencyDto | null;

    if (!agency) {
        return null;
    }

    return agency;
}

export async function getAgencyId(country: string, city: string, agencyName: string): Promise<number | null> {

    try {
        const agencyId = await agencyRepository.getAgencyId(country, city, agencyName);


        if (!agencyId) {
            throw new Error("Agency not found");
        }
        return agencyId;
    } catch (error) {
        console.error("Error getting agency id:", error);
        throw error;
    }
}

export async function getAgencyById(id: number): Promise<AgencyResponseDto | null> {
    try {
        const agency = await agencyRepository.getAgencyById(id);

        if (!agency) {
            throw new Error("Agency not found");
        }

        return agency;
    } catch (error) {
        console.error("Error getting agency:", error);
        throw error;
    }
}


export async function getAgencies(p0: {
    page: number;
    limit: number;
    search: string;
    sortKey: string;
    sortDir: string;
}): Promise<AgencyDto[] | null> {
    try {

        const agencies = await prisma.agency.findMany(
            {
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
                            street: true,
                            complement: true,
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
                                        }
                                    }
                                }
                            },
                        },
                    },
                },
            }
        );

        if (!agencies) {
            throw new Error("Agencies not found");
        }

        // format the response to match the AgencyResponseDto interface
        const formattedAgencies = agencies.map((agency) => ({
            id: agency.id,
            name: agency.name,
            location: agency.location || '',
            addressId: agency.addressId,
            capacity: agency.capacity || 0,
            availableSlots: agency.availableSlots,
            address: {
                id: agency.address.id,
                street: agency.address.street,
                complement: agency.address.complement,
                streetNumber: agency.address.streetNumber,
                boxNumber: agency.address.boxNumber,
                city: {
                    id: agency.address.city.id,
                    name: agency.address.city.name,
                    country: {
                        id: agency.address.city.country.id,
                        name: agency.address.city.country.name,
                    }
                }
            },
            createdAt: agency.createdAt,
            updatedAt: agency.updatedAt,
        }));

        return formattedAgencies;

    } catch (error) {
        console.error("Error getting agencies for super admin:", error);
        throw error;
    }
}

// region agency admin functions
export async function getAgenciesByAdminId(staffId: number, p0: {
    page: number;
    limit: number;
    search: string;
    sortKey: string;
    sortDir: string;
}): Promise<AgencyDto[] | null> {
    if (!staffId) {
        throw new Error("Invalid admin id");
    }

    try {
        const agencies = await prisma.agencyStaff.findMany({
            where: {
                staffId,
            },
            include: {
                agency: {
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
                                street: true,
                                complement: true,
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
                                            }
                                        }
                                    }
                                },
                            },
                        },
                    },
                },

            },

        });
        if (!agencies) {
            throw new Error("Agencies not found");
        }

        // format the response to match the AgencyResponseDto interface
        const formattedAgencies = agencies.map((agency) => ({
            id: agency.agency.id,
            name: agency.agency.name,
            location: agency.agency.location || '',
            addressId: agency.agency.addressId,
            capacity: agency.agency.capacity || 0,
            availableSlots: agency.agency.availableSlots,
            address: {
                id: agency.agency.address.id,
                street: agency.agency.address.street,
                complement: agency.agency.address.complement,
                streetNumber: agency.agency.address.streetNumber,
                boxNumber: agency.agency.address.boxNumber,
                city: {
                    id: agency.agency.address.city.id,
                    name: agency.agency.address.city.name,
                    country: {
                        id: agency.agency.address.city.country.id,
                        name: agency.agency.address.city.country.name,
                    }
                }
            },
            createdAt: agency.agency.createdAt,
            updatedAt: agency.agency.updatedAt,
        }));

        return formattedAgencies;

    } catch (error) {
        console.error("Error getting agencies by admin id:", error);
        throw error;
    }
}

export async function createAgency(agencyData: AgencyDto, staffId: number): Promise<AgencyResponseDto | null> {
    try {
        const agency = await agencyRepository.createAgency(agencyData, staffId);
        if (!agency) {
            throw new Error("Agency not created");
        }
        return agency;
    } catch (error) {
        console.error("Error creating agency:", error);
        throw error;
    }
}

export async function updateAgency(agencyData: AgencyDto): Promise<AgencyResponseDto | null> {
    try {
        const agency = await agencyRepository.updateAgency(agencyData);
        if (!agency) {
            throw new Error("Agency not updated");
        }
        return agency;
    } catch (error) {
        console.error("Error updating agency:", error);
        throw error;
    }
}


// endregion



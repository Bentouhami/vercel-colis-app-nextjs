// path: src/services/repositories/agencies/AgencyRepository.ts

import {IAgencyRepository} from "@/services/repositories/agencies/IAgencyRepository";
import {AgencyAddressDto, AgencyDto, AgencyResponseDto, RoleDto} from "@/services/dtos";
import {agencyDAO} from "@/services/dal/DAO/agencies/AgencyDAO";
import {prisma} from "@/utils/db";
import {agencyStaffRepository} from "@/services/repositories/AgencyStaffs/agencyStaffRepository";

export class AgencyRepository implements IAgencyRepository {
    async getAgencyById(id: number): Promise<AgencyResponseDto | null> {
        if (!id) {
            return null;
        }
        try {
            const agency = await prisma.agency.findUnique({
                where: {id},
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
                email: agency.email,
                phoneNumber: agency.phoneNumber,
                vatNumber: agency.vatNumber,
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

    async createAgency(agencyData: AgencyDto, staffId: number): Promise<AgencyResponseDto | null> {
        if (!agencyData) {
            return null;
        }
        try {
            const agency = await prisma.agency.create({
                data: {
                    name: agencyData.name,
                    location: agencyData.location,
                    phoneNumber: agencyData.phoneNumber,
                    email: agencyData.email,
                    vatNumber: agencyData.vatNumber,
                    capacity: agencyData.capacity,
                    availableSlots: agencyData.availableSlots,
                    address: {
                        create: {
                            street: agencyData.address?.street!,
                            complement: agencyData.address?.complement,
                            streetNumber: agencyData.address?.streetNumber,
                            boxNumber: agencyData.address?.boxNumber,
                            city: {
                                connect: {
                                    id: agencyData.address?.city?.id,
                                },
                            },
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    location: true,
                    email: true,
                    phoneNumber: true,
                    addressId: true,
                    capacity: true,
                    vatNumber: true,
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
                }

            });
            if (!agency) {
                throw new Error("Agency not created");
            }

            // create nex agency staff
            await agencyStaffRepository.createAgencyStaff(agency.id, staffId, RoleDto.AGENCY_ADMIN);

            return agency;
        } catch (error) {
            console.error("Error creating agency:", error);
            throw error;
        }
    }

    async updateAgency(agencyData: AgencyDto): Promise<AgencyResponseDto | null> {
        if (!agencyData) {
            return null;
        }
        try {
            const agency = await prisma.agency.update({
                where: {id: agencyData.id},
                data: {
                    name: agencyData.name,
                    location: agencyData.location,
                    phoneNumber: agencyData.phoneNumber,
                    email: agencyData.email,
                    vatNumber: agencyData.vatNumber,
                    capacity: agencyData.capacity,
                    availableSlots: agencyData.availableSlots,
                    address: {
                        update: {
                            street: agencyData.address?.street!,
                            complement: agencyData.address?.complement,
                            streetNumber: agencyData.address?.streetNumber,
                            boxNumber: agencyData.address?.boxNumber,
                            city: {
                                connect: {
                                    id: agencyData.address?.city?.id,
                                },
                            },
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    location: true,
                    email: true,
                    phoneNumber: true,
                    addressId: true,
                    capacity: true,
                    vatNumber: true,
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
                }
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
                cityId: agency.address.city.id,
                city: agency.address.city,
            };

            // prepare an AgencyResponseDto from agency
            const agencyObj: AgencyResponseDto = {
                id: agency.id,
                name: agency.name,
                location: agency.location,
                email: agency.email,
                phoneNumber: agency.phoneNumber,
                vatNumber: agency.vatNumber,
                address: address,
                capacity: agency.capacity || null,
                availableSlots: agency.availableSlots || null,
            };
            if (!agencyObj) {
                return null;
            }
            return agencyObj;
        } catch (error) {
            console.error("Error updating agency:", error);
            throw error;
        }

    }

    async getAgencyIdForAdmin(adminId: number): Promise<number | null> {
        const staff = await prisma.agencyStaff.findFirst({
            where: {
                staffId: adminId,
                staffRole: 'AGENCY_ADMIN',
            },
        });

        return staff?.agencyId ?? null;
    }

}

export const agencyRepository = new AgencyRepository();

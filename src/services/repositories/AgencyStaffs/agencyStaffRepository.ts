// path: src/services/repositories/AgencyStaffs/agencyStaffRepository.ts

import {RoleDto} from "@/services/dtos";
import prisma from "@/utils/db";
import {IAgencyStaffRepository} from "@/services/repositories/AgencyStaffs/IAgencyStaffRepository";
import {AgencyStaffDto} from "@/services/dtos/agencyStaffs/AgencyStaffDto";

export class AgencyStaffRepository  implements IAgencyStaffRepository {
    async createAgencyStaff(agencyId: number, staffId: number, staffRole: RoleDto): Promise<AgencyStaffDto | null> {
        if (!agencyId || !staffId) {
            return null;
        }
        try {
            const agencyStaff = await prisma.agencyStaff.create({
                data: {
                    agencyId: agencyId,
                    staffId: staffId,
                    staffRole: RoleDto.SUPER_ADMIN,
                },

            });

            if (!agencyStaff) {
                return null;
            }

            // prepare the AgencyStaffDto from agencyStaff
            const agencyStaffObj: AgencyStaffDto = {
                id: agencyStaff.id,
                agencyId: agencyStaff.agencyId,
                staffId: agencyStaff.staffId,
                staffRole: agencyStaff.staffRole as RoleDto,
            };

            if (!agencyStaffObj) {
                return null;
            }

            return agencyStaffObj;

        } catch (error) {
            console.error("Error creating agency staff:", error);
            throw error;
        }
    }
}

export const agencyStaffRepository = new AgencyStaffRepository();
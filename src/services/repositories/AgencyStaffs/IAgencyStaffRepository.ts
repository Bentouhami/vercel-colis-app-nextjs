// path: src/services/repositories/AgencyStaffs/IAgencyStaffRepository.ts


import {AgencyStaffDto} from "@/services/dtos/agencyStaffs/AgencyStaffDto";
import {RoleDto} from "@/services/dtos";

export interface IAgencyStaffRepository {
    createAgencyStaff(agencyId: number, staffId: number, staffRole: RoleDto): Promise<AgencyStaffDto | null>;
}
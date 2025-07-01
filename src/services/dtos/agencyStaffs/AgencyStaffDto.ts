// path: src/services/dtos/agencyStaffs/AgencyStaffDto.ts

import {RoleDto} from "@/services/dtos";

export interface AgencyStaffDto {
    id: number;
    agencyId: number;
    staffId: number;
    staffRole: RoleDto;
}
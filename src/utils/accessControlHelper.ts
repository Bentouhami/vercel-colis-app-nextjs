import {Session} from "next-auth";
import {RoleDto} from "@/services/dtos";

export const accessControlHelper = {
    canManageUsers: (session: Session) => {
        const isSuperAdmin = session?.user?.role === RoleDto.SUPER_ADMIN;
        const isAgencyAdmin = session?.user?.role === RoleDto.AGENCY_ADMIN;

        return isSuperAdmin || isAgencyAdmin;
    },
    canManageAgencies: (session: Session) => {
        const isSuperAdmin = session?.user?.role === RoleDto.SUPER_ADMIN;
        const isAgencyAdmin = session?.user?.role === RoleDto.AGENCY_ADMIN;

        return isSuperAdmin || isAgencyAdmin;
    },
    canManageEnvoi: (session: Session) => {
        const isSuperAdmin = session?.user?.role === RoleDto.SUPER_ADMIN;
        const isAgencyAdmin = session?.user?.role === RoleDto.AGENCY_ADMIN;

        return isSuperAdmin || isAgencyAdmin;
    },

    isSuperAdmin: (session: Session) => {
        return session?.user?.role === RoleDto.SUPER_ADMIN;
    },

    isAgencyAdmin: (session: Session) => {
        return session?.user?.role === RoleDto.AGENCY_ADMIN;
    },

    isAdmin: (session: Session) => {
        return session?.user?.role === RoleDto.SUPER_ADMIN || session?.user?.role === RoleDto.AGENCY_ADMIN;
    },

}

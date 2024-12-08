// path: src/services/mappers/RoleMapper.ts
import { Role as PrismaRole } from '@prisma/client'
import { Roles } from '@/services/dtos/enums/EnumsDto'

export class RoleMapper {
    // Convert Prisma Role to application Roles enum
    static toRolesEnum(prismaRoles: PrismaRole[]): Roles[] {
        return prismaRoles.map(role => {
            switch(role) {
                case 'CLIENT':
                    return Roles.CLIENT
                case 'SUPER_ADMIN':
                    return Roles.SUPER_ADMIN
                case 'DESTINATAIRE':
                    return Roles.DESTINATAIRE
                case 'AGENCY_ADMIN':
                    return Roles.AGENCY_ADMIN
                default:
                    throw new Error(`Unmapped role: ${role}`)
            }
        })
    }

    // Convert application Roles enum to Prisma Role
    static toPrismaRoles(roles: Roles[]): PrismaRole[] {
        return roles.map(role => {
            switch(role) {
                case Roles.CLIENT:
                    return 'CLIENT'
                case Roles.SUPER_ADMIN:
                    return 'SUPER_ADMIN'
                case Roles.DESTINATAIRE:
                    return 'DESTINATAIRE'
                case Roles.AGENCY_ADMIN:
                    return 'AGENCY_ADMIN'
                default:
                    throw new Error(`Unmapped role: ${role}`)
            }
        })
    }

    // Utility method to check if a role is valid
    static isValidRole(role: Roles): boolean {
        return Object.values(Roles).includes(role)
    }
}
// src/utils/helpers.ts

// Helper function to check if a user has a specific role
import {RoleDto} from "@/services/dtos";

export function hasRole(user: { role: RoleDto }, role: RoleDto): boolean {
    return user.role === role;
}

export function hasAnyRole(user: { role: RoleDto }, role: RoleDto): boolean {
    return role === RoleDto.SUPER_ADMIN || role === RoleDto.AGENCY_ADMIN || role === RoleDto.ACCOUNTANT;
}


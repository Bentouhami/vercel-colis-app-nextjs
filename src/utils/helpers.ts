// src/utils/helpers.ts
import { Role } from "@/utils/dtos";

// Helper function to check if a user has a specific role
export function hasRole(user: { roles: Role[] }, role: Role): boolean {
    return user.roles.includes(role);
}

export function hasAnyRole(user: { roles: Role[] }, roles: Role[]): boolean {
    return roles.some(role => user.roles.includes(role));
}

// src/utils/helpers.ts

// Helper function to check if a user has a specific role
import {Roles} from "@/services/dtos";

export function hasRole(user: { roles: Roles[] }, role: Roles): boolean {
    return user.roles.includes(role);
}

export function hasAnyRole(user: { roles: Roles[] }, roles: Roles[]): boolean {
    return roles.some(role => user.roles.includes(role));
}

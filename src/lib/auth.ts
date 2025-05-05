// path: src/lib/auth.ts

import { getSession } from "next-auth/react";
import { toast } from 'sonner';
import {RoleDto} from "@/services/dtos";



interface AuthCheckResult {
    isAuthenticated: boolean;
    userId?: string | number | null; // Allow userId to be string, null, or undefined
    email?: string | null; // It's good practice to allow null for email too, depending on your session type
    error?: string;
    role?: RoleDto | null; // Allow role to be RoleDto, null, or undefined, depending on your session type
}
export async function checkAuthStatus(showToast: boolean = true): Promise<AuthCheckResult> {
    try {
        const session = await getSession();

        if (!session) {
            if (showToast) {
                toast.error("Vous devez être connecté pour effectuer cette action");
            }
            return {
                isAuthenticated: false,
                error: "Not authenticated"
            };
        }

        return {
            isAuthenticated: true,
            userId: session.user?.id ?? null,
            email: session.user?.email ?? null, // Use nullish coalescing to ensure null if email is undefined
            role: session.user?.role ?? null // Use nullish coalescing to ensure null if role is undefined
        };
    } catch (error) {
        if (showToast) {
            toast.error("Une erreur est survenue lors de la vérification de l'authentification");
        }
        return {
            isAuthenticated: false,
            error: "Authentication check failed"
        };
    }
}

// Optional: Helper for getting just the userId
export async function getCurrentUserId(): Promise<string | number | null> {
    const { userId } = await checkAuthStatus(false);
    return userId || null;
}






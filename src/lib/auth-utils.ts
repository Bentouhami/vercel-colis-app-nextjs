// src/lib/auth-utils.ts

import { getSession } from "next-auth/react";
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { RoleDto } from "@/services/dtos";

interface AuthCheckResult {
  isAuthenticated: boolean;
  userId?: string | number | null;
  email?: string | null;
  error?: string;
  role?: RoleDto | null;
}

// Client-side auth check (your existing function)
export async function checkAuthStatus(
  showToast = true
): Promise<AuthCheckResult> {
  try {
    const session = await getSession();
    if (!session) {
      if (showToast) {
        toast.error("Vous devez être connecté pour effectuer cette action");
      }
      return {
        isAuthenticated: false,
        error: "Not authenticated",
      };
    }

    return {
      isAuthenticated: true,
      userId: session.user?.id ?? null,
      email: session.user?.email ?? null,
      role: session.user?.role ?? null,
    };
  } catch (error) {
    if (showToast) {
      toast.error(
        "Une erreur est survenue lors de la vérification de l'authentification"
      );
    }
    return {
      isAuthenticated: false,
      error: "Authentication check failed",
    };
  }
}

// Client-side helper for getting just the userId (your existing function)
export async function getCurrentUserId(): Promise<string | number | null> {
  const { userId } = await checkAuthStatus(false);
  return userId || null;
}

// Server-side auth utilities for middleware and server components
export async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  return session;
}

export async function requireRole(allowedRoles: RoleDto[]) {
  const session = await requireAuth();
  if (!session.user.role || !allowedRoles.includes(session.user.role)) {
    redirect("/client/unauthorized");
  }
  return session;
}

export async function requireAdmin() {
  return requireRole([
    RoleDto.SUPER_ADMIN,
    RoleDto.AGENCY_ADMIN,
    RoleDto.ACCOUNTANT,
  ]);
}

export async function requireClient() {
  return requireRole([RoleDto.CLIENT, RoleDto.DESTINATAIRE]);
}

// Helper function to get role-based redirect URL
export function getRoleRedirectUrl(role: RoleDto): string {
  const ROLE_REDIRECTS = {
    [RoleDto.CLIENT]: "/client",
    [RoleDto.SUPER_ADMIN]: "/admin",
    [RoleDto.AGENCY_ADMIN]: "/admin",
    [RoleDto.ACCOUNTANT]: "/admin",
    [RoleDto.DESTINATAIRE]: "/client",
  } as const;

  return ROLE_REDIRECTS[role] || "/client";
}

// Helper to check if user has admin role
export function isAdminRole(role?: RoleDto | null): boolean {
  if (!role) return false;
  return [
    RoleDto.SUPER_ADMIN,
    RoleDto.AGENCY_ADMIN,
    RoleDto.ACCOUNTANT,
  ].includes(role);
}

// Helper to check if user has client role
export function isClientRole(role?: RoleDto | null): boolean {
  if (!role) return false;
  return [RoleDto.CLIENT, RoleDto.DESTINATAIRE].includes(role);
}

// Server-side session getter (non-redirecting)
export async function getServerSession() {
  try {
    return await auth();
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}

// Server-side auth check (non-redirecting)
export async function checkServerAuth(): Promise<AuthCheckResult> {
  try {
    const session = await getServerSession();
    if (!session) {
      return {
        isAuthenticated: false,
        error: "Not authenticated",
      };
    }

    return {
      isAuthenticated: true,
      userId: session.user?.id ?? null,
      email: session.user?.email ?? null,
      role: session.user?.role ?? null,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error: "Authentication check failed",
    };
  }
}

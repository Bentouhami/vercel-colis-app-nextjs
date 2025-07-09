// path: src/types/next-auth.d.ts
import type { DefaultSession } from "next-auth"
import type { AddressResponseDto, RoleDto } from "@/services/dtos"

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"]
    }

    interface User {
        id: number | string | null
        firstName?: string | null
        lastName?: string | null
        name?: string | null
        email?: string
        phoneNumber?: string | null
        image?: string | null
        role?: RoleDto
        userAddresses?: AddressResponseDto | null
        emailVerified?: Date | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number | string | null
        firstName?: string | null
        lastName?: string | null
        name?: string | null
        email?: string
        phoneNumber?: string | null
        image?: string | null
        role?: RoleDto
        userAddresses?: AddressResponseDto | null
        emailVerified?: Date | null
    }
}

// Add middleware types
declare module "next/server" {
    interface NextRequest {
        auth?: {
            user?: {
                id: number | string | null
                firstName?: string | null
                lastName?: string | null
                name?: string | null
                email?: string
                phoneNumber?: string | null
                image?: string | null
                role?: RoleDto
                userAddresses?: AddressResponseDto | null
                emailVerified?: Date | null
            }
        } | null
    }
}

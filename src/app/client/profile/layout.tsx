// src/app/client/profile/layout.tsx
import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth/auth"
import { RoleDto } from "@/services/dtos"
import ProfileLayoutClient from "@/components/client-specific/profile/ProfileLayoutClient"

export default async function ProfileLayout({ children }: { children: ReactNode }) {
    const session = await auth()

    // 1. Check for session existence
    if (!session?.user) {
        const callbackUrl = encodeURIComponent("/client/profile")
        redirect(`/auth/login?callbackUrl=${callbackUrl}`)
    }

    // 2. Check for the correct role
    const allowedRoles = [RoleDto.CLIENT, RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]

    const userRole = session.user.role
    if (!userRole || !allowedRoles.includes(userRole)) {
        redirect("/client/unauthorized")
    }

    return (
        <ProfileLayoutClient session={session} >
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
        </ProfileLayoutClient>
    )
}

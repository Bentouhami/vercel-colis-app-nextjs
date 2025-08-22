// src/components/auth/AuthGuard.tsx

"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { RoleDto } from "@/services/dtos"
import { getRoleRedirectUrl } from "@/lib/auth-utils"
import RequireAuth from "@/components/auth/RequireAuth" // Declare the RequireAuth variable

interface AuthGuardProps {
    children: React.ReactNode
    requireAuth?: boolean
    allowedRoles?: RoleDto[]
    redirectTo?: string
    silent?: boolean // Don't show loading or error states
}

export default function AuthGuard({
    children,
    requireAuth = true,
    allowedRoles,
    redirectTo,
    silent = false,
}: AuthGuardProps) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return

        if (requireAuth && status === "unauthenticated") {
            const loginUrl = redirectTo || "/auth/login"
            router.push(loginUrl)
            return
        }

        if (allowedRoles && session?.user?.role) {
            const userRole = session.user.role as RoleDto
            if (!allowedRoles.includes(userRole)) {
                const fallbackUrl = redirectTo || getRoleRedirectUrl(userRole)
                router.push(fallbackUrl)
                return
            }
        }
    }, [status, session, requireAuth, allowedRoles, redirectTo, router])

    if (silent) {
        // For silent guards, just render children or nothing
        if (status === "loading") return null
        if (requireAuth && status === "unauthenticated") return null
        if (allowedRoles && session?.user?.role && !allowedRoles.includes(session.user.role as RoleDto)) return null
        return <>{children}</>
    }

    // For non-silent guards, use RequireAuth for better UX
    return (
        <RequireAuth allowedRoles={allowedRoles} redirectTo={redirectTo}>
            {children}
        </RequireAuth>
    )
}

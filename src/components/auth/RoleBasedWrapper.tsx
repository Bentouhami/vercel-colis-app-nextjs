"use client"

import type React from "react"
import { useAuth } from "./AuthProvider"
import type { RoleDto } from "@/services/dtos"

interface RoleBasedWrapperProps {
    children: React.ReactNode
    allowedRoles: RoleDto[]
    fallback?: React.ReactNode
    requireAuth?: boolean
}

export default function RoleBasedWrapper({
                                             children,
                                             allowedRoles,
                                             fallback = null,
                                             requireAuth = true,
                                         }: RoleBasedWrapperProps) {
    const { isAuthenticated, user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (requireAuth && !isAuthenticated) {
        return <>{fallback}</>
    }

    if (!user?.role || !allowedRoles.includes(user.role)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}

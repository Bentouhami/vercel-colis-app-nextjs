"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { checkAuthStatus, isAdminRole, isClientRole } from "@/lib/auth-utils"
import type { RoleDto } from "@/services/dtos"

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRoles?: RoleDto[]
    fallbackUrl?: string
    showLoading?: boolean
}

export default function ProtectedRoute({
                                           children,
                                           requiredRoles,
                                           fallbackUrl = "/client/auth/login",
                                           showLoading = true,
                                       }: ProtectedRouteProps) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
    const router = useRouter()

    useEffect(() => {
        async function checkAuth() {
            const authResult = await checkAuthStatus(false)

            if (!authResult.isAuthenticated) {
                router.push(fallbackUrl)
                return
            }

            // If specific roles are required, check them
            if (requiredRoles && requiredRoles.length > 0) {
                const hasRequiredRole = authResult.role && requiredRoles.includes(authResult.role)
                if (!hasRequiredRole) {
                    // Redirect based on user's actual role
                    if (authResult.role && isAdminRole(authResult.role)) {
                        router.push("/admin")
                    } else if (authResult.role && isClientRole(authResult.role)) {
                        router.push("/client")
                    } else {
                        router.push("/client/unauthorized")
                    }
                    return
                }
            }

            setIsAuthorized(true)
        }

        checkAuth()
    }, [requiredRoles, fallbackUrl, router])

    if (isAuthorized === null) {
        return showLoading ? (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        ) : null
    }

    if (!isAuthorized) {
        return null
    }

    return <>{children}</>
}

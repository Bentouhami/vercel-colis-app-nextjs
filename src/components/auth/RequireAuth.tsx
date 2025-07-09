"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { RoleDto } from "@/services/dtos"
import { getRoleRedirectUrl, isAdminRole } from "@/lib/auth-utils"

interface RequireAuthProps {
    children: React.ReactNode
    redirectTo?: string
    customMessage?: string
    allowedRoles?: RoleDto[]
    showToast?: boolean
    fallback?: React.ReactNode
}

export default function RequireAuth({
                                        children,
                                        redirectTo,
                                        customMessage = "Vous devez être connecté pour accéder à cette page",
                                        allowedRoles,
                                        showToast = true,
                                        fallback,
                                    }: RequireAuthProps) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isRedirecting, setIsRedirecting] = useState(false)

    // 🚀 FIXED: Move getRedirectUrl inside useCallback to fix React warning
    const getRedirectUrl = useCallback(() => {
        if (redirectTo) return redirectTo

        // If a user is authenticated but doesn't have the right role, redirect to their appropriate dashboard
        if (session?.user?.role) {
            return getRoleRedirectUrl(session.user.role as RoleDto)
        }

        // Default to log in with callback
        const callbackUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
        return `/client/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    }, [redirectTo, session?.user?.role, pathname, searchParams])

    useEffect(() => {
        if (status === "loading" || isRedirecting) return

        // Handle unauthenticated users
        if (status === "unauthenticated") {
            if (showToast) {
                toast.error(customMessage)
            }
            setIsRedirecting(true)
            setTimeout(() => router.push(getRedirectUrl()), 1000)
            return
        }

        // Handle authenticated users with role restrictions
        if (status === "authenticated" && allowedRoles && session?.user?.role) {
            const userRole = session.user.role as RoleDto

            if (!allowedRoles.includes(userRole)) {
                const errorMessage = "Vous n'avez pas l'autorisation pour accéder à cette page"
                if (showToast) {
                    toast.error(errorMessage)
                }

                setIsRedirecting(true)
                // Redirect to the appropriate dashboard based on user's role
                const redirectUrl = getRoleRedirectUrl(userRole)
                setTimeout(() => router.push(redirectUrl), 1000)
                return
            }
        }
    }, [status, router, customMessage, session, allowedRoles, showToast, isRedirecting, getRedirectUrl])

    // Loading state
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Vérification de l&#39;authentification...</p>
                </div>
            </div>
        )
    }

    // Unauthenticated state
    if (status === "unauthenticated") {
        if (fallback) {
            return <>{fallback}</>
        }

        return (
            <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
                <div className="text-center space-y-2">
                    <p className="text-lg text-gray-700">{customMessage}</p>
                    <p className="text-sm text-muted-foreground">Redirection en cours...</p>
                </div>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Role check failed
    if (allowedRoles && session?.user?.role && !allowedRoles.includes(session.user.role as RoleDto)) {
        if (fallback) {
            return <>{fallback}</>
        }

        const userRole = session.user.role as RoleDto
        const isAdmin = isAdminRole(userRole)

        return (
            <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
                <div className="text-center space-y-2 max-w-md">
                    <h2 className="text-xl font-semibold text-gray-900">Accès non autorisé</h2>
                    <p className="text-gray-700">Vous n&#39;avez pas l&#39;autorisation pour accéder à cette page</p>
                    <p className="text-sm text-muted-foreground">
                        Redirection vers votre {isAdmin ? "tableau de bord administrateur" : "espace client"}...
                    </p>
                </div>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Success - render children
    return <>{children}</>
}

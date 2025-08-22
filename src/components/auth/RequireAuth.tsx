// path: src/components/auth/RequireAuth.tsx

"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
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
    const [authChecked, setAuthChecked] = useState(false)

    // Refs pour éviter les multiples redirections
    const hasRedirected = useRef(false)
    const hasShownToast = useRef(false)

    useEffect(() => {
        // Éviter les vérifications multiples
        if (authChecked || isRedirecting || hasRedirected.current) return

        // Attendre que le statut soit stable
        if (status === "loading") return

        const performAuthCheck = () => {
            setAuthChecked(true)

            // Cas 1: Utilisateur non authentifié
            if (status === "unauthenticated") {
                if (showToast && !hasShownToast.current) {
                    toast.error(customMessage)
                    hasShownToast.current = true
                }

                hasRedirected.current = true
                setIsRedirecting(true)

                const callbackUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
                const redirectUrl = redirectTo || `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`

                setTimeout(() => {
                    router.push(redirectUrl)
                }, 1000)
                return
            }

            // Cas 2: Utilisateur authentifié avec vérification de rôle
            if (status === "authenticated" && allowedRoles && session?.user?.role) {
                const userRole = session.user.role as RoleDto

                const hasValidRole = allowedRoles.some(
                    (role) => role.toString().toLowerCase() === userRole.toString().toLowerCase(),
                )

                if (!hasValidRole) {
                    const errorMessage = "Vous n'avez pas l'autorisation pour accéder à cette page"

                    if (showToast && !hasShownToast.current) {
                        toast.error(errorMessage)
                        hasShownToast.current = true
                    }

                    hasRedirected.current = true
                    setIsRedirecting(true)

                    const redirectUrl = redirectTo || getRoleRedirectUrl(userRole)

                    setTimeout(() => {
                        router.push(redirectUrl)
                    }, 1000)
                    return
                }
            }
        }

        performAuthCheck()
    }, [
        status,
        session,
        allowedRoles,
        pathname,
        searchParams,
        redirectTo,
        customMessage,
        showToast,
        router,
        authChecked,
        isRedirecting,
    ])

    // Debug en développement (sans causer de re-renders)
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.log("🔐 RequireAuth State:", {
                status,
                userRole: session?.user?.role,
                allowedRoles,
                pathname,
                authChecked,
                isRedirecting,
                hasRedirected: hasRedirected.current,
            })
        }
    }, [status, session?.user?.role, allowedRoles, pathname, authChecked, isRedirecting])

    // États de chargement
    if (status === "loading" || !authChecked) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Vérification de l&apos;authentification...</p>
                </div>
            </div>
        )
    }

    // État de redirection
    if (isRedirecting) {
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

    // Utilisateur non authentifié
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

    // Vérification des rôles pour utilisateur authentifié
    if (allowedRoles && session?.user?.role) {
        const userRole = session.user.role as RoleDto
        const hasValidRole = allowedRoles.some(
            (role) => role.toString().toLowerCase() === userRole.toString().toLowerCase(),
        )

        if (!hasValidRole) {
            if (fallback) {
                return <>{fallback}</>
            }
            const isAdmin = isAdminRole(userRole)
            return (
                <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
                    <div className="text-center space-y-2 max-w-md">
                        <h2 className="text-xl font-semibold text-gray-900">Accès non autorisé</h2>
                        <p className="text-gray-700">Vous n&apos;avez pas l&apos;autorisation pour accéder à cette page</p>
                        <p className="text-sm text-muted-foreground">
                            Redirection vers votre {isAdmin ? "tableau de bord administrateur" : "espace client"}...
                        </p>
                    </div>
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )
        }
    }

    // Succès - afficher le contenu
    return <>{children}</>
}

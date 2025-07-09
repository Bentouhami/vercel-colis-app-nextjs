"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import type { RoleDto } from "@/services/dtos"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface RoleGuardProps {
    children: React.ReactNode
    allowedRoles: RoleDto[]
    fallback?: React.ReactNode
    showAlert?: boolean
}

export default function RoleGuard({ children, allowedRoles, fallback, showAlert = true }: RoleGuardProps) {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return null // Don't show anything while loading
    }

    if (status === "unauthenticated") {
        return fallback || null
    }

    const userRole = session?.user?.role as RoleDto
    if (!userRole || !allowedRoles.includes(userRole)) {
        if (fallback) {
            return <>{fallback}</>
        }

        if (showAlert) {
            return (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Vous n&#39;avez pas les permissions nécessaires pour voir ce contenu.</AlertDescription>
                </Alert>
            )
        }

        return null
    }

    return <>{children}</>
}

"use client"

import type React from "react"
import { useAuth } from "./AuthProvider"
import type { RoleDto } from "@/services/dtos"

interface ConditionalRenderProps {
    children: React.ReactNode
    condition: "authenticated" | "unauthenticated" | "admin" | "client"
    roles?: RoleDto[]
}

export default function ConditionalRender({ children, condition, roles }: ConditionalRenderProps) {
    const { isAuthenticated, isAdmin, isClient, hasRole } = useAuth()

    const shouldRender = () => {
        switch (condition) {
            case "authenticated":
                return isAuthenticated
            case "unauthenticated":
                return !isAuthenticated
            case "admin":
                return isAuthenticated && isAdmin
            case "client":
                return isAuthenticated && isClient
            default:
                return false
        }
    }

    if (roles && roles.length > 0) {
        return hasRole(roles) ? <>{children}</> : null
    }

    return shouldRender() ? <>{children}</> : null
}

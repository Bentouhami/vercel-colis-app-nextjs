"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import type { RoleDto } from "@/services/dtos"
import {getRoleRedirectUrl, isAdminRole, isClientRole} from "@/lib/auth-utils";


interface User {
    id: number | string | null
    firstName?: string | null
    lastName?: string | null
    name?: string | null
    email?: string
    phoneNumber?: string | null
    image?: string | null
    role?: RoleDto
    userAddresses?: any | null
    emailVerified?: Date | null
}

interface AuthContextValue {
    isAuthenticated: boolean
    isLoading: boolean
    user: User | null
    isAdmin: boolean
    isClient: boolean
    hasRole: (roles: RoleDto[]) => boolean
}

const AuthContext = createContext<AuthContextValue>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    isAdmin: false,
    isClient: false,
    hasRole: () => false,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<User | null>(null)

    // Check if current path is a public route that doesn't require auth
    const isPublicAuthRoute =
        pathname?.startsWith("/client/auth/") ||
        pathname === "/" ||
        pathname?.startsWith("/client/about") ||
        pathname?.startsWith("/client/services") ||
        pathname?.startsWith("/client/contact-us") ||
        pathname?.startsWith("/client/simulation") ||
        pathname?.startsWith("/client/tracking")

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            setUser(session.user as User)

            // Handle role-based redirects for authenticated users on auth pages
            if (pathname?.startsWith("/client/auth/") && session.user.role) {
                const redirectUrl = getRoleRedirectUrl(session.user.role as RoleDto)
                router.push(redirectUrl)
            }
        } else if (status === "unauthenticated") {
            setUser(null)

            // Only redirect to login if not on a public route
            if (!isPublicAuthRoute) {
                const loginUrl = `/client/auth/login${pathname ? `?redirect=${encodeURIComponent(pathname)}` : ""}`
                router.push(loginUrl)
            }
        }
    }, [status, session, router, pathname, isPublicAuthRoute])

    const contextValue: AuthContextValue = {
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        user,
        isAdmin: user?.role ? isAdminRole(user.role) : false,
        isClient: user?.role ? isClientRole(user.role) : false,
        hasRole: (roles: RoleDto[]) => (user?.role ? roles.includes(user.role) : false),
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {status === "loading" ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

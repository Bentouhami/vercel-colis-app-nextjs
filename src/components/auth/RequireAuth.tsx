'use client';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {RoleDto} from "@/services/dtos";

interface RequireAuthProps {
    children: React.ReactNode;
    redirectTo?: string;
    customMessage?: string;
    allowedRoles?: RoleDto[]; // Add roles parameter
}

export default function RequireAuth({
                                        children,
                                        redirectTo = "/client/auth/login",
                                        customMessage = "Vous devez être connecté pour accéder à cette page",
                                        allowedRoles, // Optional roles to check
                                    }: RequireAuthProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        // If not authenticated, redirect with a delay
        if (status === "unauthenticated") {
            toast.error(customMessage);
            setTimeout(() => router.push(redirectTo), 1000);
            return;
        }

        // If authenticated but role check is required
        if (status === "authenticated" && allowedRoles && session?.user?.role) {
            // Check if user's role is in the allowed roles array
            if (!allowedRoles.includes(session.user.role)) {
                toast.error("Vous n'avez pas l'autorisation pour accéder à cette page");
                setTimeout(() => router.push("/client"), 1000);
            }
        }
    }, [status, router, redirectTo, customMessage, session, allowedRoles]);

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // If unauthenticated, show message and spinner until redirection occurs.
    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
                <p className="text-center text-lg text-gray-700">{customMessage}</p>
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // If role check is required and user doesn't have the proper role
    if (allowedRoles && session?.user?.role && !allowedRoles.includes(session.user.role)) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
                <p className="text-center text-lg text-gray-700">Vous n&#39;avez pas l&#39;autorisation pour accéder à cette page</p>
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // If authenticated with correct role (or no role check required), render children
    return <>{children}</>;
}
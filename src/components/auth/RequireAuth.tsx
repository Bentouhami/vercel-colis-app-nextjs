'use client';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface RequireAuthProps {
    children: React.ReactNode;
    redirectTo?: string;
    customMessage?: string;
}

export default function RequireAuth({
                                        children,
                                        redirectTo = "/client/auth/login",
                                        customMessage = "Vous devez être connecté pour accéder à cette page",
                                    }: RequireAuthProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // When status is "unauthenticated", display message and spinner, then redirect.
    useEffect(() => {

        setTimeout(() => {
            if (status === "unauthenticated") {
                toast.error(customMessage);
                router.push(redirectTo);
            }
        }, 2000);

    }, [status, router, redirectTo, customMessage, session]);

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

    // If authenticated, render children.
    return <>{children}</>;
}

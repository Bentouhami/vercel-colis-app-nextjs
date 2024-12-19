// path: src/components/auth/RequireAuth.tsx
'use client';
import React from 'react';
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
                                        customMessage = "Vous devez être connecté pour accéder à cette page"
                                    }: RequireAuthProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Only show loading state while explicitly checking auth
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin"/>
            </div>
        );
    }

    // If not authenticated, show message and redirect
    if (status === "unauthenticated") {
        toast.error(customMessage);
        router.push(redirectTo);
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin"/>
            </div>
        );
    }

    // If authenticated, render children
    return <>{children}</>;
}
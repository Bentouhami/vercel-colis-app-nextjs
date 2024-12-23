'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthContextValue {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any | null; // Replace `any` with your user DTO type
}

const AuthContext = createContext<AuthContextValue>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<any | null>(null); // Replace `any` with your user DTO type

    useEffect(() => {
        if (status === "authenticated") {
            setUser(session?.user || null);
        } else if (status === "unauthenticated") {
            router.push("/client/auth/login");
        }
    }, [status, session, router]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: status === "authenticated",
                isLoading: status === "loading",
                user,
            }}
        >
            {status === "loading" ? (
                <div className="flex justify-center items-center min-h-screen">
                    <p>Loading...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

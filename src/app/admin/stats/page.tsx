// path: src/app/admin/stats/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { RoleDto } from "@/services/dtos";

export default function RapportsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <RequireAuth allowedRoles={[RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]}>
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-5">Admin Stats</h1>
                <p>This page is under construction.</p>
            </div>
        </RequireAuth>
    );
}

export const dynamic = 'force-static';


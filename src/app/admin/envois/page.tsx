// path : /src/app/admin/envois/page.tsx => this is the invoices page component

'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RoleDto } from "@/services/dtos";
import RequireAuth from "@/components/auth/RequireAuth";

/**
 * This page is used to manage the envois for an agency
 */
export default function AdminEnvoisPage() {
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
        <RequireAuth allowedRoles={[RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN]}>
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-5">Admin Envois</h1>
                <p>This page is under construction.</p>
            </div>
        </RequireAuth>
    );
}

export const dynamic = 'force-static';

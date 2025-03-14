// path: src/app/dashboard/users/[id]/edit/page.tsx
'use client'
import React, {useEffect} from 'react'
import RequireAuth from '@/components/auth/RequireAuth';
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {accessControlHelper} from "@/utils/accessControlHelper";
import UsersForm from "@/components/forms/admins/UsersForm";
import {RoleDto} from "@/services/dtos";

const EditUserPage = ({params}: { params: { id: string } }) => {
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        } else if (status === 'authenticated') {
            const canManageUsers = accessControlHelper.canManageUsers(session);
            if (!canManageUsers) {
                router.push('/dashboard');
            }
        }
    }, [status, session, router]);

    // Render a spinner while checking authentication
    if (status === 'loading') {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"/>
            </div>
        </div>;
    }


    return (
        <RequireAuth allowedRoles={[RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN]}>
            <div className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-8">Edit User</h1>
                <UsersForm userId={params.id}/>
            </div>
        </RequireAuth>
    )
}
export default EditUserPage

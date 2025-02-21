// path: src/app/dashboard/users/page.tsx

'use client';

import UsersList from "@/components/lists/UsersList";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import RequireAuth from "@/components/auth/RequireAuth";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {accessControlHelper} from "@/lib/utils/accessControlHelper";
import {DOMAIN} from "@/lib/utils/constants";

export default function UsersPage() {
    const {data: session, status} = useSession();
    const [role, setRole] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role) {
            setRole(session.user.role);
        }
    }, [status, session]);

    const handleAddUser = () => {
        router.push(`${DOMAIN}/dashboard/users/new`);
    };

    // Don't render anything while checking authentication
    if (status === 'loading') {
        return null;
    }

    // Check access control after authentication is confirmed
    if (status === 'authenticated' && !accessControlHelper.canManageUsers(session)) {
        router.replace('/');
        return null;
    }

    return (
        <RequireAuth>
            <div className="container mx-auto py-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Users Management</h1>
                    <Button onClick={handleAddUser} variant="default">
                        <Plus className="mr-2 h-4 w-4"/> Add User
                    </Button>
                </div>
                <UsersList role={role}/>
            </div>
        </RequireAuth>
    );
}
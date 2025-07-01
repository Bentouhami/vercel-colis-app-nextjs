// path: src/app/dashboard/users/new/page.tsx
'use client'

import React, {useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import RequireAuth from "@/components/auth/RequireAuth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {ListSkeleton} from "@/components/skeletons/ListSkeleton";
import {FaUsers} from "react-icons/fa6";
import {Card, CardContent} from "@/components/ui/card";
import {accessControlHelper} from "@/utils/accessControlHelper";
import {RoleDto} from "@/services/dtos";
import {NewCustomer} from '@/components/users/NewCustomer';
import {NewAdmin} from '@/components/users/NewAdminForm';
import {NewAccountant} from '@/components/users/NewAccountant';
import {NewSuperAdmin} from "@/components/users/NewSuperAdminsForm";

export default function UsersPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('customer');
    const {data: session, status} = useSession();

    if (status === 'loading') {
        return <ListSkeleton/>;
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex h-screen items-center justify-center">
                <Card className="w-full max-w-md p-6">
                    <p className="text-center text-lg text-muted-foreground">You are not authenticated</p>
                </Card>
            </div>
        );
    }
    const isSuperAdmin = session?.user?.role === RoleDto.SUPER_ADMIN;
    const isAgencyAdmin = session?.user?.role === RoleDto.AGENCY_ADMIN;
    const isAccountant = session?.user?.role === RoleDto.ACCOUNTANT;
    if (!accessControlHelper.canManageUsers(session!)) {
        router.push('/dashboard');
        return null;
    }

    const gridCols = isSuperAdmin ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    return (
        <RequireAuth allowedRoles={[RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN]}>
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto p-4 space-y-8">
                    {/* Header Section */}
                    <div
                        className=" mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6">
                        <div className=" flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <FaUsers className="h-6 w-6 text-primary"/>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                <span className="text-primary">User Management</span>
                            </h1>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <Card className="border shadow-md">
                        <CardContent className="p-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                                <TabsList className={`grid w-full gap-2 p-1 ${gridCols}`}>
                                    <TabsTrigger
                                        value="customer"
                                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        New Customer
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="admin"
                                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        New Admin
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="accountant"
                                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        New Accountant
                                    </TabsTrigger>
                                    {isSuperAdmin && (
                                        <TabsTrigger
                                            value="superadmin"
                                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                        >
                                            New Super Admin
                                        </TabsTrigger>
                                    )}
                                </TabsList>

                                <div className="mt-6">
                                    <TabsContent value="customer">
                                        <NewCustomer/>
                                    </TabsContent>
                                    <TabsContent value="admin">
                                        <NewAdmin/>
                                    </TabsContent>
                                    <TabsContent value="accountant">
                                        <NewAccountant/>
                                    </TabsContent>
                                    {isSuperAdmin && (
                                        <TabsContent value="superadmin">
                                            <NewSuperAdmin/>
                                        </TabsContent>
                                    )}
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RequireAuth>
    );
}
// path: src/app/admin/page.tsx
'use client';

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {FileText, Package, Users} from 'lucide-react';
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

import {RoleDto} from "@/services/dtos";


export default function Dashboard() {
    const router = useRouter();
    const {data: session, status} = useSession();
    const [summary, setSummary] = useState({
        totalAgencies: '',
        totalClients: '',
        totalRevenue: ''
    });
    const [role, setRole] = useState<RoleDto>(session?.user?.role!);

    // useEffect(() => {
    //         if (status === 'loading') {
    //             return;
    //         }
    //         if (status === 'authenticated') {
    //             if (session?.user?.role) {
    //                 setRole(session.user.role);
    //             }
    //
    //             const fetchSummaryData = async () => {
    //                 try {
    //                     const response = await axios.get(`${API_DOMAIN}/dashboard/summary`);
    //                     if (response.status === 200 && response.data) {
    //                         setSummary({
    //                             totalAgencies: response.data.totalAgencies,
    //                             totalClients: response.data.totalClients,
    //                             totalRevenue: response.data.totalAmountSum
    //                         });
    //
    //                     }
    //                 } catch (error) {
    //                     console.error('Error fetching summary data:', error);
    //                 }
    //             };
    //
    //             fetchSummaryData();
    //
    //         }
    //     },
    //     [status, router, session, role]
    // )
    // ;

    return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-600">Dashboard</h1>
                        <p className="mt-4 text-center">
                            Get a quick overview of your agency&#39;s performance.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                        <div className="flex items-center justify-center">
                            <Card>
                                <CardHeader className="flex items-center gap-2">
                                    <Users className="text-blue-500"/>
                                    <CardTitle>Total Clients</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-blue-600">
                                            {summary.totalClients}
                                        </h2>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex items-center justify-center">
                            <Card>
                                <CardHeader className="flex items-center gap-2">
                                    <Package className="text-blue-500"/>
                                    <CardTitle>Total Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-blue-600">
                                            {summary.totalRevenue}
                                        </h2>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex items-center justify-center">
                            <Card>
                                <CardHeader className="flex items-center gap-2">
                                    <FileText className="text-blue-500"/>
                                    <CardTitle>Total Agencies</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-blue-600">
                                            {summary.totalAgencies}
                                        </h2>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
    );
}

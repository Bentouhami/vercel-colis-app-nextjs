// path: src/app/admin/super-admin/page.tsx

'use client'

import React from 'react'
import {useSession} from "next-auth/react";
import {Roles} from "@/services/dtos";
import AgencyList from "@/components/forms/admins/AgencyList";
import AgencyForm from "@/components/forms/admins/AgencyForm";

function handleDeleteUser(id: number) {
    console.log("id: ", id);
}

function DashboardPage() {
    const {data: session, status} = useSession();
    const isLoggedIn = status === "authenticated";
    const isSuperAdmin = session?.user?.roles?.includes(Roles.SUPER_ADMIN) || false;
    //


    let users = [
        {
            id: 1,
            name: "John Doe",
            email: "johndoe@example.com",
            phoneNumber: "123456789",
            roles: [Roles.SUPER_ADMIN],
            isVerified: true,
            emailVerified: new Date(),
        },
        {
            id: 2,
            name: "Jane Doe",
            email: "janedoe@example.com",
            phoneNumber: "987654321",
            roles: [Roles.SUPER_ADMIN],
            isVerified: true,
            emailVerified: new Date(),
        },
        {
            id: 3,
            name: "Bob Smith",
            email: "bobsmith@example.com",
            phoneNumber: "555555555",
            roles: [Roles.SUPER_ADMIN],
            isVerified: true,
            emailVerified: new Date(),
        },
    ];

    return (
        <div>
            <h1>

                Super Admin Dashboard

            </h1>

            <AgencyList  />
            <AgencyForm  />
        </div>
    )
}

export default DashboardPage

// path: src/app/admin/layout.tsx

'use client';

import React from "react";
import DashboardNavbar from "@/components/admin/super-admin/dashboard/DashboardNavbar";
import "./dashboard.css"; // Fichier CSS pour les styles propres au dashboard


export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-body" data-theme="light">
            <DashboardNavbar/>
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
}

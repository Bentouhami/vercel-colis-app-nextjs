// path: src/app/dashboard/layout.tsx

'use client';

import React from "react";
import DashboardNavbar from "@/components/navigations/dashboard/DashboardNavbar";
import Footer from "@/components/navigations/footer/Footer";
import "./dashboard.css"; // Fichier CSS pour les styles propres au dashboard
// import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-body" data-theme="light">
            <DashboardNavbar/> {/* Barre de navigation spécifique pour le tableau de bord */}
            <main className="dashboard-main">
                {children}
            </main>
            <Footer/>
        </div>
    );
}

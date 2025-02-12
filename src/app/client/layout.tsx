// src/app/client/layout.tsx
'use client';

import React from "react";
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            {/* Always show HeaderNavbar across all client pages */}
            <HeaderWrapper />

            {/* Page Content */}
            <div className="pt-[70px]">
                {children}
            </div>
        </div>
    );
}

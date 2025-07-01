// E:\fullstack_project\NextJs_Projects\newColiApp\src\components\providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
                <Toaster richColors position="bottom-right" />
            </ThemeProvider>
        </SessionProvider>
    );
}

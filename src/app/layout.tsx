// path: /src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

import { LoadingProvider } from '@/contexts/LoadingContext';
import GlobalLoadingOverlay from '@/components/ui/GlobalLoadingOverlay';

import ProgressWrapper from '@/components/providers/ProgressWrapper';
import React from "react";
import { Providers } from "@/components/providers"; // ✅ ici

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ColisApp',
    description: 'ColisApp est un site web pour les particuliers et les agences de transport entre le Maroc et la Belgique.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={`${inter.className} transition-colors duration-300`}>
                <Providers>
                    <LoadingProvider>
                        <ProgressWrapper>
                            <GlobalLoadingOverlay />
                            {children}
                        </ProgressWrapper>
                    </LoadingProvider>
                </Providers>
            </body>
        </html>
    );
}
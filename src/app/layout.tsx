// path: src/app/layout.tsx

import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { LoadingProvider } from "@/contexts/LoadingContext"
import GlobalLoadingOverlay from "@/components/ui/GlobalLoadingOverlay"
import ProgressWrapper from "@/components/providers/ProgressWrapper"
import type React from "react"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "ColisApp - Transport de colis Maroc-Belgique",
    description:
        "ColisApp est la plateforme de référence pour le transport de colis entre le Maroc et la Belgique. Service rapide, sécurisé et professionnel.",
    keywords: "colis, transport, Maroc, Belgique, expédition, livraison",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={`${inter.className} transition-colors duration-300 antialiased`}>
                <Providers>
                    <LoadingProvider>
                        <ProgressWrapper>
                            <GlobalLoadingOverlay />
                            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">{children}</div>
                        </ProgressWrapper>
                    </LoadingProvider>
                </Providers>
            </body>
        </html>
    )
}

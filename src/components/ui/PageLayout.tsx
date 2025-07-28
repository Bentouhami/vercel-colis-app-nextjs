"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageLayoutProps {
    children: ReactNode
    title: string
    subtitle?: string
    icon?: ReactNode
    className?: string
    headerActions?: ReactNode
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}

export function PageLayout({
    children,
    title,
    subtitle,
    icon,
    className,
    headerActions,
    maxWidth = "2xl",
}: PageLayoutProps) {
    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        full: "max-w-full",
    }

    return (
        <div className={cn("min-h-screen bg-background", className)}>
            <div className={cn("mx-auto px-4 py-8", maxWidthClasses[maxWidth])}>
                {/* Header unifié */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {icon && (
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">{icon}</div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                                {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
                            </div>
                        </div>
                        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
                    </div>
                </div>

                {/* Contenu */}
                <div className="space-y-6">{children}</div>
            </div>
        </div>
    )
}

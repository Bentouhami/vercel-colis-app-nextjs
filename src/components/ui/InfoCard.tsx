"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface InfoCardProps {
    title: string
    icon?: ReactNode
    children: ReactNode
    className?: string
    variant?: "default" | "success" | "warning" | "error"
}

export function InfoCard({ title, icon, children, className, variant = "default" }: InfoCardProps) {
    const variantStyles = {
        default: "border-border",
        success: "border-green-200 bg-green-50/50",
        warning: "border-orange-200 bg-orange-50/50",
        error: "border-red-200 bg-red-50/50",
    }

    return (
        <Card className={cn("transition-all duration-200 hover:shadow-md", variantStyles[variant], className)}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">{children}</CardContent>
        </Card>
    )
}

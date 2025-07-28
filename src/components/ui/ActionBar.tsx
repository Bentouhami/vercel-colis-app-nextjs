"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ActionBarProps {
    children?: ReactNode
    className?: string
    primaryAction?: {
        label: string
        onClick: () => void
        loading?: boolean
        disabled?: boolean
        icon?: ReactNode
    }
    secondaryAction?: {
        label: string
        onClick: () => void
        variant?: "outline" | "ghost" | "secondary"
        icon?: ReactNode
    }
}

export function ActionBar({ children, className, primaryAction, secondaryAction }: ActionBarProps) {
    return (
        <div className={cn("flex items-center justify-between gap-4 p-4 bg-background border-t border-border", className)}>
            <div className="flex items-center gap-2">{children}</div>

            <div className="flex items-center gap-2">
                {secondaryAction && (
                    <Button variant={secondaryAction.variant || "outline"} onClick={secondaryAction.onClick} className="gap-2">
                        {secondaryAction.icon}
                        {secondaryAction.label}
                    </Button>
                )}

                {primaryAction && (
                    <Button
                        onClick={primaryAction.onClick}
                        disabled={primaryAction.disabled || primaryAction.loading}
                        className="gap-2"
                    >
                        {primaryAction.loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                            primaryAction.icon
                        )}
                        {primaryAction.label}
                    </Button>
                )}
            </div>
        </div>
    )
}

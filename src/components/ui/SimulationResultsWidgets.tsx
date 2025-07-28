// src/components/ui/SimulationResultsWidgets.tsx

"use client"

import type React from "react"
import { type ReactNode, createContext, useContext } from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

/* -------------------------------------------------------------------------- */
/*                                   STEPPER                                  */
/* -------------------------------------------------------------------------- */
interface StepperContextType {
    orientation: "vertical" | "horizontal"
    current: number
}

const StepperContext = createContext<StepperContextType | null>(null)

interface StepperProps {
    current: number
    orientation?: "vertical" | "horizontal"
    children: ReactNode
    className?: string
}

export const Stepper: React.FC<StepperProps> = ({ current, orientation = "vertical", children, className }) => (
    <StepperContext.Provider value={{ orientation, current }}>
        <ol className={cn("flex", orientation === "vertical" ? "flex-col space-y-6" : "space-x-6", className)}>
            {children}
        </ol>
    </StepperContext.Provider>
)

interface StepProps {
    index: number
    title: string
    description?: string
    icon?: ReactNode
}

export const Step: React.FC<StepProps> = ({ index, title, description, icon }) => {
    const ctx = useContext(StepperContext)
    if (!ctx) throw new Error("Step must be used within Stepper")

    const { orientation, current } = ctx
    const active = index === current
    const done = index < current

    const circle = done ? (
        <Badge className="rounded-full bg-green-500 text-white">✓</Badge>
    ) : (
        <span
            className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2",
                active ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground",
            )}
        >
            {icon ?? index + 1}
        </span>
    )

    return (
        <li className="flex items-start gap-4">
            {circle}
            <div className="min-w-0">
                <p className={cn("font-medium", active && "text-primary")}>{title}</p>
                {description && <p className="text-sm text-muted-foreground truncate">{description}</p>}
            </div>
            {orientation === "vertical" && <Separator className="ml-4" />}
        </li>
    )
}

/* -------------------------------------------------------------------------- */
/*                                PARCEL CARD                                 */
/* -------------------------------------------------------------------------- */
interface ParcelCardProps {
    index: number
    parcel: { height: number; width: number; length: number; weight: number }
    className?: string
}

export const ParcelCard: React.FC<ParcelCardProps> = ({ index, parcel, className }) => (
    <Card className={cn("border", className)}>
        <CardContent className="p-4 space-y-1 text-sm">
            <p className="font-semibold mb-1">Colis {index + 1}</p>
            <p>Poids&nbsp;: {parcel.weight} kg</p>
            <p>
                Dimensions&nbsp;: {parcel.length}×{parcel.width}×{parcel.height} cm
            </p>
        </CardContent>
    </Card>
)

/* -------------------------------------------------------------------------- */
/*                              SUMMARY WIDGET                                */
/* -------------------------------------------------------------------------- */
interface SummaryWidgetProps {
    icon: LucideIcon
    label: string
    value: string | number
    className?: string
}

export const SummaryWidget: React.FC<SummaryWidgetProps> = ({ icon: Icon, label, value, className }) => (
    <div className={cn("flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm border border-border", className)}>
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
        </div>
    </div>
)

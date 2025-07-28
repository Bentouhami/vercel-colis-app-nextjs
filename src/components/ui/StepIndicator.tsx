"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StepIndicatorProps {
    steps: string[]
    currentStep: number
    className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                                    index < currentStep
                                        ? "bg-primary text-primary-foreground"
                                        : index === currentStep
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground",
                                )}
                            >
                                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                            </div>
                            <span
                                className={cn(
                                    "text-xs mt-2 text-center max-w-20",
                                    index <= currentStep ? "text-foreground" : "text-muted-foreground",
                                )}
                            >
                                {step}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn("h-0.5 w-16 mx-2 transition-colors", index < currentStep ? "bg-primary" : "bg-muted")}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

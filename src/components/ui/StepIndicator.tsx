"use client"

import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
    steps: readonly string[]
    currentStep: number
    className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
    return (
        <div className={cn("w-full", className)}>
            <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-4 sm:top-5 md:top-6 left-0 right-0 h-0.5 bg-muted-foreground/20 -z-10" />

                {/* Progress Bar Fill */}
                <div
                    className="absolute top-4 sm:top-5 md:top-6 left-0 h-0.5 bg-primary transition-all duration-500 ease-out -z-10"
                    style={{
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                    }}
                />

                {/* Steps Container */}
                <div className="flex items-start justify-between px-2 sm:px-4">
                    {steps.map((step, index) => {
                        const stepNumber = index + 1
                        const isCompleted = stepNumber < currentStep
                        const isCurrent = stepNumber === currentStep
                        const isUpcoming = stepNumber > currentStep

                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center relative group"
                                role="listitem"
                                aria-current={isCurrent ? "step" : undefined}
                            >
                                {/* Step Circle */}
                                <div
                                    className={cn(
                                        "relative flex items-center justify-center rounded-full border-2 transition-all duration-300 ease-out transform group-hover:scale-105",
                                        "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12",
                                        {
                                            // Completed state
                                            "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25": isCompleted,
                                            // Current state
                                            "bg-primary/10 border-primary text-primary ring-4 ring-primary/20 shadow-md": isCurrent,
                                            // Upcoming state
                                            "bg-background border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50":
                                                isUpcoming,
                                        },
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-in zoom-in-50 duration-200" />
                                    ) : (
                                        <span
                                            className={cn("font-semibold transition-colors duration-200", "text-xs sm:text-sm md:text-base", {
                                                "text-primary": isCurrent,
                                                "text-muted-foreground group-hover:text-foreground": isUpcoming,
                                            })}
                                        >
                                            {stepNumber}
                                        </span>
                                    )}

                                    {/* Current step pulse animation */}
                                    {isCurrent && (
                                        <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
                                    )}
                                </div>

                                {/* Step Label */}
                                <div className="mt-2 sm:mt-3 text-center max-w-[80px] sm:max-w-[100px] md:max-w-[120px]">
                                    <span
                                        className={cn(
                                            "font-medium transition-all duration-300 leading-tight block",
                                            "text-xs sm:text-sm md:text-base",
                                            {
                                                "text-primary font-semibold": isCompleted || isCurrent,
                                                "text-muted-foreground group-hover:text-foreground": isUpcoming,
                                            },
                                        )}
                                    >
                                        {step}
                                    </span>

                                    {/* Step status indicator */}
                                    <div className="mt-1">
                                        {isCompleted && <span className="text-xs text-primary/70 font-medium">Terminé</span>}
                                        {isCurrent && <span className="text-xs text-primary font-medium animate-pulse">En cours</span>}
                                        {isUpcoming && <span className="text-xs text-muted-foreground/60">À venir</span>}
                                    </div>
                                </div>

                                {/* Connector Arrow (hidden on last step) */}
                                {index < steps.length - 1 && (
                                    <ChevronRight
                                        className={cn(
                                            "absolute top-3 sm:top-4 md:top-5 -right-2 sm:-right-3 md:-right-4 transition-colors duration-300",
                                            "w-3 h-3 sm:w-4 sm:h-4",
                                            {
                                                "text-primary": isCompleted,
                                                "text-primary/50": isCurrent,
                                                "text-muted-foreground/30": isUpcoming,
                                            },
                                        )}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Mobile-specific progress indicator */}
                <div className="mt-4 sm:hidden">
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                            Étape {currentStep} sur {steps.length}
                        </span>
                        <div className="flex space-x-1">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn("w-2 h-2 rounded-full transition-colors duration-200", {
                                        "bg-primary": index + 1 <= currentStep,
                                        "bg-muted-foreground/30": index + 1 > currentStep,
                                    })}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// path: src/components/users/StepIndicator.tsx

import React from 'react';
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-between w-full mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                    <div
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                            currentStep > i
                                ? "bg-primary text-primary-foreground"
                                : currentStep === i + 1
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                        )}
                    >
                        {i + 1}
                    </div>
                    {i < totalSteps - 1 && (
                        <div
                            className={cn(
                                "h-1 w-full",
                                currentStep > i + 1 ? "bg-primary" : "bg-muted"
                            )}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}


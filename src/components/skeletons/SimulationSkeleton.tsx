// src/components/skeletons/SimulationSkeleton.tsx
'use client';

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const SimulationSkeleton = () => {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Title */}
            <div className="h-8 w-2/3 bg-gray-200 rounded-md dark:bg-gray-700" />

            {/* Sections */}
            {[...Array(2)].map((_, sectionIndex) => (
                <div
                    key={sectionIndex}
                    className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md space-y-4"
                >
                    <div className="h-6 w-1/3 bg-gray-200 rounded-md dark:bg-gray-600" />

                    {/* 3 skeleton inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-10 rounded-md" />
                        ))}
                    </div>
                </div>
            ))}

            {/* Colis */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md space-y-4">
                <div className="h-6 w-1/3 bg-gray-200 rounded-md dark:bg-gray-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-md" />
                    ))}
                </div>
            </div>

            {/* Submit button */}
            <Skeleton className="w-40 h-10 mx-auto rounded-full" />
        </div>
    );
};

export default SimulationSkeleton;

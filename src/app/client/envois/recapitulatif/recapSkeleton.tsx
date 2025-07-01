// path: src/app/client/envois/recapitulatif/recapSkeleton.tsx

'use client';

import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

export default function RecapSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 mb-52 bg-gray-50 rounded-lg shadow-lg animate-pulse">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
                <Skeleton className="w-72 h-8 mx-auto"/>
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
                {Array.from({length: 4}).map((_, index) => (
                    <Card key={index} className="border-l-4 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-700">
                                <Skeleton className="h-5 w-5 rounded-full"/>
                                <Skeleton className="h-4 w-32"/>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-6 w-48"/>
                            <Skeleton className="h-6 w-36"/>
                            <Skeleton className="h-6 w-40"/>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="mt-6 bg-blue-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full"/>
                        <Skeleton className="h-4 w-36"/>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    {Array.from({length: 4}).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Skeleton className="h-5 w-5 rounded-full"/>
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24"/>
                                <Skeleton className="h-6 w-32"/>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="bg-blue-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full"/>
                        <Skeleton className="h-4 w-24"/>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-12 w-40 mx-auto"/>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Skeleton className="h-12 w-48 rounded-md"/>
                <Skeleton className="h-12 w-48 rounded-md"/>
            </div>
        </div>
    );
}

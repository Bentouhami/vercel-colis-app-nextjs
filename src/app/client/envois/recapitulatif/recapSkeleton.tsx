"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function RecapSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 space-y-8">
                {/* Enhanced Header Skeleton */}
                <div className="text-center space-y-6 animate-fade-in">
                    <div className="flex items-center justify-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-2xl animate-pulse" />
                        <div className="text-left space-y-2">
                            <Skeleton className="h-12 w-96 animate-pulse" />
                            <Skeleton className="h-6 w-72 animate-pulse" />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-8 w-24 rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 100}ms` }}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center gap-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-9 w-28 rounded-md animate-pulse"
                                style={{ animationDelay: `${i * 150}ms` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Enhanced Main Content Skeleton */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column - 4 cols */}
                    <div className="lg:col-span-4 space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 200}ms` }}>
                                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                                    <CardHeader className="pb-4 bg-gradient-to-r from-gray-200 to-gray-300">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-10 h-10 rounded-full bg-white/50 animate-pulse" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-6 w-24 bg-white/50 animate-pulse" />
                                                <Skeleton className="h-3 w-20 bg-white/30 animate-pulse" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-6">
                                        <Skeleton className="h-6 w-full animate-pulse" />
                                        <div className="space-y-2">
                                            {[1, 2].map((j) => (
                                                <div key={j} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                    <Skeleton className="h-4 w-4 animate-pulse" />
                                                    <Skeleton className="h-4 flex-1 animate-pulse" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* Middle Column - 4 cols */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="pb-4 bg-gradient-to-r from-orange-200 to-amber-200">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-full bg-white/50 animate-pulse" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-20 bg-white/50 animate-pulse" />
                                            <Skeleton className="h-3 w-24 bg-white/30 animate-pulse" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {/* Route points */}
                                        {[1, 2].map((i) => (
                                            <div key={i} className="relative">
                                                <div className="flex items-start gap-4">
                                                    <Skeleton className="w-12 h-12 rounded-full animate-pulse" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Skeleton className="h-4 w-4 animate-pulse" />
                                                            <Skeleton className="h-4 w-24 animate-pulse" />
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                                            {[1, 2, 3].map((j) => (
                                                                <div key={j} className="flex justify-between items-center">
                                                                    <Skeleton className="h-3 w-12 animate-pulse" />
                                                                    <Skeleton className="h-3 w-20 animate-pulse" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                {i === 1 && <Skeleton className="absolute left-6 top-12 w-0.5 h-8 animate-pulse" />}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column - 4 cols */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Details Card */}
                        <div className="animate-slide-up" style={{ animationDelay: "600ms" }}>
                            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-blue-100/50 overflow-hidden">
                                <CardHeader className="pb-4 bg-gradient-to-r from-indigo-200 to-blue-300">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-full bg-white/50 animate-pulse" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-32 bg-white/50 animate-pulse" />
                                            <Skeleton className="h-3 w-20 bg-white/30 animate-pulse" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="text-center p-4 bg-white/60 rounded-xl">
                                                <Skeleton className="h-8 w-8 mx-auto mb-2 rounded animate-pulse" />
                                                <Skeleton className="h-8 w-12 mx-auto mb-1 animate-pulse" />
                                                <Skeleton className="h-3 w-8 mx-auto animate-pulse" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="bg-white/70 rounded-lg p-4 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4 animate-pulse" />
                                                    <Skeleton className="h-4 w-24 animate-pulse" />
                                                </div>
                                                <Skeleton className="h-4 w-full ml-6 animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Price Card */}
                        <div className="animate-slide-up" style={{ animationDelay: "800ms" }}>
                            <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-100/50 overflow-hidden">
                                <CardHeader className="pb-4 bg-gradient-to-r from-green-200 to-emerald-300">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-full bg-white/50 animate-pulse" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-20 bg-white/50 animate-pulse" />
                                            <Skeleton className="h-3 w-24 bg-white/30 animate-pulse" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-center p-6 space-y-4">
                                    <Skeleton className="h-16 w-40 mx-auto rounded-lg animate-pulse" />
                                    <div className="bg-white/70 rounded-lg p-4">
                                        <Skeleton className="h-4 w-48 mx-auto animate-pulse" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Enhanced Action Buttons Skeleton */}
                <div
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-slide-up"
                    style={{ animationDelay: "1000ms" }}
                >
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-14 w-48 rounded-lg animate-pulse" />
                    ))}
                </div>

                {/* Enhanced Footer Skeleton */}
                <div className="text-center pt-8 border-t border-gray-200 animate-fade-in" style={{ animationDelay: "1200ms" }}>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-center gap-2">
                            <Skeleton className="h-5 w-5 animate-pulse" />
                            <Skeleton className="h-5 w-40 animate-pulse" />
                        </div>
                        <Skeleton className="h-4 w-64 mx-auto animate-pulse" />
                        <div className="flex items-center justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 animate-pulse" />
                                <Skeleton className="h-4 w-24 animate-pulse" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 animate-pulse" />
                                <Skeleton className="h-4 w-32 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

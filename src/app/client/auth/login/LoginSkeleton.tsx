"use client"

export default function LoginSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                    {/* Header Skeleton */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl mx-auto mb-4 animate-pulse" />
                        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-2 animate-pulse" />
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse" />
                    </div>

                    {/* Form Fields Skeleton */}
                    <div className="space-y-6">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse" />
                                <div className="h-11 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse" />
                            </div>
                        ))}

                        {/* Button Skeleton */}
                        <div className="h-11 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-lg animate-pulse" />

                        {/* Links Skeleton */}
                        <div className="space-y-2 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-48 mx-auto animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Particules décoratives */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                        className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-bounce"
                        style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                        className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-500/30 rounded-full animate-bounce"
                        style={{ animationDelay: "1s" }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

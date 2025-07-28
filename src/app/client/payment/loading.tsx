import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function PaymentLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header Skeleton */}
                <div className="mb-8 animate-pulse">
                    <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                    <div className="h-8 w-80 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-4 w-60 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Résumé Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between items-center py-3">
                                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                                            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Paiement Skeleton */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-2" />
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-6" />
                                </div>
                                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

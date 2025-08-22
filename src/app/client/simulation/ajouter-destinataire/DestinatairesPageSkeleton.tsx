import { Skeleton } from "@/components/ui/skeleton"

export default function DestinatairesPageSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Coming Soon Card Skeleton */}
            <div className="p-6 border rounded-lg border-dashed">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="p-3 border rounded-lg">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-3 border rounded-lg text-center">
                                <Skeleton className="h-6 w-6 mx-auto mb-2" />
                                <Skeleton className="h-3 w-16 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Destinataires List Skeleton */}
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg border-dashed">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-3 w-48" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
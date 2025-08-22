import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import DestinatairesComponent from "@/components/client-specific/profile/DestinatairesComponent"

function DestinatairesPageSkeleton() {
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

            {/* Coming Soon Notice Skeleton */}
            <div className="p-4 border-2 border-dashed rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-3/4" />
            </div>

            {/* Destinataires List Skeleton */}
            <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-6 border rounded-lg opacity-60">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function DestinatairesPage() {
    return (
        <Suspense fallback={<DestinatairesPageSkeleton />}>
            <DestinatairesComponent />
        </Suspense>
    )
}

import { Suspense } from "react"
import NotificationsList from "@/components/client-specific/profile/NotificationsList"
import { Skeleton } from "@/components/ui/skeleton"

function NotificationsPageSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
            </div>
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-6 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Notifications List Skeleton */}
            <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function NotificationsPage() {
    return (
        <Suspense fallback={<NotificationsPageSkeleton />}>
            <NotificationsList />
        </Suspense>
    )
}

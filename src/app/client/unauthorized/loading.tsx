import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminUnauthorizedLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Skeleton className="w-8 h-8" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="text-center">
                            <Skeleton className="h-4 w-1/2 mx-auto mb-1" />
                            <Skeleton className="h-3 w-1/3 mx-auto" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

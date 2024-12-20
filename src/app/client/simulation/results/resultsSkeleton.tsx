// path: src/app/client/envois/recapitulatif/resultsSkeleton.tsx

'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { MapPin, Package, DollarSign, Weight, Calendar } from 'lucide-react';
function ResultsSkeleton() {
    return (
        <>
            <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f6f7f8 4%, #edeef1 25%, #f6f7f8 36%);
          background-size: 1000px 100%;
        }
      `}</style>
            <div className="max-w-4xl mx-auto p-6 space-y-6 mb-52 bg-gray-50 rounded-lg shadow-lg">
                {/* Title Skeleton */}
                <div className="h-10 rounded-lg w-2/3 mx-auto animate-shimmer" />

                {/* Departure and Destination Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Departure Card */}
                    <Card className="border-l-4 border-blue-500 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                <div className="h-6 rounded w-24 animate-shimmer" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-5 rounded w-3/4 animate-shimmer" />
                            ))}
                        </CardContent>
                    </Card>

                    {/* Destination Card */}
                    <Card className="border-l-4 border-green-500 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="h-5 w-5 text-green-500" />
                                <div className="h-6 rounded w-24 animate-shimmer" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-5 rounded w-3/4 animate-shimmer" />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Parcels Card */}
                <Card className="mt-6 bg-blue-50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-500" />
                            <div className="h-6 rounded w-32 animate-shimmer" />
                        </div>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="p-4 bg-white rounded-lg shadow-sm border">
                                {[1, 2, 3, 4, 5].map((j) => (
                                    <div key={j} className="h-5 rounded w-2/3 mb-2 animate-shimmer" />
                                ))}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Calculations Summary */}
                <Card className="bg-blue-100">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-blue-700" />
                            <div className="h-6 rounded w-40 animate-shimmer" />
                        </div>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                {i === 1 && <Weight className="h-5 w-5 text-gray-500" />}
                                {i !== 1 && <Calendar className="h-5 w-5 text-gray-500" />}
                                <div className="space-y-2">
                                    <div className="h-4 rounded w-24 animate-shimmer" />
                                    <div className="h-5 rounded w-32 animate-shimmer" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Total Price */}
                <Card className="bg-blue-100">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-blue-700" />
                            <div className="h-6 rounded w-24 animate-shimmer" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-10 rounded w-32 mx-auto animate-shimmer" />
                    </CardContent>
                </Card>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 rounded w-40 animate-shimmer" />
                    ))}
                </div>
            </div>
        </>
    );
}

export default ResultsSkeleton

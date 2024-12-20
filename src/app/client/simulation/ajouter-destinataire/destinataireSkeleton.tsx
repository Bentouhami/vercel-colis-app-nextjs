// path: src/app/client/simulation/ajouter-destinataire/destinataireSkeleton.tsx

'use client';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Mail, Phone, User, UserPlus} from 'lucide-react';

const DestinataireSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
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

            <Card className="w-full">
                <CardHeader className="text-center space-y-2">
                    <div className="text-2xl font-bold text-blue-700 flex items-center justify-center gap-2">
                        <UserPlus className="h-6 w-6"/>
                        <div className="h-8 w-48 rounded animate-shimmer"/>
                    </div>
                    <div className="h-4 w-64 mx-auto rounded animate-shimmer"/>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {/* First Name Field */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4"/>
                                    <div className="h-4 w-16 rounded animate-shimmer"/>
                                </div>
                                <div className="h-10 w-full rounded animate-shimmer"/>
                            </div>

                            {/* Last Name Field */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4"/>
                                    <div className="h-4 w-20 rounded animate-shimmer"/>
                                </div>
                                <div className="h-10 w-full rounded animate-shimmer"/>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4"/>
                                    <div className="h-4 w-16 rounded animate-shimmer"/>
                                </div>
                                <div className="h-10 w-full rounded animate-shimmer"/>
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4"/>
                                    <div className="h-4 w-36 rounded animate-shimmer"/>
                                </div>
                                <div className="h-10 w-full rounded animate-shimmer"/>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="h-11 w-full rounded animate-shimmer"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DestinataireSkeleton;